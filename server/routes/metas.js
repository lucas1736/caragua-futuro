import express from 'express';
import pool from '../db.js';
import { criarAutenticacao } from '../middleware/autenticar.js';
import { validarId } from '../validators/ids.js';

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

// READ - listar todas as metas do usuário
router.get('/', async (req, res, next) => {
  try {
    const [linhas] = await pool.query(
      `SELECT * FROM metas WHERE usuario_id = ?
       ORDER BY concluida ASC, prazo IS NULL, prazo ASC, id DESC`,
      [req.usuarioId]
    );
    res.json({ metas: linhas.map(formatarMeta) });
  } catch (erro) {
    next(erro);
  }
});

// READ - buscar uma meta
router.get('/:id', async (req, res, next) => {
  try {
    const [linhas] = await pool.query(
      'SELECT * FROM metas WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuarioId]
    );
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
      ]
    );

    const [linhas] = await pool.query('SELECT * FROM metas WHERE id = ?', [
      resultado.insertId,
    ]);
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
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Meta não encontrada.' });
    }

    const [linhas] = await pool.query('SELECT * FROM metas WHERE id = ?', [
      req.params.id,
    ]);
    res.json({ meta: formatarMeta(linhas[0]) });
  } catch (erro) {
    next(erro);
  }
});

// DELETE - excluir meta
router.delete('/:id', async (req, res, next) => {
  try {
    const [resultado] = await pool.query(
      'DELETE FROM metas WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuarioId]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Meta não encontrada.' });
    }
    res.json({ ok: true });
  } catch (erro) {
    next(erro);
  }
});


export default router;
