import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { criarRotasPlanos } from './planos.js';

const segredo = 'chave-de-teste-comprida-o-suficiente-para-assinar';
process.env.JWT_SECRET = segredo;

function criarPoolEmMemoria() {
  let proximoId = 1;
  const planos = [];
  const pool = {
    planos,
    async getConnection() {
      return {
        query: (...argumentos) => pool.query(...argumentos),
        async beginTransaction() {},
        async commit() {},
        async rollback() {},
        release() {},
      };
    },
    async query(sql, parametros = []) {
      if (sql.includes('SELECT * FROM planos WHERE usuario_id = ? ORDER BY')) {
        return [
          planos
            .filter((plano) => plano.usuario_id === parametros[0])
            .map((plano) => ({ ...plano })),
        ];
      }
      if (sql.includes('SELECT * FROM planos WHERE usuario_id = ? AND ativo = 1')) {
        return [
          planos
            .filter((plano) => plano.usuario_id === parametros[0] && plano.ativo === 1)
            .slice(0, 1),
        ];
      }
      if (sql.includes('SELECT * FROM planos WHERE id = ? AND usuario_id = ?')) {
        return [
          planos
            .filter(
              (plano) => plano.id === Number(parametros[0]) && plano.usuario_id === parametros[1],
            )
            .map((plano) => ({ ...plano })),
        ];
      }
      if (sql.includes('UPDATE planos SET ativo = 0 WHERE usuario_id = ?')) {
        for (const plano of planos) {
          if (plano.usuario_id === parametros[0]) plano.ativo = 0;
        }
        return [{ affectedRows: 0 }];
      }
      if (sql.includes('INSERT INTO planos')) {
        const [
          usuario_id,
          objetivo,
          modalidade,
          vestibulares,
          materias,
          horas,
          dias,
          data_exame,
          ativo,
        ] = parametros;
        const linha = {
          id: proximoId++,
          usuario_id,
          objetivo,
          modalidade,
          vestibulares,
          materias,
          horas,
          dias,
          data_exame,
          ativo,
          criado_em: '2026-01-01',
        };
        planos.push(linha);
        return [{ insertId: linha.id }];
      }
      if (sql.includes('SELECT * FROM planos WHERE id = ?')) {
        return [
          planos
            .filter((plano) => plano.id === Number(parametros[0]))
            .map((plano) => ({ ...plano })),
        ];
      }
      throw new Error(`Consulta não prevista no pool em memória: ${sql}`);
    },
  };
  return pool;
}

function tokenDoUsuario(id) {
  return jwt.sign({ id }, segredo);
}

function criarApp(pool) {
  const app = express();
  app.use(express.json());
  app.use('/api/planos', criarRotasPlanos(pool));
  return app;
}

describe('isolamento de planos por conta', () => {
  let pool;
  let app;

  beforeEach(() => {
    pool = criarPoolEmMemoria();
    app = criarApp(pool);
  });

  it('associa o plano criado somente à conta autenticada', async () => {
    const resposta = await request(app)
      .post('/api/planos')
      .set('Authorization', `Bearer ${tokenDoUsuario(101)}`)
      .send({
        objetivo: 'IFSP',
        materias: ['Matemática'],
        horas: 2,
        dias: ['Segunda'],
      });

    expect(resposta.status).toBe(201);
    expect(pool.planos[0].usuario_id).toBe(101);

    const leituraDeOutraConta = await request(app)
      .get(`/api/planos/${resposta.body.plano.id}`)
      .set('Authorization', `Bearer ${tokenDoUsuario(202)}`);

    expect(leituraDeOutraConta.status).toBe(404);
  });

  it('não lista planos de outra conta no mesmo servidor', async () => {
    pool.planos.push({
      id: 1,
      usuario_id: 101,
      objetivo: 'IFSP',
      modalidade: '',
      vestibulares: '[]',
      materias: '["Matemática"]',
      horas: 2,
      dias: '["Segunda"]',
      data_exame: null,
      ativo: 1,
      criado_em: '2026-01-01',
    });

    const resposta = await request(app)
      .get('/api/planos')
      .set('Authorization', `Bearer ${tokenDoUsuario(202)}`);

    expect(resposta.status).toBe(200);
    expect(resposta.body.planos).toEqual([]);
  });

  it('impede buscar plano por id pertencente a outra conta', async () => {
    pool.planos.push({
      id: 1,
      usuario_id: 101,
      objetivo: 'IFSP',
      modalidade: '',
      vestibulares: '[]',
      materias: '["Matemática"]',
      horas: 2,
      dias: '["Segunda"]',
      data_exame: null,
      ativo: 1,
      criado_em: '2026-01-01',
    });

    const resposta = await request(app)
      .get('/api/planos/1')
      .set('Authorization', `Bearer ${tokenDoUsuario(202)}`);

    expect(resposta.status).toBe(404);
    expect(resposta.body.erro).toBe('Plano não encontrado.');
  });
});
