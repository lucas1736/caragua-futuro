const SEGREDOS_PADRAO = new Set([
  'troque-esta-chave-no-env',
  'coloque-uma-frase-longa-e-aleatoria-aqui',
  'change-me',
  'secret',
]);

export function validarSegredoJwt(segredo, ambiente = process.env.NODE_ENV) {
  const chave = typeof segredo === 'string' ? segredo.trim() : '';
  const invalido = !chave || SEGREDOS_PADRAO.has(chave.toLowerCase());
  if (ambiente === 'production' && (invalido || chave.length < 32)) {
    throw new Error('Em produção, defina JWT_SECRET com pelo menos 32 caracteres aleatórios.');
  }
  if (invalido) {
    throw new Error('JWT_SECRET não definido ou inválido. Configure-o no arquivo .env.');
  }
  return chave;
}
