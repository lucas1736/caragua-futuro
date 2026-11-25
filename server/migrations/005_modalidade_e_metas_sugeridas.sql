ALTER TABLE usuarios
  ADD COLUMN modalidade_preferida VARCHAR(60) NULL AFTER foto;

ALTER TABLE metas
  ADD COLUMN modalidade VARCHAR(60) NULL AFTER materia,
  ADD COLUMN chave_sugestao VARCHAR(120) NULL AFTER modalidade,
  ADD UNIQUE KEY uq_metas_usuario_sugestao (usuario_id, chave_sugestao);
