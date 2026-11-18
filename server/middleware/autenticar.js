import jwt from 'jsonwebtoken';

export function criarAutenticacao(jwtSecret) {
  return function autenticar(req, res, next) {
    const autorizacao = req.headers.authorization || '';
    const correspondencia = /^Bearer ([^\s]+)$/i.exec(autorizacao);
    if (!correspondencia) {
      return res.status(401).json({ erro: 'Sessão inválida. Faça login novamente.' });
    }

    try {
      const conteudo = jwt.verify(correspondencia[1], jwtSecret);
      if (!Number.isInteger(conteudo.id) || conteudo.id <= 0) {
        throw new Error('Identificador de usuário inválido.');
      }
      req.usuarioId = conteudo.id;
      next();
    } catch {
      res.status(401).json({ erro: 'Sessão inválida. Faça login novamente.' });
    }
  };
}
