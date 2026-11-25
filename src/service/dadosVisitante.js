const PREFIXO_VISITANTE = 'caragua_visitante_';
const CHAVES_ANTIGAS = {
  plano: 'planoCaraguaFuturo',
  progresso: 'progressoCaraguaFuturo',
  simulados: 'resultadosSimuladosCaraguaFuturo',
};

export function chaveVisitante(nome) {
  return `${PREFIXO_VISITANTE}${nome}`;
}

export function lerVisitante(nome, padrao = null) {
  try {
    const atual = localStorage.getItem(chaveVisitante(nome));
    const legado = atual === null ? localStorage.getItem(CHAVES_ANTIGAS[nome]) : null;
    const bruto = atual ?? legado;
    if (bruto === null) return padrao;
    const dados = JSON.parse(bruto);
    if (legado !== null) {
      localStorage.setItem(chaveVisitante(nome), JSON.stringify(dados));
      localStorage.removeItem(CHAVES_ANTIGAS[nome]);
    }
    return dados;
  } catch {
    return padrao;
  }
}

export function salvarVisitante(nome, dados) {
  localStorage.setItem(chaveVisitante(nome), JSON.stringify(dados));
}

export function removerDadosContaLocal() {
  for (const chave of Object.values(CHAVES_ANTIGAS)) localStorage.removeItem(chave);
  for (const nome of ['plano', 'progresso', 'simulados', 'cronograma', 'atividades']) {
    localStorage.removeItem(chaveVisitante(nome));
  }
}

export function coletarDadosVisitante() {
  return {
    plano: lerVisitante('plano'),
    progresso: lerVisitante('progresso', { materias: {}, registros: {} }),
    simulados: lerVisitante('simulados', { materias: {}, modalidades: {}, historico: [] }),
  };
}

export function existemDadosVisitante(dados = coletarDadosVisitante()) {
  return Boolean(
    dados.plano ||
    Object.keys(dados.progresso?.registros || {}).length ||
    (dados.simulados?.historico || []).length
  );
}

export function limparDadosVisitante() {
  for (const nome of ['plano', 'progresso', 'simulados']) {
    localStorage.removeItem(chaveVisitante(nome));
    const legado = CHAVES_ANTIGAS[nome];
    if (legado) localStorage.removeItem(legado);
  }
}
