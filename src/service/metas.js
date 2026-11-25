import { requisicaoApi } from './api.js';

export async function listarMetas() {
  return (await requisicaoApi('/api/metas')).metas;
}

export async function criarMeta(meta) {
  return (await requisicaoApi('/api/metas', {
    method: 'POST',
    body: JSON.stringify(meta),
  })).meta;
}

export async function atualizarMeta(id, meta) {
  return (await requisicaoApi(`/api/metas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(meta),
  })).meta;
}

export async function excluirMeta(id) {
  await requisicaoApi(`/api/metas/${id}`, { method: 'DELETE' });
}
