-- Esquema de referência do banco Caraguá Futuro.
-- Fonte de verdade para ambientes existentes: migrations em server/migrations (em ordem).
-- Este arquivo reflete o estado esperado após todas as migrations.

CREATE DATABASE IF NOT EXISTS caragua_futuro
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE caragua_futuro;

CREATE TABLE IF NOT EXISTS schema_migrations (
  versao VARCHAR(255) PRIMARY KEY,
  aplicada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios (
  id                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome                  VARCHAR(100) NOT NULL,
  email                 VARCHAR(150) NOT NULL UNIQUE,
  senha_hash            VARCHAR(255) NOT NULL,
  telefone              VARCHAR(20)  NULL,
  foto                  MEDIUMTEXT   NULL,
  modalidade_preferida  VARCHAR(60)  NULL,
  criado_em             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS planos (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id        INT UNSIGNED NOT NULL,
  objetivo          VARCHAR(100) NOT NULL,
  modalidade        VARCHAR(60)  NULL,
  vestibulares      JSON         NULL,
  horas             TINYINT UNSIGNED NOT NULL,
  dias              JSON         NOT NULL,
  materias          JSON         NOT NULL,
  data_exame        DATE         NULL,
  ativo             TINYINT(1) NOT NULL DEFAULT 0,
  usuario_ativo_id  INT UNSIGNED GENERATED ALWAYS AS (
                      CASE WHEN ativo = 1 THEN usuario_id ELSE NULL END
                    ) STORED,
  criado_em         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY uq_plano_ativo_usuario (usuario_ativo_id)
);

CREATE TABLE IF NOT EXISTS metas (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id      INT UNSIGNED  NOT NULL,
  titulo          VARCHAR(200)  NOT NULL,
  materia         VARCHAR(120)  NOT NULL,
  modalidade      VARCHAR(60)   NULL,
  chave_sugestao  VARCHAR(120)  NULL,
  descricao       VARCHAR(500)  NULL,
  prioridade      VARCHAR(10)   NOT NULL DEFAULT 'Média',
  prazo           DATE          NULL,
  concluida       TINYINT(1)    NOT NULL DEFAULT 0,
  criado_em       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY uq_metas_usuario_sugestao (usuario_id, chave_sugestao)
);

CREATE TABLE IF NOT EXISTS registros_estudo (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT UNSIGNED  NOT NULL,
  data        DATE          NOT NULL,
  horas       DECIMAL(4,2)  NOT NULL,
  criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY uq_registro_usuario_data (usuario_id, data)
);

CREATE TABLE IF NOT EXISTS resultados_simulado (
  id                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id            INT UNSIGNED NOT NULL,
  modalidade            VARCHAR(60)  NOT NULL,
  acertos               SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  total                 SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  duracao_segundos      INT UNSIGNED NOT NULL DEFAULT 0,
  desempenho_materias   JSON         NULL,
  criado_em             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_resultados_usuario_data (usuario_id, criado_em)
);
