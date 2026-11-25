import { requisicaoApi } from './api.js';
import { limparDadosVisitante } from './dadosVisitante.js';

const CHAVE_USUARIO = 'caragua_usuario';
const CHAVE_TOKEN = 'caragua_token';
const CHAVE_IMPORTACAO_PENDENTE = 'caragua_importacao_pendente';
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

export function marcarImportacaoPendente() {
  localStorage.setItem(CHAVE_IMPORTACAO_PENDENTE, '1');
  avisarMudanca();
}

export function importacaoPendente() {
  return localStorage.getItem(CHAVE_IMPORTACAO_PENDENTE) === '1';
}

export function concluirImportacao() {
  localStorage.removeItem(CHAVE_IMPORTACAO_PENDENTE);
  avisarMudanca();
}

export async function loginUsuario(email, senha) {
  const resposta = await requisicaoApi('/api/login', { method: 'POST', body: JSON.stringify({ email, senha }) });
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(resposta.usuario));
  localStorage.setItem(CHAVE_TOKEN, resposta.token);
  marcarImportacaoPendente();
  return resposta.usuario;
}

export async function cadastrarUsuario(nome, email, senha) {
  const resposta = await requisicaoApi('/api/cadastro', { method: 'POST', body: JSON.stringify({ nome, email, senha }) });
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(resposta.usuario));
  localStorage.setItem(CHAVE_TOKEN, resposta.token);
  marcarImportacaoPendente();
  return resposta.usuario;
}

// Atualiza os dados do perfil no banco e renova a sessão local
export async function atualizarPerfil(dados) {
  return salvarSessao(await requisicaoApi('/api/perfil', { method: 'PUT', body: JSON.stringify(dados) }));
}

export function logoutUsuario() {
  localStorage.removeItem(CHAVE_USUARIO);
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_IMPORTACAO_PENDENTE);
  for (const chave of [
    'planoCaraguaFuturo',
    'progressoCaraguaFuturo',
    'resultadosSimuladosCaraguaFuturo',
    'cronogramaCaraguaFuturo',
    'atividadesCaraguaFuturo',
  ]) localStorage.removeItem(chave);
  limparDadosVisitante();
  avisarMudanca();
}
