import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool, { prepararBanco } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'troque-esta-chave-no-env';

app.use(cors({ origin: /^http:\/\/localhost:\d+$/ }));
app.use(express.json());

function gerarToken(usuario) {
  return jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '7d' });
}

function emailValido(email) {
  return typeof email === 'string' && /^\S+@\S+\.\S+$/.test(email);
}

// ---------- CADASTRO ----------
app.post('/api/cadastro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({ erro: 'Informe seu nome.' });
    }
    if (!emailValido(email)) {
      return res.status(400).json({ erro: 'E-mail inválido.' });
    }
    if (!senha || senha.length < 6) {
      return res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres.' });
    }

    const emailLimpo = email.trim().toLowerCase();

    const [existente] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [emailLimpo]
    );
    if (existente.length > 0) {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const [resultado] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
      [nome.trim(), emailLimpo, senhaHash]
    );

    const usuario = { id: resultado.insertId, nome: nome.trim(), email: emailLimpo };
    res.status(201).json({ usuario, token: gerarToken(usuario) });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro no servidor. Tente novamente.' });
  }
});

// ---------- LOGIN ----------
app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!emailValido(email) || !senha) {
      return res.status(400).json({ erro: 'Informe e-mail e senha.' });
    }

    const [linhas] = await pool.query(
      'SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    const registro = linhas[0];
    const senhaOk = registro && (await bcrypt.compare(senha, registro.senha_hash));

    if (!senhaOk) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const usuario = { id: registro.id, nome: registro.nome, email: registro.email };
    res.json({ usuario, token: gerarToken(usuario) });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro no servidor. Tente novamente.' });
  }
});

// ---------- ROTA PROTEGIDA (exemplo) ----------
function autenticar(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    req.usuarioId = jwt.verify(token, JWT_SECRET).id;
    next();
  } catch {
    res.status(401).json({ erro: 'Sessão inválida. Faça login novamente.' });
  }
}

app.get('/api/me', autenticar, async (req, res) => {
  const [linhas] = await pool.query(
    'SELECT id, nome, email FROM usuarios WHERE id = ?',
    [req.usuarioId]
  );
  if (!linhas[0]) return res.status(404).json({ erro: 'Usuário não encontrado.' });
  res.json({ usuario: linhas[0] });
});


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
    materias: lerJson(linha.materias),
    horas: linha.horas,
    dias: lerJson(linha.dias),
    data: linha.data_exame || '',
    criadoEm: linha.criado_em,
  };
}

function validarPlano(corpo) {
  const { objetivo, materias, horas, dias, data } = corpo;

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
      materias: materias.map(String),
      horas: horasNum,
      dias: dias.map(String),
      data: data || null,
    },
  };
}

// READ - listar todos os planos do usuário
app.get('/api/planos', autenticar, async (req, res) => {
  try {
    const [linhas] = await pool.query(
      'SELECT * FROM planos WHERE usuario_id = ? ORDER BY id DESC',
      [req.usuarioId]
    );
    res.json({ planos: linhas.map(formatarPlano) });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar planos.' });
  }
});

// READ - buscar um plano
app.get('/api/planos/:id', autenticar, async (req, res) => {
  try {
    const [linhas] = await pool.query(
      'SELECT * FROM planos WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuarioId]
    );
    if (!linhas[0]) return res.status(404).json({ erro: 'Plano não encontrado.' });
    res.json({ plano: formatarPlano(linhas[0]) });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar plano.' });
  }
});

// CREATE - criar plano
app.post('/api/planos', autenticar, async (req, res) => {
  try {
    const { erro, plano } = validarPlano(req.body);
    if (erro) return res.status(400).json({ erro });

    const [resultado] = await pool.query(
      `INSERT INTO planos (usuario_id, objetivo, materias, horas, dias, data_exame)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.usuarioId,
        plano.objetivo,
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
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao salvar plano.' });
  }
});

// UPDATE - editar plano
app.put('/api/planos/:id', autenticar, async (req, res) => {
  try {
    const { erro, plano } = validarPlano(req.body);
    if (erro) return res.status(400).json({ erro });

    const [resultado] = await pool.query(
      `UPDATE planos
          SET objetivo = ?, materias = ?, horas = ?, dias = ?, data_exame = ?
        WHERE id = ? AND usuario_id = ?`,
      [
        plano.objetivo,
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
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar plano.' });
  }
});

// DELETE - excluir plano
app.delete('/api/planos/:id', autenticar, async (req, res) => {
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
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao excluir plano.' });
  }
});


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
app.get('/api/metas', autenticar, async (req, res) => {
  try {
    const [linhas] = await pool.query(
      `SELECT * FROM metas WHERE usuario_id = ?
       ORDER BY concluida ASC, prazo IS NULL, prazo ASC, id DESC`,
      [req.usuarioId]
    );
    res.json({ metas: linhas.map(formatarMeta) });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar metas.' });
  }
});

// READ - buscar uma meta
app.get('/api/metas/:id', autenticar, async (req, res) => {
  try {
    const [linhas] = await pool.query(
      'SELECT * FROM metas WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuarioId]
    );
    if (!linhas[0]) return res.status(404).json({ erro: 'Meta não encontrada.' });
    res.json({ meta: formatarMeta(linhas[0]) });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar meta.' });
  }
});

// CREATE - criar meta
app.post('/api/metas', autenticar, async (req, res) => {
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
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao salvar meta.' });
  }
});

// UPDATE - editar meta (também usada para marcar como concluída)
app.put('/api/metas/:id', autenticar, async (req, res) => {
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
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar meta.' });
  }
});

// DELETE - excluir meta
app.delete('/api/metas/:id', autenticar, async (req, res) => {
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
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao excluir meta.' });
  }
});

prepararBanco()
  .then(() => {
    app.listen(PORT, () => {
      console.log('Banco de dados OK (tabelas prontas).');
      console.log(`API rodando em http://localhost:${PORT}`);
    });
  })
  .catch((erro) => {
    console.error('\n========================================');
    console.error('NÃO FOI POSSÍVEL CONECTAR AO MYSQL');
    console.error('Motivo:', erro.message);
    console.error('');
    console.error('1) O MySQL está ligado?');
    console.error('2) A senha em DB_PASSWORD (arquivo .env) está correta?');
    console.error('Depois de ajustar o .env, rode "npm run dev" de novo.');
    console.error('========================================\n');
    process.exit(1);
  });
