import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { criarRotasMetas } from './metas.js';

const segredoTeste = 'segredo-de-teste-com-mais-de-trinta-e-dois-caracteres';
process.env.JWT_SECRET = segredoTeste;

function criarPoolEmMemoria() {
  let proximoId = 1;
  const usuarios = new Map([
    [11, { id: 11, modalidade_preferida: null }],
    [22, { id: 22, modalidade_preferida: null }],
  ]);
  const metas = [];

  return {
    metas,
    usuarios,
    async query(sql, parametros = []) {
      if (sql.includes('SELECT modalidade_preferida FROM usuarios')) {
        const usuario = usuarios.get(parametros[0]);
        return [usuario ? [{ modalidade_preferida: usuario.modalidade_preferida }] : []];
      }
      if (sql.includes('UPDATE usuarios SET modalidade_preferida')) {
        const usuario = usuarios.get(parametros[1]);
        if (usuario) usuario.modalidade_preferida = parametros[0];
        return [{ affectedRows: usuario ? 1 : 0 }];
      }
      if (sql.includes('SELECT titulo, chave_sugestao FROM metas')) {
        return [
          metas
            .filter((meta) => meta.usuario_id === parametros[0])
            .map((meta) => ({
              titulo: meta.titulo,
              chave_sugestao: meta.chave_sugestao,
            })),
        ];
      }
      if (sql.includes('SELECT id FROM metas') && sql.includes('chave_sugestao IS NULL')) {
        return [
          metas
            .filter(
              (meta) =>
                meta.usuario_id === parametros[0] &&
                meta.titulo === parametros[1] &&
                meta.chave_sugestao === null,
            )
            .slice(0, 1)
            .map((meta) => ({ id: meta.id })),
        ];
      }
      if (sql.includes('UPDATE metas SET modalidade = ?, chave_sugestao = ? WHERE id = ?')) {
        const meta = metas.find(
          (item) => item.id === parametros[2] && item.usuario_id === parametros[3],
        );
        if (meta) {
          meta.modalidade = parametros[0];
          meta.chave_sugestao = parametros[1];
        }
        return [{ affectedRows: meta ? 1 : 0 }];
      }
      if (sql.includes('INSERT IGNORE INTO metas')) {
        const [usuario_id, titulo, materia, modalidade, chave_sugestao, descricao, prioridade] =
          parametros;
        if (
          !metas.some(
            (meta) => meta.usuario_id === usuario_id && meta.chave_sugestao === chave_sugestao,
          )
        ) {
          metas.push({
            id: proximoId++,
            usuario_id,
            titulo,
            materia,
            modalidade,
            chave_sugestao,
            descricao,
            prioridade,
            prazo: null,
            concluida: 0,
            criado_em: '2026-01-01',
          });
        }
        return [{ affectedRows: 1 }];
      }
      if (sql.includes('SELECT * FROM metas WHERE usuario_id = ? AND modalidade = ?')) {
        return [
          metas
            .filter(
              (meta) => meta.usuario_id === parametros[0] && meta.modalidade === parametros[1],
            )
            .map((meta) => ({ ...meta })),
        ];
      }
      if (sql.includes('SELECT * FROM metas WHERE usuario_id = ?')) {
        return [
          metas.filter((meta) => meta.usuario_id === parametros[0]).map((meta) => ({ ...meta })),
        ];
      }
      throw new Error(`Consulta não prevista no pool de teste: ${sql}`);
    },
  };
}

function criarApp(pool) {
  const app = express();
  app.use(express.json());
  app.use('/api/metas', criarRotasMetas(pool));
  return app;
}

function token(id) {
  return jwt.sign({ id }, segredoTeste);
}

describe('metas sugeridas por modalidade e por conta', () => {
  let pool;
  let app;

  beforeEach(() => {
    pool = criarPoolEmMemoria();
    app = criarApp(pool);
  });

  it('gera metas automaticamente, sem duplicar quando sincroniza novamente', async () => {
    const primeira = await request(app)
      .post('/api/metas/sincronizar-sugestoes')
      .set('Authorization', `Bearer ${token(11)}`)
      .send({ modalidade: 'integrado' });
    const quantidadeInicial = primeira.body.metas.length;
    const metaConcluida = primeira.body.metas[0];
    pool.metas.find((meta) => meta.id === metaConcluida.id).concluida = 1;
    const segunda = await request(app)
      .post('/api/metas/sincronizar-sugestoes')
      .set('Authorization', `Bearer ${token(11)}`)
      .send({ modalidade: 'integrado' });

    expect(primeira.status).toBe(200);
    expect(quantidadeInicial).toBeGreaterThan(0);
    expect(segunda.body.metas).toHaveLength(quantidadeInicial);
    expect(segunda.body.metas.find((meta) => meta.id === metaConcluida.id).concluida).toBe(true);
    expect(pool.usuarios.get(11).modalidade_preferida).toBe('integrado');
  });

  it('mantém metas de modalidades e usuários diferentes separadas', async () => {
    await request(app)
      .post('/api/metas/sincronizar-sugestoes')
      .set('Authorization', `Bearer ${token(11)}`)
      .send({ modalidade: 'etec' });
    const doOutroUsuario = await request(app)
      .post('/api/metas/sincronizar-sugestoes')
      .set('Authorization', `Bearer ${token(22)}`)
      .send({ modalidade: 'concurso' });
    const listaPrimeiro = await request(app)
      .get('/api/metas')
      .set('Authorization', `Bearer ${token(11)}`);

    expect(doOutroUsuario.body.metas.every((meta) => meta.modalidade === 'concurso')).toBe(true);
    expect(listaPrimeiro.body.metas.every((meta) => meta.modalidade === 'etec')).toBe(true);
    expect(pool.usuarios.get(11).modalidade_preferida).toBe('etec');
    expect(pool.usuarios.get(22).modalidade_preferida).toBe('concurso');
  });
});
