// Metas sugeridas para cada modalidade de estudo.
// Os conteúdos seguem o que realmente é cobrado em cada processo
// seletivo (mesmas matérias/áreas usadas nos simulados do site).
// Ao serem adicionadas, viram metas comuns do usuário (CRUD /api/metas).

export const NOMES_MODALIDADES = {
  integrado: 'IFSP Integrado ao Ensino Médio',
  concomitante: 'IFSP Concomitante e Subsequente',
  etec: 'Vestibulinho ETEC',
  fatec: 'Vestibular FATEC',
  concurso: 'Concurso público',
  enem: 'ENEM',
  outros: 'Outros vestibulares',
};

export const SUGESTOES_POR_MODALIDADE = {
  integrado: [
    {
      titulo: 'Revisar interpretação de texto (causa, conclusão e concessão)',
      materia: 'Português',
      descricao: 'Conteúdo central do IFSP Integrado: identificar causa, conclusão, finalidade e comparação nos enunciados.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Dominar as quatro operações, frações e decimais',
      materia: 'Matemática',
      descricao: 'Base do nível do Ensino Fundamental cobrado na prova do integrado.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Resolver problemas de porcentagem e regra de três',
      materia: 'Matemática',
      descricao: 'Tipo de questão que mais aparece no processo seletivo do IFSP.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Praticar concordância, pontuação e ortografia',
      materia: 'Português',
      descricao: 'Questões de gramática básica aparecem em toda prova do integrado.',
      prioridade: 'Média',
    },
    {
      titulo: 'Fazer 1 simulado do estilo IFSP por semana',
      materia: 'Geral',
      descricao: 'Use a página de Simulados do site (IFSP Integrado) e registre o resultado.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Refazer as questões erradas dos simulados',
      materia: 'Geral',
      descricao: 'Leia a explicação da resposta correta e anote a dúvida em um caderno de erros.',
      prioridade: 'Média',
    },
  ],

  concomitante: [
    {
      titulo: 'Revisar crase, regência e concordância',
      materia: 'Português',
      descricao: 'Gramática exigida no processo seletivo para cursos concomitantes e subsequentes.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Treinar equações do 2º grau e funções',
      materia: 'Matemática',
      descricao: 'Conteúdo de Matemática do Ensino Médio cobrado na prova.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Resolver problemas de porcentagem, escalas e proporcionalidade',
      materia: 'Matemática',
      descricao: 'Questões aplicadas ao cotidiano, comum no estilo IFSP.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Estudar interpretação de enunciados longos',
      materia: 'Português',
      descricao: 'Treinar extrair os dados essenciais de textos e problemas.',
      prioridade: 'Média',
    },
    {
      titulo: 'Fazer 1 simulado do estilo IFSP por semana',
      materia: 'Geral',
      descricao: 'Use a página de Simulados do site (IFSP Concomitante e Subsequente).',
      prioridade: 'Alta',
    },
    {
      titulo: 'Criar resumos das dúvidas mais frequentes',
      materia: 'Geral',
      descricao: 'Monte fichas com as dúvidas de cada simulado e revise antes da prova.',
      prioridade: 'Média',
    },
  ],

  etec: [
    {
      titulo: 'Revisar acentuação, concordância e figuras de linguagem',
      materia: 'Português',
      descricao: 'Língua Portuguesa tem peso grande no Vestibulinho ETEC.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Dominar frações, porcentagem e regra de três',
      materia: 'Matemática',
      descricao: 'Matemática básica e aplicada é o núcleo da prova de exatas.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Estudar História e Geografia do Brasil',
      materia: 'História',
      descricao: 'Ciências Humanas entram no Vestibulinho: período colonial, República e urbanização.',
      prioridade: 'Média',
    },
    {
      titulo: 'Revisar ecologia, cadeias alimentares e meio ambiente',
      materia: 'Biologia',
      descricao: 'Ciências da Natureza cobradas no estilo do vestibulinho.',
      prioridade: 'Média',
    },
    {
      titulo: 'Treinar interpretação de gráficos e tabelas',
      materia: 'Matemática',
      descricao: 'Leitura de gráficos aparece tanto em Matemática quanto em Ciências.',
      prioridade: 'Média',
    },
    {
      titulo: 'Fazer 1 simulado do Vestibulinho ETEC por semana',
      materia: 'Geral',
      descricao: 'Use a página de Simulados do site (ETEC — 50 questões).',
      prioridade: 'Alta',
    },
  ],

  fatec: [
    {
      titulo: 'Revisar interpretação de texto e estrutura da dissertação',
      materia: 'Português',
      descricao: 'A prova da FATEC é fortemente baseada em interpretação de textos.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Treinar funções, logaritmos e geometria espacial',
      materia: 'Matemática',
      descricao: 'Conteúdos de nível médio/técnico cobrados no Vestibular FATEC.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Resolver exercícios de cinemática e leis de Newton',
      materia: 'Física',
      descricao: 'Física com enfoque em interpretação, no estilo FATEC.',
      prioridade: 'Média',
    },
    {
      titulo: 'Revisar tabela periódica e funções inorgânicas',
      materia: 'Química',
      descricao: 'Química básica exigida no vestibular das FATECs.',
      prioridade: 'Média',
    },
    {
      titulo: 'Escrever 1 redação por semana',
      materia: 'Redação',
      descricao: 'Treine dissertação argumentativa com introdução, desenvolvimento e conclusão.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Fazer 1 simulado estilo vestibular por semana',
      materia: 'Geral',
      descricao: 'Alterne entre as modalidades da página de Simulados.',
      prioridade: 'Média',
    },
  ],

  concurso: [
    {
      titulo: 'Dominar crase, concordância e regência',
      materia: 'Português',
      descricao: 'Língua Portuguesa é a matéria com mais questões em concursos de nível médio.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Treinar porcentagem, regra de três e razão',
      materia: 'Matemática',
      descricao: 'Matemática básica aplicada, cobrada em concursos municipais e estaduais.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Resolver questões de raciocínio lógico semanalmente',
      materia: 'Matemática',
      descricao: 'Proposições, negações e sequências lógicas são recorrentes.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Estudar os princípios da Administração Pública (LIMPE)',
      materia: 'Geral',
      descricao: 'Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência (art. 37 da CF).',
      prioridade: 'Média',
    },
    {
      titulo: 'Revisar informática: atalhos, formatos e segurança da informação',
      materia: 'Geral',
      descricao: 'Noções de informática aparecem em quase todo concurso.',
      prioridade: 'Média',
    },
    {
      titulo: 'Fazer 1 simulado de concurso por semana',
      materia: 'Geral',
      descricao: 'Use a página de Simulados do site (Concurso Público — 20 questões).',
      prioridade: 'Alta',
    },
  ],

  enem: [
    {
      titulo: 'Revisar funções de linguagem e figuras de linguagem',
      materia: 'Português',
      descricao: 'Linguagens: interpretação e análise de textos diversos no estilo ENEM.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Treinar funções, progressões e probabilidade',
      materia: 'Matemática',
      descricao: 'Matemática e suas Tecnologias com foco em problemas contextualizados.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Estudar ecologia, citologia e genética',
      materia: 'Biologia',
      descricao: 'Ciências da Natureza: os temas de Biologia mais cobrados no ENEM.',
      prioridade: 'Média',
    },
    {
      titulo: 'Revisar leis de Newton, energia e eletricidade',
      materia: 'Física',
      descricao: 'Física contextualizada, comum nas provas do ENEM.',
      prioridade: 'Média',
    },
    {
      titulo: 'Escrever 1 redação modelo ENEM por semana',
      materia: 'Redação',
      descricao: 'Treine estrutura dissertativo-argumentativa com repertório sociocultural.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Resolver 1 simulado estilo ENEM por semana',
      materia: 'Geral',
      descricao: 'Use a página de Simulados do site (Vestibular — 20 questões).',
      prioridade: 'Alta',
    },
  ],

  outros: [
    {
      titulo: 'Revisar interpretação de texto e gramática essencial',
      materia: 'Português',
      descricao: 'Interpretação e gramática são a base de qualquer vestibular.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Treinar álgebra, geometria e probabilidade',
      materia: 'Matemática',
      descricao: 'Conteúdos de Matemática mais cobrados nos vestibulares.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Estudar História do Brasil e Geografia atual',
      materia: 'História',
      descricao: 'Ciências Humanas com foco em fatos e interpretação.',
      prioridade: 'Média',
    },
    {
      titulo: 'Revisar Biologia, Química e Física básicas',
      materia: 'Biologia',
      descricao: 'Ciências da Natureza no nível exigido pelos vestibulares.',
      prioridade: 'Média',
    },
    {
      titulo: 'Escrever 1 redação por semana',
      materia: 'Redação',
      descricao: 'Dissertação argumentativa com projeto de texto bem estruturado.',
      prioridade: 'Alta',
    },
    {
      titulo: 'Fazer 1 simulado por semana',
      materia: 'Geral',
      descricao: 'Use a página de Simulados do site e acompanhe seu aproveitamento.',
      prioridade: 'Média',
    },
  ],
};

export function nomeModalidade(id) {
  return NOMES_MODALIDADES[id] || '';
}

export function sugestoesDaModalidade(id) {
  return SUGESTOES_POR_MODALIDADE[id] || [];
}
