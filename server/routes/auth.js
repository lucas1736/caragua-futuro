import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { criarAutenticacao } from '../middleware/autenticar.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const autenticar = criarAutenticacao(JWT_SECRET);
function gerarToken(usuario) { return jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '7d' }); }
function emailValido(email) { return typeof email === 'string' && /^\S+@\S+\.\S+$/.test(email); }

// ---------- CADASTRO ----------
router.post('/cadastro', async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ erro: 'Envie os dados do cadastro em formato válido.' });
    }
    const { nome, email, senha } = req.body;

    if (typeof nome !== 'string' || !nome.trim() || nome.trim().length > 100) {
      return res.status(400).json({ erro: 'Informe um nome válido (até 100 caracteres).' });
    }
    if (!emailValido(email) || email.length > 150) {
      return res.status(400).json({ erro: 'E-mail inválido (máximo de 150 caracteres).' });
    }
    if (typeof senha !== 'string' || senha.length < 8 || senha.length > 200) {
      return res.status(400).json({ erro: 'A senha precisa ter pelo menos 8 caracteres.' });
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

    const usuario = { id: resultado.insertId, nome: nome.trim(), email: emailLimpo, telefone: null, foto: null };
    res.status(201).json({ usuario, token: gerarToken(usuario) });
  } catch (erro) {
    next(erro);
  }
});

// ---------- LOGIN ----------
router.post('/login', async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ erro: 'Envie e-mail e senha em formato válido.' });
    }
    const { email, senha } = req.body;

    if (!emailValido(email) || email.length > 150 || typeof senha !== 'string' || !senha || senha.length > 200) {
      return res.status(400).json({ erro: 'Informe um e-mail e uma senha válidos.' });
    }

    const [linhas] = await pool.query(
      'SELECT id, nome, email, telefone, foto, senha_hash FROM usuarios WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    const registro = linhas[0];
    const senhaOk = registro && (await bcrypt.compare(senha, registro.senha_hash));

    if (!senhaOk) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const usuario = {
      id: registro.id,
      nome: registro.nome,
      email: registro.email,
      telefone: registro.telefone || null,
      foto: registro.foto || null,
    };
    res.json({ usuario, token: gerarToken(usuario) });
  } catch (erro) {
    next(erro);
  }
});

// ---------- ROTAS PROTEGIDAS DE CONTA ----------
router.get('/me', autenticar, async (req, res, next) => {
  try {
    const [linhas] = await pool.query(
      'SELECT id, nome, email, telefone, foto FROM usuarios WHERE id = ?',
      [req.usuarioId]
    );
    if (!linhas[0]) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    res.json({ usuario: linhas[0] });
  } catch (erro) {
    next(erro);
  }
});

// ---------- PERFIL (atualizar dados pessoais) ----------
router.put('/perfil', autenticar, async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ erro: 'Envie os dados do perfil em formato válido.' });
    }
    const { nome, email, telefone, foto, senhaAtual, novaSenha } = req.body;

    if (typeof nome !== 'string' || !nome.trim() || nome.trim().length > 100) {
      return res.status(400).json({ erro: 'Informe um nome válido (até 100 caracteres).' });
    }
    if (!emailValido(email) || email.length > 150) {
      return res.status(400).json({ erro: 'E-mail inválido (máximo de 150 caracteres).' });
    }

    const telefoneLimpo = typeof telefone === 'string' ? telefone.trim() : '';
    if (telefoneLimpo && !/^[\d()+\-\s]{8,20}$/.test(telefoneLimpo)) {
      return res.status(400).json({ erro: 'Telefone inválido. Ex.: (12) 99123-4567.' });
    }

    if (foto !== undefined && foto !== null && foto !== '') {
      if (typeof foto !== 'string' || !foto.startsWith('data:image/')) {
        return res.status(400).json({ erro: 'Formato de foto inválido.' });
      }
      if (foto.length > 1_500_000) {
        return res.status(400).json({ erro: 'A foto é muito grande. Escolha uma imagem menor.' });
      }
    }

    const emailLimpo = email.trim().toLowerCase();

    // E-mail não pode estar em uso por outro usuário
    const [outro] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ? AND id != ?',
      [emailLimpo, req.usuarioId]
    );
    if (outro.length > 0) {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado por outra conta.' });
    }

    // Busca o usuário atual ANTES de montar o UPDATE, para preservar
    // telefone/foto quando o frontend não enviar esses campos.
    const [linhas] = await pool.query(
      'SELECT id, senha_hash, telefone, foto FROM usuarios WHERE id = ?',
      [req.usuarioId]
    );
    if (!linhas[0]) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    const atual = linhas[0];

    // Campos ausentes no corpo preservam o valor já salvo no banco.
    // Foto/telefone = null ou '' significa "remover" de propósito.
    const telefoneFinal = telefone === undefined ? atual.telefone : telefoneLimpo || null;
    const fotoFinal = foto === undefined ? atual.foto : foto || null;

    // Troca de senha (opcional): exige a senha atual
    let novaHash = null;
    if (novaSenha) {
      if (typeof novaSenha !== 'string' || novaSenha.length < 8) {
        return res.status(400).json({ erro: 'A nova senha precisa ter pelo menos 8 caracteres.' });
      }
      if (senhaAtual === undefined || senhaAtual === null || senhaAtual === '') {
        return res.status(400).json({ erro: 'Informe sua senha atual para alterá-la.' });
      }

      // Aceita a senha como digitada e também sem espaços nas pontas
      // (evita erro por espaço acidental ao colar/autocompletar).
      const tentativas = [...new Set([String(senhaAtual), String(senhaAtual).trim()])];
      let senhaAtualOk = false;
      for (const tentativa of tentativas) {
        senhaAtualOk = await bcrypt.compare(tentativa, atual.senha_hash);
        if (senhaAtualOk) break;
      }

      if (!senhaAtualOk) {
        return res.status(401).json({ erro: 'A senha atual está incorreta. Confira e tente novamente.' });
      }
      novaHash = await bcrypt.hash(novaSenha, 10);
    }

    await pool.query(
      `UPDATE usuarios
          SET nome = ?, email = ?, telefone = ?, foto = ?${novaHash ? ', senha_hash = ?' : ''}
        WHERE id = ?`,
      novaHash
        ? [nome.trim(), emailLimpo, telefoneFinal, fotoFinal, novaHash, req.usuarioId]
        : [nome.trim(), emailLimpo, telefoneFinal, fotoFinal, req.usuarioId]
    );

    const [atualizado] = await pool.query(
      'SELECT id, nome, email, telefone, foto FROM usuarios WHERE id = ?',
      [req.usuarioId]
    );

    const usuario = atualizado[0];
    res.json({ usuario, token: gerarToken(usuario) });
  } catch (erro) {
    next(erro);
  }
});



export default router;
