import express from 'express';
import pool from '../db.js';
import { criarAutenticacao } from '../middleware/autenticar.js';

const router = express.Router();
router.use(criarAutenticacao(process.env.JWT_SECRET));

function validarData(data) {
  if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const dataNormalizada = new Date(`${data}T00:00:00Z`);
  return !Number.isNaN(dataNormalizada.getTime()) && dataNormalizada.toISOString().slice(0, 10) === data;
}

router.post('/importar', async (req, res, next) => {
  let conexao;
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ erro: 'Dados para importação inválidos.' });
    }
    conexao = await pool.getConnection();
    const { plano, progresso, simulados } = req.body;
    await conexao.beginTransaction();
    if (plano && typeof plano === 'object' && Array.isArray(plano.materias) && Array.isArray(plano.dias)) {
      const [ativos] = await conexao.query(
        'SELECT id FROM planos WHERE usuario_id = ? AND ativo = 1 LIMIT 1',
        [req.usuarioId]
      );
      if (ativos.length === 0) {
        await conexao.query(
          `INSERT INTO planos (usuario_id, objetivo, modalidade, vestibulares, materias, horas, dias, data_exame, ativo)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [req.usuarioId, String(plano.objetivo || 'Plano importado').slice(0, 50),
            typeof plano.modalidade === 'string' ? plano.modalidade.slice(0, 60) : '',
            JSON.stringify(Array.isArray(plano.vestibulares) ? plano.vestibulares : []),
            JSON.stringify(plano.materias.map(String)), Math.min(8, Math.max(1, Number(plano.horas) || 1)),
            JSON.stringify(plano.dias.map(String)), validarData(plano.data) ? plano.data : null]
        );
      }
    }
    const registrosParaImportar = progresso?.registros && typeof progresso.registros === 'object' && !Array.isArray(progresso.registros)
      ? Object.entries(progresso.registros).slice(0, 400)
      : [];
    for (const [data, horasBrutas] of registrosParaImportar) {
      const horas = Number(horasBrutas);
      if (!validarData(data) || !Number.isFinite(horas) || horas <= 0) continue;
      await conexao.query(
        `INSERT INTO registros_estudo (usuario_id, data, horas) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE horas = LEAST(24, horas + VALUES(horas))`,
        [req.usuarioId, data, Math.min(24, horas)]
      );
    }
    for (const resultado of (Array.isArray(simulados?.historico) ? simulados.historico.slice(0, 1000) : [])) {
      if (!resultado?.modalidade || !Number.isInteger(resultado.acertos) || !Number.isInteger(resultado.total) || resultado.total <= 0 || resultado.acertos < 0 || resultado.acertos > resultado.total) continue;
      const desempenhoMaterias = Array.isArray(resultado.desempenhoMaterias)
        ? resultado.desempenhoMaterias.filter((item) => item && typeof item.materia === 'string' && item.materia.length <= 80 && Number.isInteger(item.acertos) && Number.isInteger(item.total) && item.total > 0 && item.acertos >= 0 && item.acertos <= item.total).slice(0, 30)
        : [];
      await conexao.query(
        `INSERT INTO resultados_simulado (usuario_id, modalidade, acertos, total, duracao_segundos, desempenho_materias, criado_em)
         VALUES (?, ?, ?, ?, 0, ?, ?)`,
        [req.usuarioId, String(resultado.modalidade).slice(0, 60), resultado.acertos, resultado.total,
          JSON.stringify(desempenhoMaterias), resultado.data && !Number.isNaN(Date.parse(resultado.data)) ? new Date(resultado.data) : new Date()]
      );
    }
    await conexao.commit();
    res.json({ ok: true });
  } catch (erro) {
    if (conexao) await conexao.rollback();
    next(erro);
  } finally {
    conexao?.release();
  }
});

router.get('/registros-estudo', async (req, res, next) => {
  try {
    const [linhas] = await pool.query(
      'SELECT data, horas FROM registros_estudo WHERE usuario_id = ? ORDER BY data DESC',
      [req.usuarioId]
    );
    res.json({ registros: linhas.map((linha) => ({ data: linha.data, horas: Number(linha.horas) })) });
  } catch (erro) { next(erro); }
});

router.post('/registros-estudo', async (req, res, next) => {
  try {
    const { data, horas } = req.body || {};
    const valorHoras = Number(horas);
    if (!validarData(data) || !Number.isFinite(valorHoras) || valorHoras <= 0 || valorHoras > 24) {
      return res.status(400).json({ erro: 'Informe uma data válida e horas entre 0 e 24.' });
    }
    const [atual] = await pool.query(
      'SELECT horas FROM registros_estudo WHERE usuario_id = ? AND data = ?',
      [req.usuarioId, data]
    );
    const totalHoras = Math.min(24, (Number(atual[0]?.horas) || 0) + valorHoras);
    await pool.query(
      `INSERT INTO registros_estudo (usuario_id, data, horas) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE horas = VALUES(horas)`,
      [req.usuarioId, data, totalHoras]
    );
    res.status(201).json({ ok: true });
  } catch (erro) { next(erro); }
});

router.put('/registros-estudo/:data', async (req, res, next) => {
  try {
    const { data } = req.params;
    const horas = Number(req.body?.horas);
    if (!validarData(data) || !Number.isFinite(horas) || horas <= 0 || horas > 24) {
      return res.status(400).json({ erro: 'Informe uma data válida e horas entre 0 e 24.' });
    }
    await pool.query(
      `INSERT INTO registros_estudo (usuario_id, data, horas) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE horas = VALUES(horas)`,
      [req.usuarioId, data, horas]
    );
    res.json({ ok: true });
  } catch (erro) { next(erro); }
});

router.delete('/registros-estudo/:data', async (req, res, next) => {
  try {
    if (!validarData(req.params.data)) return res.status(400).json({ erro: 'Data inválida.' });
    await pool.query('DELETE FROM registros_estudo WHERE usuario_id = ? AND data = ?', [req.usuarioId, req.params.data]);
    res.json({ ok: true });
  } catch (erro) { next(erro); }
});

router.delete('/registros-estudo', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM registros_estudo WHERE usuario_id = ?', [req.usuarioId]);
    res.json({ ok: true });
  } catch (erro) { next(erro); }
});

router.get('/resultados-simulado', async (req, res, next) => {
  try {
    const [linhas] = await pool.query(
      `SELECT id, modalidade, acertos, total, duracao_segundos AS duracaoSegundos,
              desempenho_materias AS desempenhoMaterias, criado_em AS criadoEm
       FROM resultados_simulado WHERE usuario_id = ? ORDER BY criado_em DESC`,
      [req.usuarioId]
    );
    res.json({ resultados: linhas });
  } catch (erro) { next(erro); }
});

router.post('/resultados-simulado', async (req, res, next) => {
  try {
    const { modalidade, acertos, total, duracaoSegundos = 0, desempenhoMaterias = [] } = req.body || {};
    if (
      typeof modalidade !== 'string' || !modalidade.trim() || modalidade.length > 60 ||
      !Number.isInteger(acertos) || !Number.isInteger(total) || total < 1 ||
      acertos < 0 || acertos > total || !Number.isInteger(duracaoSegundos) || duracaoSegundos < 0 ||
      !Array.isArray(desempenhoMaterias) || desempenhoMaterias.length > 30 || desempenhoMaterias.some((item) =>
        !item || typeof item.materia !== 'string' || !item.materia.trim() || item.materia.length > 80 ||
        !Number.isInteger(item.acertos) || !Number.isInteger(item.total) || item.total < 1 ||
        item.acertos < 0 || item.acertos > item.total
      )
    ) {
      return res.status(400).json({ erro: 'Resultado de simulado inválido.' });
    }
    const [resultado] = await pool.query(
      `INSERT INTO resultados_simulado (usuario_id, modalidade, acertos, total, duracao_segundos, desempenho_materias)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.usuarioId, modalidade.trim(), acertos, total, duracaoSegundos, JSON.stringify(desempenhoMaterias)]
    );
    res.status(201).json({ id: resultado.insertId });
  } catch (erro) { next(erro); }
});

router.put('/resultados-simulado/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { modalidade, acertos, total, duracaoSegundos = 0 } = req.body || {};
    if (!/^[1-9]\d*$/.test(req.params.id) || !Number.isSafeInteger(id)) {
      return res.status(400).json({ erro: 'Identificador inválido.' });
    }
    if (typeof modalidade !== 'string' || !modalidade.trim() || modalidade.length > 60 ||
      !Number.isInteger(acertos) || !Number.isInteger(total) || total < 1 ||
      acertos < 0 || acertos > total || !Number.isInteger(duracaoSegundos) || duracaoSegundos < 0) {
      return res.status(400).json({ erro: 'Resultado de simulado inválido.' });
    }
    const [resultado] = await pool.query(
      `UPDATE resultados_simulado
       SET modalidade = ?, acertos = ?, total = ?, duracao_segundos = ?
       WHERE usuario_id = ? AND id = ?`,
      [modalidade.trim(), acertos, total, duracaoSegundos, req.usuarioId, id]
    );
    if (!resultado.affectedRows) return res.status(404).json({ erro: 'Resultado não encontrado.' });
    res.json({ ok: true });
  } catch (erro) { next(erro); }
});

router.delete('/resultados-simulado/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!/^[1-9]\d*$/.test(req.params.id) || !Number.isSafeInteger(id)) {
      return res.status(400).json({ erro: 'Identificador inválido.' });
    }
    const [resultado] = await pool.query(
      'DELETE FROM resultados_simulado WHERE usuario_id = ? AND id = ?',
      [req.usuarioId, id]
    );
    if (!resultado.affectedRows) return res.status(404).json({ erro: 'Resultado não encontrado.' });
    res.json({ ok: true });
  } catch (erro) { next(erro); }
});

router.delete('/resultados-simulado', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM resultados_simulado WHERE usuario_id = ?', [req.usuarioId]);
    res.json({ ok: true });
  } catch (erro) { next(erro); }
});

export default router;
