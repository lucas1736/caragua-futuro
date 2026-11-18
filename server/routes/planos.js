import express from 'express';
import pool from '../db.js';
import { criarAutenticacao } from '../middleware/autenticar.js';
import { validarId } from '../validators/ids.js';

const router = express.Router();
const autenticar = criarAutenticacao(process.env.JWT_SECRET);
router.use(autenticar);
router.param('id', (req, res, next) => validarId(req, res, next));

// =====================================================
// CRUD DE PLANOS DE ESTUDO  (todas as rotas exigem login)
// =====================================================

function lerJson(valor) {
  // MySQL devolve JSON já convertido; MariaDB devolve texto
  return typeof valor === 'string' ? JSON.parse(valor) : valor;
}

function formatarPlano(linha) {
  return {
    id: linha.id,
    objetivo: linha.objetivo,
    modalidade: linha.modalidade || '',
    materias: lerJson(linha.materias),
    horas: linha.horas,
    dias: lerJson(linha.dias),
    data: linha.data_exame || '',
    criadoEm: linha.criado_em,
  };
}

function validarPlano(corpo) {
  if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) {
    return { erro: 'Envie os dados do plano em formato válido.' };
  }
  const { objetivo, materias, horas, dias, data, modalidade } = corpo;

  if (!objetivo || typeof objetivo !== 'string' || objetivo.length > 50) {
    return { erro: 'Objetivo inválido.' };
  }
  if (!Array.isArray(materias) || materias.length === 0) {
    return { erro: 'Selecione pelo menos uma matéria.' };
  }
  if (!Array.isArray(dias) || dias.length === 0) {
    return { erro: 'Selecione pelo menos um dia da semana.' };
  }
  const horasNum = Number(horas);
  if (!Number.isInteger(horasNum) || horasNum < 1 || horasNum > 8) {
    return { erro: 'As horas por dia devem ficar entre 1 e 8.' };
  }
  if (data && !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return { erro: 'Data inválida.' };
  }

  return {
    plano: {
      objetivo,
      modalidade: typeof modalidade === 'string' && modalidade.trim()
        ? modalidade.trim().slice(0, 60)
        : '',
      materias: materias.map(String),
      horas: horasNum,
      dias: dias.map(String),
      data: data || null,
    },
  };
}

// READ - listar todos os planos do usuário
router.get('/', async (req, res, next) => {
  try {
    const [linhas] = await pool.query(
      'SELECT * FROM planos WHERE usuario_id = ? ORDER BY id DESC',
      [req.usuarioId]
    );
    res.json({ planos: linhas.map(formatarPlano) });
  } catch (erro) {
    next(erro);
  }
});

// READ - buscar um plano
router.get('/:id', async (req, res, next) => {
  try {
    const [linhas] = await pool.query(
      'SELECT * FROM planos WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuarioId]
    );
    if (!linhas[0]) return res.status(404).json({ erro: 'Plano não encontrado.' });
    res.json({ plano: formatarPlano(linhas[0]) });
  } catch (erro) {
    next(erro);
  }
});

// CREATE - criar plano
router.post('/', async (req, res, next) => {
  try {
    const { erro, plano } = validarPlano(req.body);
    if (erro) return res.status(400).json({ erro });

    const [resultado] = await pool.query(
      `INSERT INTO planos (usuario_id, objetivo, modalidade, materias, horas, dias, data_exame)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.usuarioId,
        plano.objetivo,
        plano.modalidade,
        JSON.stringify(plano.materias),
        plano.horas,
        JSON.stringify(plano.dias),
        plano.data,
      ]
    );

    const [linhas] = await pool.query('SELECT * FROM planos WHERE id = ?', [
      resultado.insertId,
    ]);
    res.status(201).json({ plano: formatarPlano(linhas[0]) });
  } catch (erro) {
    next(erro);
  }
});

// UPDATE - editar plano
router.put('/:id', async (req, res, next) => {
  try {
    const { erro, plano } = validarPlano(req.body);
    if (erro) return res.status(400).json({ erro });

    const [resultado] = await pool.query(
      `UPDATE planos
          SET objetivo = ?, modalidade = ?, materias = ?, horas = ?, dias = ?, data_exame = ?
        WHERE id = ? AND usuario_id = ?`,
      [
        plano.objetivo,
        plano.modalidade,
        JSON.stringify(plano.materias),
        plano.horas,
        JSON.stringify(plano.dias),
        plano.data,
        req.params.id,
        req.usuarioId,
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Plano não encontrado.' });
    }

    const [linhas] = await pool.query('SELECT * FROM planos WHERE id = ?', [
      req.params.id,
    ]);
    res.json({ plano: formatarPlano(linhas[0]) });
  } catch (erro) {
    next(erro);
  }
});

// DELETE - excluir plano
router.delete('/:id', async (req, res, next) => {
  try {
    const [resultado] = await pool.query(
      'DELETE FROM planos WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuarioId]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Plano não encontrado.' });
    }
    res.json({ ok: true });
  } catch (erro) {
    next(erro);
  }
});

export default router;
