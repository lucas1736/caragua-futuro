
const CHAVE_SIMULADOS = 'resultadosSimuladosCaraguaFuturo';

function lerResultados() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_SIMULADOS));
    return dados && typeof dados === 'object'
      ? dados
      : { materias: {}, historico: [] };
  } catch {
    return { materias: {}, historico: [] };
  }
}

export function obterResultados() {
  return lerResultados();
}

export function obterResumoMateria(nome) {
  const dados = lerResultados();
  const resultado = dados.materias?.[nome];

  if (!resultado) {
    return { acertos: 0, total: 0, simulados: 0, porcentagem: 0 };
  }

  return {
    ...resultado,
    porcentagem: resultado.total > 0
      ? Math.round((resultado.acertos / resultado.total) * 100)
      : 0,
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

  const novoResultado = {
    acertos: anterior.acertos + acertos,
    total: anterior.total + total,
    simulados: anterior.simulados + 1,
  };

  dados.materias[nome] = novoResultado;

  dados.historico.push({
    materia: nome,
    acertos,
    total,
    data: new Date().toISOString(),
  });

  localStorage.setItem(CHAVE_SIMULADOS, JSON.stringify(dados));

  window.dispatchEvent(new Event('simuladosAtualizados'));

  return novoResultado;
}

export function limparResultados() {
  localStorage.removeItem(CHAVE_SIMULADOS);
  window.dispatchEvent(new Event('simuladosAtualizados'));
}
