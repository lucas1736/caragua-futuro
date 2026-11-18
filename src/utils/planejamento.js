export const opcoesPorObjetivo = {
  IFSP: [
    { id: 'integrado', nome: 'IFSP Integrado ao Ensino Médio' },
    { id: 'concomitante', nome: 'IFSP Concomitante e Subsequente' },
  ],
  ETEC: [{ id: 'etec', nome: 'Vestibulinho ETEC' }],
  FATEC: [{ id: 'fatec', nome: 'Vestibular FATEC' }],
  'Concurso público': [{ id: 'concurso', nome: 'Concurso público' }],
  Vestibular: [
    { id: 'enem', nome: 'ENEM' },
    { id: 'outros', nome: 'Outros vestibulares' },
  ],
};

export const materiasPorModalidade = {
  integrado: ['Português', 'Matemática'],
  concomitante: ['Português', 'Matemática'],
  etec: ['Português', 'Matemática', 'História', 'Geografia', 'Biologia', 'Física', 'Química'],
  fatec: ['Português', 'Matemática', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Redação'],
  concurso: ['Português', 'Matemática', 'História', 'Geografia'],
  enem: ['Português', 'Matemática', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Redação'],
  outros: ['Português', 'Matemática', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Redação'],
};

export const nomesModalidades = Object.fromEntries(
  Object.entries(opcoesPorObjetivo).flatMap(([, opcoes]) => opcoes.map(({ id, nome }) => [id, nome]))
);

export function obterOpcoesModalidade(objetivo) {
  return opcoesPorObjetivo[objetivo] || [];
}

export function obterMateriasModalidade(modalidade) {
  return materiasPorModalidade[modalidade] || [];
}

export function obterSugestaoPlanejamento(horas, diasSelecionados) {
  if (horas <= 2) {
    return {
      distribuicao: 'Priorizar teoria e exercícios essenciais.',
      dificuldade: 'Carga reduzida - focar nos conteúdos mais importantes.',
    };
  }
  if (horas <= 4) {
    return {
      distribuicao: '3 blocos de teoria e 2 de prática semanais.',
      dificuldade: 'Intermediário - equilibrar teoria e exercícios.',
    };
  }
  return {
    distribuicao: '4 blocos de teoria e 3 de prática semanais.',
    dificuldade: 'Avançado - incluir revisões e simulados.',
  };
}

export function obterDicaDescanso(diasSelecionados) {
  return !diasSelecionados.includes('Sáb') && !diasSelecionados.includes('Dom')
    ? 'Dica de planejamento: mantenha o fim de semana livre para descansar e recuperar o conteúdo.'
    : 'Dica de planejamento: faça revisões leves no fim de semana para reforçar o conteúdo.';
}

export function obterEstrategia(horas) {
  if (horas <= 2) {
    return 'Como seu tempo é limitado, o plano vai priorizar os assuntos mais importantes das matérias selecionadas, evitando sobrecarregar seus estudos.';
  }
  if (horas <= 4) {
    return 'Seu tempo permite equilibrar teoria, exercícios e revisões. A sugestão distribui as matérias durante a semana para apoiar uma rotina sustentável.';
  }
  return 'Como você possui bastante tempo disponível, o plano poderá incluir teoria, exercícios, revisões espaçadas e simulados.';
}

export function validarPlanoEstudo(plano) {
  if (!plano.objetivo) return 'Selecione seu objetivo principal.';
  if (!plano.modalidade) return 'Selecione uma modalidade.';
  if (!plano.materias.length) return 'Selecione pelo menos uma matéria.';
  if (!plano.data) return 'Escolha a data estimada do exame.';
  if (!plano.dias.length) return 'Você precisa selecionar pelo menos um dia.';
  return '';
}

export function gerarGradeSemanal(plano, materiasSemana = plano?.materias || [], dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']) {
  const diasAtivos = dias.filter((dia) => plano?.dias?.includes(dia));
  if (!diasAtivos.length) return [];
  return dias.map((dia, indiceDia) => ({
    dia,
    materias: diasAtivos.includes(dia)
      ? materiasSemana.filter((_, indiceMateria) => indiceMateria % diasAtivos.length === diasAtivos.indexOf(dia))
      : [],
    indice: indiceDia,
  }));
}

export function distribuirMateriasPorDia(materias, diasSelecionados) {
  return gerarGradeSemanal({ dias: diasSelecionados, materias });
}
