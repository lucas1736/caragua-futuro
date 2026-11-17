-- Rode este arquivo no MySQL (Workbench, terminal ou phpMyAdmin)
CREATE DATABASE IF NOT EXISTS caragua_futuro
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE caragua_futuro;

CREATE TABLE IF NOT EXISTS usuarios (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Planos de estudo de cada usuário (CRUD)
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
);

-- Metas de estudo de cada usuário (2º CRUD)
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
);
