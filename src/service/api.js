const CHAVE_TOKEN = 'caragua_token';
const CHAVE_USUARIO = 'caragua_usuario';

export async function requisicaoApi(url, opcoes = {}) {
  let resposta;
  try {
    const token = localStorage.getItem(CHAVE_TOKEN);
    resposta = await fetch(url, {
      ...opcoes,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opcoes.headers,
      },
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor.');
  }

  const dados = await resposta.json().catch(() => ({}));
  if (resposta.status === 401) {
    localStorage.removeItem(CHAVE_USUARIO);
    localStorage.removeItem(CHAVE_TOKEN);
    window.dispatchEvent(new Event('caragua-auth-mudou'));
    throw new Error('Sua sessão expirou. Faça login novamente.');
  }
  if (!resposta.ok) {
    throw new Error(dados.erro || `A API não respondeu (código ${resposta.status}).`);
  }
  return dados;
}
