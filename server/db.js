import './env.js';
import mysql from 'mysql2/promise';

const NOME_BANCO = process.env.DB_NAME || 'caragua_futuro';

const conexaoConfig = {
  // 127.0.0.1 evita o problema de "localhost" virar IPv6 (::1) no Node 17+
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const pool = mysql.createPool({
  ...conexaoConfig,
  database: NOME_BANCO,
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
});

// Cria o banco e as tabelas automaticamente (não precisa rodar o schema.sql)
export async function prepararBanco() {
  if (!/^\w+$/.test(NOME_BANCO)) {
    throw new Error('DB_NAME inválido no arquivo .env');
  }

  const conexao = await mysql.createConnection(conexaoConfig);

  await conexao.query(
    `CREATE DATABASE IF NOT EXISTS \`${NOME_BANCO}\`
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await conexao.query(`USE \`${NOME_BANCO}\``);

  await conexao.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      nome       VARCHAR(100) NOT NULL,
      email      VARCHAR(150) NOT NULL UNIQUE,
      senha_hash VARCHAR(255) NOT NULL,
      telefone   VARCHAR(20) NULL,
      foto       MEDIUMTEXT NULL,
      criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migração: cria telefone/foto em bancos criados antes dessa atualização
  const [colunas] = await conexao.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'usuarios'`,
    [NOME_BANCO]
  );
  const nomesColunas = colunas.map((c) => c.COLUMN_NAME);

  if (!nomesColunas.includes('telefone')) {
    await conexao.query(
      'ALTER TABLE usuarios ADD COLUMN telefone VARCHAR(20) NULL AFTER senha_hash'
    );
  }

  if (!nomesColunas.includes('foto')) {
    await conexao.query(
      'ALTER TABLE usuarios ADD COLUMN foto MEDIUMTEXT NULL AFTER telefone'
    );
  }

  await conexao.query(`
    CREATE TABLE IF NOT EXISTS planos (
      id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT UNSIGNED NOT NULL,
      objetivo   VARCHAR(50) NOT NULL,
      materias   JSON NOT NULL,
      horas      TINYINT UNSIGNED NOT NULL,
      dias       JSON NOT NULL,
      data_exame DATE NULL,
      criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `);

  await conexao.query(`
    CREATE TABLE IF NOT EXISTS metas (
      id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT UNSIGNED NOT NULL,
      titulo     VARCHAR(120) NOT NULL,
      materia    VARCHAR(50) NOT NULL,
      descricao  VARCHAR(500) NULL,
      prioridade VARCHAR(10) NOT NULL DEFAULT 'Média',
      prazo      DATE NULL,
      concluida  TINYINT(1) NOT NULL DEFAULT 0,
      criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `);

  await conexao.end();
}

export default pool;
