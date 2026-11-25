import { getToken } from './auth.js';
import { requisicaoApi } from './api.js';
import { chaveVisitante, lerVisitante, salvarVisitante } from './dadosVisitante.js';
import { agregarDesempenhoMaterias } from '../utils/simulados.js';

function dadosVazios() {
  return { materias: {}, modalidades: {}, historico: [] };
}

function agregarResultados(resultados) {
  const dados = dadosVazios();
  for (const item of resultados) {
    const modalidade = item.modalidade;
    const anterior = dados.modalidades[modalidade] || { acertos: 0, total: 0, simulados: 0 };
    anterior.acertos += Number(item.acertos);
    anterior.total += Number(item.total);
    anterior.simulados += 1;
    dados.modalidades[modalidade] = anterior;
    dados.historico.push({
      modalidade,
      acertos: Number(item.acertos),
      total: Number(item.total),
      data: item.criadoEm,
      desempenhoMaterias: (() => {
        if (Array.isArray(item.desempenhoMaterias)) return item.desempenhoMaterias;
        if (item.desempenhoMaterias && typeof item.desempenhoMaterias === 'object')
          return item.desempenhoMaterias;
        if (typeof item.desempenhoMaterias === 'string') {
          try {
            return JSON.parse(item.desempenhoMaterias || '[]');
          } catch {
            return [];
          }
        }
        return [];
      })(),
    });
  }
  dados.materias = agregarDesempenhoMaterias(dados.historico);
  return dados;
}

export function obterResultados() {
  if (getToken()) return dadosVazios();
  const dados = lerVisitante('simulados', dadosVazios());
  return {
    ...dadosVazios(),
    ...dados,
    materias: {
      ...(dados?.materias || {}),
      ...agregarDesempenhoMaterias(Array.isArray(dados?.historico) ? dados.historico : []),
    },
    modalidades: dados?.modalidades || {},
    historico: Array.isArray(dados?.historico) ? dados.historico : [],
  };
}

export async function obterResultadosAtuais() {
  if (!getToken()) return obterResultados();
  return agregarResultados(
    await requisicaoApi('/api/progresso/resultados-simulado').then((d) => d.resultados),
  );
}

export function obterResumoModalidade(modalidade) {
  const resultado = obterResultados().modalidades?.[modalidade];
  if (!resultado || !resultado.total)
    return { acertos: 0, erros: 0, total: 0, simulados: 0, porcentagem: 0 };
  return {
    ...resultado,
    erros: resultado.total - resultado.acertos,
    porcentagem: Math.round((resultado.acertos / resultado.total) * 100),
  };
}

export async function obterResumoModalidadeAtual(modalidade) {
  const dados = await obterResultadosAtuais();
  const resultado = dados.modalidades?.[modalidade];
  if (!resultado || !resultado.total)
    return { acertos: 0, erros: 0, total: 0, simulados: 0, porcentagem: 0 };
  return {
    ...resultado,
    erros: resultado.total - resultado.acertos,
    porcentagem: Math.round((resultado.acertos / resultado.total) * 100),
  };
}

export async function registrarResultadoModalidade(
  modalidade,
  acertos,
  total,
  duracaoSegundos = 0,
  desempenhoMaterias = [],
) {
  if (
    !modalidade ||
    !Number.isInteger(acertos) ||
    !Number.isInteger(total) ||
    total <= 0 ||
    acertos < 0 ||
    acertos > total
  ) {
    throw new Error('Resultado de simulado inválido.');
  }
  if (getToken()) {
    const resposta = await requisicaoApi('/api/progresso/resultados-simulado', {
      method: 'POST',
      body: JSON.stringify({ modalidade, acertos, total, duracaoSegundos, desempenhoMaterias }),
    });
    window.dispatchEvent(new Event('simuladosAtualizados'));
    return resposta;
  }

  const dados = obterResultados();
  const anterior = dados.modalidades[modalidade] || { acertos: 0, total: 0, simulados: 0 };
  const novoResultado = {
    acertos: anterior.acertos + acertos,
    total: anterior.total + total,
    simulados: anterior.simulados + 1,
  };
  dados.modalidades[modalidade] = novoResultado;
  dados.historico.push({
    modalidade,
    acertos,
    total,
    data: new Date().toISOString(),
    desempenhoMaterias,
  });
  salvarVisitante('simulados', dados);
  window.dispatchEvent(new Event('simuladosAtualizados'));
  return novoResultado;
}

export function obterResumoMateria(nome) {
  const resultado = obterResultados().materias?.[nome];
  if (!resultado || !resultado.total) return { acertos: 0, total: 0, simulados: 0, porcentagem: 0 };
  return { ...resultado, porcentagem: Math.round((resultado.acertos / resultado.total) * 100) };
}

export function registrarResultado(nome, acertos, total) {
  if (!nome || total <= 0 || acertos < 0 || acertos > total)
    throw new Error('Resultado de simulado inválido.');
  const dados = obterResultados();
  const anterior = dados.materias[nome] || { acertos: 0, total: 0, simulados: 0 };
  dados.materias[nome] = {
    acertos: anterior.acertos + acertos,
    total: anterior.total + total,
    simulados: anterior.simulados + 1,
  };
  dados.historico.push({ materia: nome, acertos, total, data: new Date().toISOString() });
  salvarVisitante('simulados', dados);
  window.dispatchEvent(new Event('simuladosAtualizados'));
  return dados.materias[nome];
}

export async function limparResultados() {
  if (getToken()) {
    await requisicaoApi('/api/progresso/resultados-simulado', { method: 'DELETE' });
  } else {
    localStorage.removeItem(chaveVisitante('simulados'));
  }
  window.dispatchEvent(new Event('simuladosAtualizados'));
}
