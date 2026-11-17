const q = (materia, pergunta, alternativas, correta, explicacao) => ({
  materia,
  pergunta,
  alternativas,
  correta,
  explicacao,
});

const questoesVestibular = [
  // LINGUAGENS — 5
  q('Português e Literatura', 'O marco inicial do Modernismo brasileiro foi:',
    ['A Semana de Arte Moderna de 1922', 'A Proclamação da República', 'A Abolição da escravatura', 'A Missão Artística Francesa', 'A Independência do Brasil'], 0,
    'A Semana de Arte Moderna, em São Paulo, inaugurou o Modernismo.'),
  q('Português e Literatura', 'Qual obra é de Machado de Assis?',
    ['Dom Casmurro', 'O Cortiço', 'Iracema', 'Vidas Secas', 'O Guarani'], 0, 'Dom Casmurro (1899) é de Machado de Assis.'),
  q('Português e Literatura', 'Em "Compre agora e economize!", predomina a função da linguagem:',
    ['Emotiva', 'Conativa', 'Poética', 'Referencial', 'Metalinguística'], 1,
    'A função conativa busca convencer o receptor, usando o imperativo.'),
  q('Português e Literatura', '"Vidas Secas", de Graciliano Ramos, pertence:',
    ['Ao Romantismo', 'Ao Parnasianismo', 'Ao Modernismo (Romance de 30)', 'Ao Barroco', 'Ao Arcadismo'], 2,
    'Graciliano Ramos integra a segunda fase do Modernismo.'),
  q('Português e Literatura', 'Em "Seus olhos são duas estrelas", ocorre:',
    ['Metáfora', 'Metonímia', 'Hipérbole', 'Ironia', 'Paradoxo'], 0, 'Comparação implícita, sem conectivo.'),

  // MATEMÁTICA — 5
  q('Matemática', 'Se f(x) = 2x + 3, então f(5) é:', ['10', '11', '12', '13', '15'], 3, '2 × 5 + 3 = 13.'),
  q('Matemática', 'A área de um círculo de raio 3 (π ≈ 3,14) é:',
    ['18,84', '28,26', '9,42', '31,40', '56,52'], 1, 'A = πr² = 3,14 × 9 = 28,26.'),
  q('Matemática', 'As raízes de x² − 5x + 6 = 0 são:',
    ['1 e 6', '2 e 3', '−2 e −3', '1 e 5', '3 e 4'], 1, 'Soma 5 e produto 6: as raízes são 2 e 3.'),
  q('Matemática', 'Ao lançar um dado comum, a probabilidade de sair face par é:',
    ['1/6', '1/3', '1/2', '2/3', '5/6'], 2, 'Há 3 faces pares em 6: 3/6 = 1/2.'),
  q('Matemática', 'O valor de log₁₀(1000) é:', ['1', '2', '3', '10', '100'], 2, '10³ = 1000.'),

  // CIÊNCIAS HUMANAS — 5
  q('História', 'O lema da Revolução Francesa foi:',
    ['Liberdade, Igualdade e Fraternidade', 'Deus, Pátria e Família', 'Ordem e Progresso', 'Paz e Terra', 'Trabalho e Capital'], 0,
    '"Liberté, Égalité, Fraternité" resume os ideais revolucionários.'),
  q('História', 'A Lei Áurea, de 1888, determinou:',
    ['O fim da escravidão no Brasil', 'A Independência do Brasil', 'A Proclamação da República', 'O voto feminino', 'A reforma agrária'], 0,
    'Assinada pela Princesa Isabel, aboliu a escravidão.'),
  q('História', 'Qual medida marcou a Era Vargas (1930–1945)?',
    ['A criação da CLT, em 1943', 'A Guerra do Paraguai', 'A abolição da escravidão', 'A chegada da família real', 'O fim da República'], 0,
    'A Consolidação das Leis do Trabalho foi criada em 1943.'),
  q('Geografia', 'O crescimento da população das cidades em relação ao campo é chamado de:',
    ['Urbanização', 'Desertificação', 'Glaciação', 'Erosão', 'Sedimentação'], 0, 'Urbanização é o aumento da população urbana.'),
  q('História', 'O Tratado de Tordesilhas (1494) dividiu terras entre:',
    ['Portugal e Espanha', 'Portugal e Inglaterra', 'Espanha e França', 'Holanda e Portugal', 'Inglaterra e Espanha'], 0,
    'Dividiu as terras descobertas e por descobrir entre as duas coroas ibéricas.'),

  // CIÊNCIAS DA NATUREZA — 5
  q('Biologia', 'A organela responsável pela respiração celular é:',
    ['Ribossomo', 'Mitocôndria', 'Lisossomo', 'Cloroplasto', 'Núcleo'], 1, 'A mitocôndria produz ATP.'),
  q('Física', 'No Sistema Internacional, a unidade de força é:',
    ['Joule', 'Watt', 'Newton', 'Pascal', 'Hertz'], 2, 'A unidade de força é o newton (N).'),
  q('Química', 'O número atômico do carbono é:', ['4', '6', '8', '12', '14'], 1, 'O carbono tem 6 prótons.'),
  q('Física', 'Pela Segunda Lei de Newton, a força resultante é:',
    ['m / a', 'm · a', 'a / m', 'm + a', 'm · v²'], 1, 'F = m · a.'),
  q('Biologia', 'Qual é o principal gás do efeito estufa emitido por atividades humanas?',
    ['Dióxido de carbono', 'Oxigênio', 'Nitrogênio', 'Hélio', 'Argônio'], 0, 'A queima de combustíveis fósseis libera CO₂.'),
];

export const BANCOS_VESTIBULAR = {
  vestibular: {
    titulo: 'Vestibular',
    descricao: 'Simulado de treino com 20 questões de Linguagens, Matemática, Ciências Humanas e Ciências da Natureza.',
    instituicao: 'Vestibular',
    areas: 'Linguagens, Matemática, Ciências Humanas e Ciências da Natureza',
    tempoMinutos: 40,
    questoes: questoesVestibular,
  },
};
