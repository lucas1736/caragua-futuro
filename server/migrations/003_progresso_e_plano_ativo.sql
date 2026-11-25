ALTER TABLE planos
  ADD COLUMN vestibulares JSON NULL AFTER modalidade,
  ADD COLUMN ativo TINYINT(1) NOT NULL DEFAULT 0 AFTER data_exame,
  ADD COLUMN usuario_ativo_id INT UNSIGNED
    GENERATED ALWAYS AS (CASE WHEN ativo = 1 THEN usuario_id ELSE NULL END) STORED,
  ADD UNIQUE KEY uq_planos_usuario_ativo (usuario_ativo_id);

UPDATE planos p
JOIN (
  SELECT usuario_id, MAX(id) AS id
  FROM planos
  GROUP BY usuario_id
) ultimo ON ultimo.id = p.id
SET p.ativo = 1;

CREATE TABLE registros_estudo (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT UNSIGNED NOT NULL,
  data DATE NOT NULL,
  horas DECIMAL(4,1) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_registros_usuario_data (usuario_id, data),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE resultados_simulado (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT UNSIGNED NOT NULL,
  modalidade VARCHAR(60) NOT NULL,
  acertos SMALLINT UNSIGNED NOT NULL,
  total SMALLINT UNSIGNED NOT NULL,
  duracao_segundos INT UNSIGNED NOT NULL DEFAULT 0,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_resultados_usuario_data (usuario_id, criado_em)
);
