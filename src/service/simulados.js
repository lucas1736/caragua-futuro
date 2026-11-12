const CHAVE_SIMULADOS = 'resultadosSimuladosCaraguaFuturo';

function dadosVazios() {
  return {
    materias: {},
    modalidades: {},
    historico: [],
  };
}

function lerResultados() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_SIMULADOS));

    if (!dados || typeof dados !== 'object') {
      return dadosVazios();
    }

    return {
      ...dadosVazios(),
      ...dados,
      materias: dados.materias || {},
      modalidades: dados.modalidades || {},
      historico: Array.isArray(dados.historico) ? dados.historico : [],
    };
  } catch {
    return dadosVazios();
  }
}

function salvarResultados(dados) {
  localStorage.setItem(CHAVE_SIMULADOS, JSON.stringify(dados));
  window.dispatchEvent(new Event('simuladosAtualizados'));
}

export function obterResultados() {
  return lerResultados();
}

export function obterResumoModalidade(modalidade) {
  const dados = lerResultados();
  const resultado = dados.modalidades?.[modalidade];

  if (!resultado || !resultado.total) {
    return {
      acertos: 0,
      erros: 0,
      total: 0,
      simulados: 0,
      porcentagem: 0,
    };
  }

  return {
    ...resultado,
    erros: resultado.total - resultado.acertos,
    porcentagem: Math.round((resultado.acertos / resultado.total) * 100),
  };
}

export function registrarResultadoModalidade(modalidade, acertos, total) {
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

  const dados = lerResultados();

  const anterior = dados.modalidades[modalidade] || {
    acertos: 0,
    total: 0,
    simulados: 0,
  };

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
  });

  salvarResultados(dados);

  return novoResultado;
}

// Mantidas para compatibilidade com a versão anterior.
export function obterResumoMateria(nome) {
  const dados = lerResultados();
  const resultado = dados.materias?.[nome];

  if (!resultado || !resultado.total) {
    return { acertos: 0, total: 0, simulados: 0, porcentagem: 0 };
  }

  return {
    ...resultado,
    porcentagem: Math.round((resultado.acertos / resultado.total) * 100),
  };
}

export function registrarResultado(nome, acertos, total) {
  if (!nome || total <= 0 || acertos < 0 || acertos > total) {
    throw new Error('Resultado de simulado inválido.');
  }

  const dados = lerResultados();

  const anterior = dados.materias[nome] || {
    acertos: 0,
    total: 0,
    simulados: 0,
  };

  dados.materias[nome] = {
    acertos: anterior.acertos + acertos,
    total: anterior.total + total,
    simulados: anterior.simulados + 1,
  };

  dados.historico.push({
    materia: nome,
    acertos,
    total,
    data: new Date().toISOString(),
  });

  salvarResultados(dados);

  return dados.materias[nome];
}

export function limparResultados() {
  localStorage.removeItem(CHAVE_SIMULADOS);
  window.dispatchEvent(new Event('simuladosAtualizados'));
}