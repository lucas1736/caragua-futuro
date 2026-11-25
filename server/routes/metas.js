import express from 'express';
import pool from '../db.js';
import { criarAutenticacao } from '../middleware/autenticar.js';
import { validarId } from '../validators/ids.js';
import { sugestoesDaModalidade } from '../../shared/metasSugeridas.js';

export function criarRotasMetas(pool) {
  const router = express.Router();
  const autenticar = criarAutenticacao(process.env.JWT_SECRET);
  router.use(autenticar);
  router.param('id', (req, res, next) => validarId(req, res, next));

  // =====================================================
  // CRUD DE METAS DE ESTUDO  (todas as rotas exigem login)
  // =====================================================

  const PRIORIDADES = ['Baixa', 'Média', 'Alta'];

  function formatarMeta(linha) {
    return {
      id: linha.id,
      titulo: linha.titulo,
      materia: linha.materia,
      descricao: linha.descricao || '',
      modalidade: linha.modalidade || null,
      prioridade: linha.prioridade,
      prazo: linha.prazo || '',
      concluida: Boolean(linha.concluida),
      criadoEm: linha.criado_em,
    };
  }

  function validarMeta(corpo) {
    if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) {
      return { erro: 'Envie os dados da meta em formato válido.' };
    }
    const { titulo, materia, descricao, prioridade, prazo, concluida } = corpo;

    if (!titulo || typeof titulo !== 'string' || !titulo.trim() || titulo.length > 120) {
      return { erro: 'Informe um título (até 120 caracteres).' };
    }
    if (!materia || typeof materia !== 'string' || materia.length > 50) {
      return { erro: 'Escolha uma matéria.' };
    }
    if (descricao && (typeof descricao !== 'string' || descricao.length > 500)) {
      return { erro: 'A descrição pode ter no máximo 500 caracteres.' };
    }
    if (!PRIORIDADES.includes(prioridade)) {
      return { erro: 'Prioridade inválida.' };
    }
    if (prazo && !/^\d{4}-\d{2}-\d{2}$/.test(prazo)) {
      return { erro: 'Prazo inválido.' };
    }

    return {
      meta: {
        titulo: titulo.trim(),
        materia,
        descricao: descricao ? descricao.trim() : null,
        prioridade,
        prazo: prazo || null,
        concluida: concluida ? 1 : 0,
      },
    };
  }

  router.get('/modalidade-preferida', async (req, res, next) => {
    try {
      const [linhas] = await pool.query('SELECT modalidade_preferida FROM usuarios WHERE id = ?', [
        req.usuarioId,
      ]);
      if (!linhas[0]) return res.status(404).json({ erro: 'Usuário não encontrado.' });
      res.json({ modalidade: linhas[0].modalidade_preferida || '' });
    } catch (erro) {
      next(erro);
    }
  });

  // Garante as metas de preparação da modalidade na conta autenticada.
  router.post('/sincronizar-sugestoes', async (req, res, next) => {
    try {
      const { modalidade } = req.body || {};
      const sugestoes = sugestoesDaModalidade(modalidade);
      if (!sugestoes.length) return res.status(400).json({ erro: 'Modalidade inválida.' });

      await pool.query('UPDATE usuarios SET modalidade_preferida = ? WHERE id = ?', [
        modalidade,
        req.usuarioId,
      ]);
      const [existentes] = await pool.query(
        'SELECT titulo, chave_sugestao FROM metas WHERE usuario_id = ?',
        [req.usuarioId],
      );
      const chavesExistentes = new Set(
        existentes.map((meta) => meta.chave_sugestao).filter(Boolean),
      );

      for (const [indice, sugestao] of sugestoes.entries()) {
        const chave = `${modalidade}-${String(indice + 1).padStart(2, '0')}`;
        if (chavesExistentes.has(chave)) continue;

        const [legadas] = await pool.query(
          `SELECT id FROM metas
         WHERE usuario_id = ? AND titulo = ? AND chave_sugestao IS NULL LIMIT 1`,
          [req.usuarioId, sugestao.titulo],
        );
        if (legadas[0]) {
          await pool.query(
            'UPDATE metas SET modalidade = ?, chave_sugestao = ? WHERE id = ? AND usuario_id = ?',
            [modalidade, chave, legadas[0].id, req.usuarioId],
          );
        } else {
          await pool.query(
            `INSERT IGNORE INTO metas
            (usuario_id, titulo, materia, modalidade, chave_sugestao, descricao, prioridade, prazo, concluida)
           VALUES (?, ?, ?, ?, ?, ?, ?, NULL, 0)`,
            [
              req.usuarioId,
              sugestao.titulo,
              sugestao.materia,
              modalidade,
              chave,
              sugestao.descricao,
              sugestao.prioridade,
            ],
          );
        }
        chavesExistentes.add(chave);
      }

      const [linhas] = await pool.query(
        `SELECT * FROM metas WHERE usuario_id = ? AND modalidade = ?
       ORDER BY concluida ASC, prazo IS NULL, prazo ASC, id DESC`,
        [req.usuarioId, modalidade],
      );
      res.json({ metas: linhas.map(formatarMeta) });
    } catch (erro) {
      next(erro);
    }
  });

  // READ - listar todas as metas do usuário
  router.get('/', async (req, res, next) => {
    try {
      const [linhas] = await pool.query(
        `SELECT * FROM metas WHERE usuario_id = ?
       ORDER BY concluida ASC, prazo IS NULL, prazo ASC, id DESC`,
        [req.usuarioId],
      );
      res.json({ metas: linhas.map(formatarMeta) });
    } catch (erro) {
      next(erro);
    }
  });

  // READ - buscar uma meta
  router.get('/:id', async (req, res, next) => {
    try {
      const [linhas] = await pool.query('SELECT * FROM metas WHERE id = ? AND usuario_id = ?', [
        req.params.id,
        req.usuarioId,
      ]);
      if (!linhas[0]) return res.status(404).json({ erro: 'Meta não encontrada.' });
      res.json({ meta: formatarMeta(linhas[0]) });
    } catch (erro) {
      next(erro);
    }
  });

  // CREATE - criar meta
  router.post('/', async (req, res, next) => {
    try {
      const { erro, meta } = validarMeta(req.body);
      if (erro) return res.status(400).json({ erro });

      const [resultado] = await pool.query(
        `INSERT INTO metas (usuario_id, titulo, materia, descricao, prioridade, prazo, concluida)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          req.usuarioId,
          meta.titulo,
          meta.materia,
          meta.descricao,
          meta.prioridade,
          meta.prazo,
          meta.concluida,
        ],
      );

      const [linhas] = await pool.query('SELECT * FROM metas WHERE id = ?', [resultado.insertId]);
      res.status(201).json({ meta: formatarMeta(linhas[0]) });
    } catch (erro) {
      next(erro);
    }
  });

  // UPDATE - editar meta (também usada para marcar como concluída)
  router.put('/:id', async (req, res, next) => {
    try {
      const { erro, meta } = validarMeta(req.body);
      if (erro) return res.status(400).json({ erro });

      const [resultado] = await pool.query(
        `UPDATE metas
          SET titulo = ?, materia = ?, descricao = ?, prioridade = ?, prazo = ?, concluida = ?
        WHERE id = ? AND usuario_id = ?`,
        [
          meta.titulo,
          meta.materia,
          meta.descricao,
          meta.prioridade,
          meta.prazo,
          meta.concluida,
          req.params.id,
          req.usuarioId,
        ],
      );

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ erro: 'Meta não encontrada.' });
      }

      const [linhas] = await pool.query('SELECT * FROM metas WHERE id = ?', [req.params.id]);
      res.json({ meta: formatarMeta(linhas[0]) });
    } catch (erro) {
      next(erro);
    }
  });

  // DELETE - excluir meta
  router.delete('/:id', async (req, res, next) => {
    try {
      const [resultado] = await pool.query('DELETE FROM metas WHERE id = ? AND usuario_id = ?', [
        req.params.id,
        req.usuarioId,
      ]);
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ erro: 'Meta não encontrada.' });
      }
      res.json({ ok: true });
    } catch (erro) {
      next(erro);
    }
  });

  return router;
}

export default criarRotasMetas(pool);
