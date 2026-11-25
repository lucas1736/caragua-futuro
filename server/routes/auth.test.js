import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { criarRotasAutenticacao } from './auth.js';

const segredoTeste = 'segredo-de-teste-com-mais-de-trinta-e-dois-caracteres';

function criarPoolEmMemoria(usuario) {
  return {
    usuario,
    async query(sql, parametros = []) {
      if (sql.includes('SELECT id FROM usuarios WHERE email = ? AND id != ?')) {
        return [
          usuario.email === parametros[0] && usuario.id !== parametros[1]
            ? [{ id: usuario.id }]
            : [],
        ];
      }
      if (sql.includes('SELECT id, senha_hash, telefone, foto FROM usuarios WHERE id = ?')) {
        return [
          usuario.id === parametros[0]
            ? [
                {
                  id: usuario.id,
                  senha_hash: usuario.senha_hash,
                  telefone: usuario.telefone,
                  foto: usuario.foto,
                },
              ]
            : [],
        ];
      }
      if (sql.includes('UPDATE usuarios')) {
        const [nome, email, telefone, foto, ...resto] = parametros;
        usuario.nome = nome;
        usuario.email = email;
        usuario.telefone = telefone;
        usuario.foto = foto;
        if (sql.includes('senha_hash = ?')) usuario.senha_hash = resto[0];
        return [{ affectedRows: 1 }];
      }
      if (sql.includes('SELECT id, nome, email, telefone, foto FROM usuarios WHERE id = ?')) {
        return [
          usuario.id === parametros[0]
            ? [
                {
                  id: usuario.id,
                  nome: usuario.nome,
                  email: usuario.email,
                  telefone: usuario.telefone,
                  foto: usuario.foto,
                },
              ]
            : [],
        ];
      }
      if (
        sql.includes(
          'SELECT id, nome, email, telefone, foto, senha_hash FROM usuarios WHERE email = ?',
        )
      ) {
        return [usuario.email === parametros[0] ? [{ ...usuario }] : []];
      }
      throw new Error(`Consulta não prevista no pool de teste: ${sql}`);
    },
  };
}

function criarApp(pool) {
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.use('/api', criarRotasAutenticacao(pool, segredoTeste));
  return app;
}

describe('perfil, senha e foto vinculados à conta', () => {
  it('valida senha atual com bcrypt, salva a nova senha e permite novo login', async () => {
    const senhaInicial = 'Senha atual correta 2026!';
    const usuario = {
      id: 31,
      nome: 'Estudante',
      email: 'estudante@example.com',
      telefone: null,
      foto: null,
      senha_hash: await bcrypt.hash(senhaInicial, 10),
    };
    const app = criarApp(criarPoolEmMemoria(usuario));
    const token = jwt.sign({ id: usuario.id }, segredoTeste);

    const atualizacao = await request(app)
      .put('/api/perfil')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: usuario.nome,
        email: usuario.email,
        telefone: '',
        senhaAtual: senhaInicial,
        novaSenha: 'Nova senha correta 2026!',
      });

    expect(atualizacao.status).toBe(200);
    expect(await bcrypt.compare('Nova senha correta 2026!', usuario.senha_hash)).toBe(true);
    expect(usuario.senha_hash).not.toBe(senhaInicial);

    const loginAntigo = await request(app)
      .post('/api/login')
      .send({ email: usuario.email, senha: senhaInicial });
    const loginNovo = await request(app)
      .post('/api/login')
      .send({ email: usuario.email, senha: 'Nova senha correta 2026!' });

    expect(loginAntigo.status).toBe(401);
    expect(loginNovo.status).toBe(200);
  });

  it('persiste a foto no perfil e a retorna após novo login', async () => {
    const usuario = {
      id: 42,
      nome: 'Estudante',
      email: 'foto@example.com',
      telefone: null,
      foto: null,
      senha_hash: await bcrypt.hash('senha segura inicial', 10),
    };
    const app = criarApp(criarPoolEmMemoria(usuario));
    const token = jwt.sign({ id: usuario.id }, segredoTeste);
    const foto = `data:image/jpeg;base64,${'a'.repeat(120)}`;

    const atualizacao = await request(app)
      .put('/api/perfil')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: usuario.nome, email: usuario.email, telefone: '', foto });
    const login = await request(app)
      .post('/api/login')
      .send({ email: usuario.email, senha: 'senha segura inicial' });

    expect(atualizacao.status).toBe(200);
    expect(atualizacao.body.usuario.foto).toBe(foto);
    expect(login.status).toBe(200);
    expect(login.body.usuario.foto).toBe(foto);
  });
});
