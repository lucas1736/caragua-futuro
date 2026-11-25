export function validarId(req, res, next) {
  const id = req.params.id;
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    return res.status(400).json({ erro: 'Identificador inválido.' });
  }
  req.params.id = Number(id);
  next();
}
