export const diasCronograma = [
  { nome: 'Segunda', abreviacao: 'Seg' },
  { nome: 'Terça', abreviacao: 'Ter' },
  { nome: 'Quarta', abreviacao: 'Qua' },
  { nome: 'Quinta', abreviacao: 'Qui' },
  { nome: 'Sexta', abreviacao: 'Sex' },
  { nome: 'Sábado', abreviacao: 'Sáb' },
  { nome: 'Domingo', abreviacao: 'Dom' },
];

export const horariosCronograma = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

export const estudosPadrao = [
  {
    dia: 0,
    horario: '08:00',
    materia: 'Matemática',
    tipo: 'Teoria',
    duracao: '1h 30m',
    cor: 'orange',
  },
  {
    dia: 1,
    horario: '10:00',
    materia: 'Português',
    tipo: 'Gramática',
    duracao: '1h 30m',
    cor: 'blue',
  },
  {
    dia: 2,
    horario: '08:00',
    materia: 'Matemática',
    tipo: 'Teoria',
    duracao: '1h 30m',
    cor: 'orange',
  },
  { dia: 3, horario: '10:00', materia: 'Física', tipo: 'Teoria', duracao: '1h 30m', cor: 'green' },
  {
    dia: 4,
    horario: '08:00',
    materia: 'Biologia',
    tipo: 'Teoria',
    duracao: '1h 30m',
    cor: 'green',
  },
  { dia: 0, horario: '14:00', materia: 'Redação', tipo: 'Prática', duracao: '2h', cor: 'blue' },
  { dia: 2, horario: '14:00', materia: 'História', tipo: 'Teoria', duracao: '2h', cor: 'purple' },
  { dia: 1, horario: '16:00', materia: 'Química', tipo: 'Revisão', duracao: '1h', cor: 'green' },
  {
    dia: 3,
    horario: '16:00',
    materia: 'Geografia',
    tipo: 'Teoria',
    duracao: '1h 30m',
    cor: 'purple',
  },
  { dia: 4, horario: '14:00', materia: 'Física', tipo: 'Exercícios', duracao: '2h', cor: 'green' },
];

export const coresCronograma = {
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
};

export function obterCorMateria(materia) {
  if (materia === 'Matemática') return 'orange';
  if (materia === 'Português' || materia === 'Redação') return 'blue';
  if (materia === 'História' || materia === 'Geografia') return 'purple';
  return 'green';
}

export function gerarGradeCronograma(
  plano,
  sessoesPersonalizadas = [],
  horarios = horariosCronograma,
) {
  const materias = Array.isArray(plano?.materias) ? plano.materias : [];
  const diasAtivos = diasCronograma
    .map((dia, indice) => ({ ...dia, indice }))
    .filter((dia) => plano?.dias?.includes(dia.abreviacao));
  const sessoesPlano = diasAtivos.flatMap((dia, indiceDia) =>
    materias
      .filter((_, indiceMateria) => indiceMateria % Math.max(1, diasAtivos.length) === indiceDia)
      .map((materia, indiceMateria) => ({
        dia: dia.indice,
        horario: horarios[(indiceMateria + indiceDia) % horarios.length],
        materia,
        tipo: 'Estudo planejado',
        duracao: `${plano?.horas || 1}h`,
        cor: obterCorMateria(materia),
        origem: 'plano',
      })),
  );
  const sessoes = sessoesPersonalizadas === null ? sessoesPlano : sessoesPersonalizadas;
  return horarios.map((horario) => ({
    horario,
    dias: diasCronograma.map((dia, indice) => ({
      ...dia,
      indice,
      estudo:
        sessoes.find((item) => Number(item.dia) === indice && item.horario === horario) || null,
    })),
  }));
}

export function podeAdicionarSessao(sessoes, sessao) {
  return !sessoes.some(
    (item) => Number(item.dia) === Number(sessao.dia) && item.horario === sessao.horario,
  );
}
