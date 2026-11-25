export function rotaNaoEncontrada(req, res) {
  res.status(404).json({ erro: 'Rota não encontrada.' });
}

export function tratarErro(erro, req, res, next) {
  if (res.headersSent) return next(erro);
  console.error(erro);
  const status =
    erro.message === 'Origem não autorizada pelo CORS.'
      ? 403
      : erro.type === 'entity.parse.failed'
        ? 400
        : Number.isInteger(erro.status)
          ? erro.status
          : 500;
  const mensagem =
    status === 403
      ? 'Origem não autorizada.'
      : erro.type === 'entity.parse.failed'
        ? 'O corpo da requisição não contém JSON válido.'
        : status >= 500
          ? 'Erro interno do servidor.'
          : erro.message;
  res.status(status).json({ erro: mensagem });
}

export function asyncHandler(funcao) {
  return (req, res, next) => Promise.resolve(funcao(req, res, next)).catch(next);
}
