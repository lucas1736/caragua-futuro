import { getToken, logoutUsuario } from './auth.js';

async function requisicao(url, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(url, {
      ...opcoes,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor.');
  }

  const dados = await resposta.json().catch(() => ({}));

  if (resposta.status === 401) {
    logoutUsuario();
    throw new Error('Sua sessão expirou. Faça login novamente.');
  }
  if (!resposta.ok) throw new Error(dados.erro || 'Erro inesperado.');
  return dados;
}

// READ
export async function listarMetas() {
  return (await requisicao('/api/metas')).metas;
}

// CREATE
export async function criarMeta(meta) {
  return (
    await requisicao('/api/metas', {
      method: 'POST',
      body: JSON.stringify(meta),
    })
  ).meta;
}

// UPDATE
export async function atualizarMeta(id, meta) {
  return (
    await requisicao(`/api/metas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(meta),
    })
  ).meta;
}

// DELETE
export async function excluirMeta(id) {
  await requisicao(`/api/metas/${id}`, { method: 'DELETE' });
}
