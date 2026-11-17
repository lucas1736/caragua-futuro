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
export async function listarPlanos() {
  return (await requisicao('/api/planos')).planos;
}

// CREATE
export async function criarPlano(plano) {
  return (
    await requisicao('/api/planos', {
      method: 'POST',
      body: JSON.stringify(plano),
    })
  ).plano;
}

// UPDATE
export async function atualizarPlano(id, plano) {
  return (
    await requisicao(`/api/planos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(plano),
    })
  ).plano;
}

// DELETE
export async function excluirPlano(id) {
  await requisicao(`/api/planos/${id}`, { method: 'DELETE' });
}
