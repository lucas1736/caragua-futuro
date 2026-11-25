import { requisicaoApi } from './api.js';

export async function listarPlanos() {
  return (await requisicaoApi('/api/planos')).planos;
}

export async function obterPlanoAtivo() {
  return (await requisicaoApi('/api/planos/ativo')).plano;
}

export async function ativarPlano(id) {
  return (await requisicaoApi(`/api/planos/${id}/ativar`, { method: 'PUT' })).plano;
}

export async function criarPlano(plano) {
  return (await requisicaoApi('/api/planos', {
    method: 'POST',
    body: JSON.stringify(plano),
  })).plano;
}

export async function atualizarPlano(id, plano) {
  return (await requisicaoApi(`/api/planos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(plano),
  })).plano;
}

export async function excluirPlano(id) {
  await requisicaoApi(`/api/planos/${id}`, { method: 'DELETE' });
}
