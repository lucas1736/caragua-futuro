import { requisicaoApi } from './api.js';

export async function listarRegistrosEstudo() {
  return (await requisicaoApi('/api/progresso/registros-estudo')).registros;
}

export async function registrarEstudo(data, horas) {
  return requisicaoApi('/api/progresso/registros-estudo', {
    method: 'POST',
    body: JSON.stringify({ data, horas }),
  });
}

export async function listarResultadosSimulado() {
  return (await requisicaoApi('/api/progresso/resultados-simulado')).resultados;
}

export async function registrarResultadoSimulado(resultado) {
  return requisicaoApi('/api/progresso/resultados-simulado', {
    method: 'POST',
    body: JSON.stringify(resultado),
  });
}

export async function atualizarRegistroEstudo(data, horas) {
  return requisicaoApi(`/api/progresso/registros-estudo/${data}`, {
    method: 'PUT',
    body: JSON.stringify({ horas }),
  });
}

export async function excluirRegistroEstudo(data) {
  return requisicaoApi(`/api/progresso/registros-estudo/${data}`, { method: 'DELETE' });
}

export async function excluirResultadoSimulado(id) {
  return requisicaoApi(`/api/progresso/resultados-simulado/${id}`, { method: 'DELETE' });
}

export async function limparRegistrosEstudo() {
  return requisicaoApi('/api/progresso/registros-estudo', { method: 'DELETE' });
}

export async function limparResultadosSimulado() {
  return requisicaoApi('/api/progresso/resultados-simulado', { method: 'DELETE' });
}

export async function importarDadosVisitante(dados) {
  return requisicaoApi('/api/progresso/importar', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}
