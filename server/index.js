import './env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pool, { prepararBanco } from './db.js';
import rotasAutenticacao from './routes/auth.js';
import rotasPlanos from './routes/planos.js';
import rotasMetas from './routes/metas.js';
import { rotaNaoEncontrada, tratarErro } from './middleware/erros.js';
import { validarSegredoJwt } from './validators/segredoJwt.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const JWT_SECRET = validarSegredoJwt(process.env.JWT_SECRET);

const origensPermitidas = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origem) => origem.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origem, callback) {
    if (!origem || origensPermitidas.includes(origem)) return callback(null, true);
    return callback(new Error('Origem não autorizada pelo CORS.'));
  },
}));
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '2mb' }));

app.get('/api/health', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (erro) {
    next(erro);
  }
});

const limiteCadastro = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de cadastro. Tente novamente mais tarde.' },
});
const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.' },
});
app.use('/api/cadastro', limiteCadastro);
app.use('/api/login', limiteLogin);
app.use('/api', rotasAutenticacao);
app.use('/api/planos', rotasPlanos);
app.use('/api/metas', rotasMetas);
app.use(rotaNaoEncontrada);
app.use(tratarErro);

if (!process.env.DB_PASSWORD) {
  console.warn('Aviso: DB_PASSWORD está vazio no .env.');
}

prepararBanco()
  .then(() => {
    app.listen(PORT, () => {
      console.log('Banco de dados OK (migrations aplicadas).');
      console.log(`API rodando na porta ${PORT}`);
    });
  })
  .catch((erro) => {
    const dicas = {
      ER_ACCESS_DENIED_ERROR: 'Usuário ou senha incorretos. Confira DB_USER e DB_PASSWORD no .env.',
      ECONNREFUSED: 'O MySQL não está rodando ou está em outra porta. Confira DB_HOST/DB_PORT.',
      ENOTFOUND: 'O endereço em DB_HOST não existe. Use 127.0.0.1 para MySQL local.',
      ETIMEDOUT: 'Tempo esgotado. Confira DB_HOST/DB_PORT e se o MySQL está ligado.',
      ER_BAD_DB_ERROR: 'Não foi possível acessar o banco informado em DB_NAME.',
      ER_DBACCESS_DENIED_ERROR: 'Este usuário não tem permissão para criar/usar o banco.',
    };
    console.error('\nFalha ao inicializar o banco de dados.');
    console.error('Motivo:', erro.message || erro.code || erro);
    console.error(dicas[erro.code] || 'Confira as credenciais e as migrations do banco.');
    process.exit(1);
  });
