const CHAVE_USUARIO = 'caragua_usuario';
const CHAVE_TOKEN = 'caragua_token';
export const ESTADO_AUTH_EVENTO = 'caragua-auth-mudou';

function avisarMudanca() {
  window.dispatchEvent(new Event(ESTADO_AUTH_EVENTO));
}

export function getUsuario() {
  try {
    const usuario = localStorage.getItem(CHAVE_USUARIO);
    return usuario ? JSON.parse(usuario) : null;
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

function salvarSessao({ usuario, token }) {
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
  localStorage.setItem(CHAVE_TOKEN, token);
  avisarMudanca();
  return usuario;
}

async function post(url, corpo) {
  let resposta;
  try {
    resposta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor.');
  }

  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error(
      dados.erro ||
        `A API não respondeu (código ${resposta.status}). Verifique o terminal do "npm run dev".`
    );
  }
  return dados;
}

export async function loginUsuario(email, senha) {
  return salvarSessao(await post('/api/login', { email, senha }));
}

export async function cadastrarUsuario(nome, email, senha) {
  return salvarSessao(await post('/api/cadastro', { nome, email, senha }));
}

export function logoutUsuario() {
  localStorage.removeItem(CHAVE_USUARIO);
  localStorage.removeItem(CHAVE_TOKEN);
  avisarMudanca();
}
