import './env.js';
import mysql from 'mysql2/promise';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const NOME_BANCO = process.env.DB_NAME || 'caragua_futuro';
const conexaoConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};
const DIRETORIO_MIGRACOES = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'migrations'
);

const pool = mysql.createPool({
  ...conexaoConfig,
  database: NOME_BANCO,
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function prepararBanco() {
  if (!/^\w+$/.test(NOME_BANCO)) {
    throw new Error('DB_NAME inválido no arquivo .env');
  }

  const conexao = await mysql.createConnection(conexaoConfig);
  try {
    await conexao.query(
      `CREATE DATABASE IF NOT EXISTS \`${NOME_BANCO}\`
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await conexao.query(`USE \`${NOME_BANCO}\``);
    await conexao.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        versao VARCHAR(255) PRIMARY KEY,
        aplicada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const arquivos = (await readdir(DIRETORIO_MIGRACOES))
      .filter((arquivo) => /^\d+_.+\.sql$/.test(arquivo))
      .sort();

    for (const arquivo of arquivos) {
      const [aplicadas] = await conexao.query(
        'SELECT versao FROM schema_migrations WHERE versao = ?',
        [arquivo]
      );
      if (aplicadas.length > 0) continue;

      const sql = await readFile(path.join(DIRETORIO_MIGRACOES, arquivo), 'utf8');
      for (const instrucao of sql.split(';').map((item) => item.trim()).filter(Boolean)) {
        try {
          await conexao.query(instrucao);
        } catch (erro) {
          // Bancos criados antes da adoção de migrations podem já ter estes objetos.
          if (!['ER_TABLE_EXISTS_ERROR', 'ER_DUP_FIELDNAME'].includes(erro.code)) {
            throw erro;
          }
        }
      }

      await conexao.query('INSERT INTO schema_migrations (versao) VALUES (?)', [arquivo]);
      console.log(`Migration aplicada: ${arquivo}`);
    }
  } finally {
    await conexao.end();
  }
}

export default pool;
