const q = (materia, pergunta, alternativas, correta, explicacao) => ({
  materia,
  pergunta,
  alternativas,
  correta,
  explicacao,
});

const questoesConcurso = [
  // PORTUGUÊS — 6
  q('Português', 'Qual frase está correta quanto ao uso da crase?',
    ['Fui à pé até o centro.', 'Entreguei o documento à diretora.', 'Ele começou à estudar.', 'Não vou à ninguém.', 'Refiro-me à aquele aluno.'], 1,
    'Há crase quando se une a preposição "a" ao artigo "a" de "a diretora".'),
  q('Português', 'Assinale a frase correta quanto à concordância nominal:',
    ['Seguem anexo as planilhas.', 'Seguem anexas as planilhas.', 'Os documentos estão em anexa.', 'Seguem anexo os planilhas.', 'Segue anexas as planilhas.'], 1,
    '"Anexo" é adjetivo e concorda com o substantivo: planilhas → anexas.'),
  q('Português', 'No trecho "O servidor atendeu o público com presteza", a palavra "presteza" significa:',
    ['Lentidão', 'Rapidez e prontidão', 'Grosseria', 'Hesitação', 'Indiferença'], 1,
    'Presteza é agilidade, disposição em atender.'),
  q('Português', 'Qual é a forma correta?',
    ['Aluga-se casas.', 'Alugam-se casas.', 'Alugam casas-se.', 'Se aluga casas.', 'Alugase casas.'], 1,
    'Na voz passiva sintética, o verbo concorda com o sujeito: casas → alugam-se.'),
  q('Português', 'Na frase "Choveu muito ontem", o sujeito é:',
    ['Inexistente (oração sem sujeito)', 'Oculto', 'Simples', 'Composto', 'Indeterminado'], 0,
    'Verbos que indicam fenômenos da natureza são impessoais e não têm sujeito.'),
  q('Português', 'Qual alternativa apresenta linguagem adequada a um ofício?',
    ['Cara Maria, blz?', 'Solicito a V. Sa. que providencie o documento.', 'Manda aí o papel, valeu.', 'Oi chefe, tudo certo?', 'Me vê isso rápido!'], 1,
    'Correspondências oficiais exigem linguagem formal, impessoal e objetiva.'),

  // MATEMÁTICA E RACIOCÍNIO LÓGICO — 6
  q('Matemática', 'Quanto é 20% de 450?', ['70', '80', '90', '100', '110'], 2, '450 × 0,20 = 90.'),
  q('Matemática', 'Três operários constroem um muro em 12 dias. No mesmo ritmo, 6 operários construirão em:',
    ['4 dias', '6 dias', '8 dias', '9 dias', '24 dias'], 1,
    'Grandezas inversamente proporcionais: o dobro de operários, metade do tempo.'),
  q('Raciocínio Lógico', 'Se chove, então a rua molha. A rua não molhou. Conclui-se que:',
    ['Choveu', 'Não choveu', 'Choveu pouco', 'Nada se pode concluir', 'A rua secou'], 1,
    'Negando o consequente, nega-se o antecedente.'),
  q('Raciocínio Lógico', 'Na sequência 2, 6, 18, 54, ..., o próximo termo é:',
    ['108', '126', '162', '148', '216'], 2, 'Cada termo é multiplicado por 3: 54 × 3 = 162.'),
  q('Matemática', 'Um produto de R$ 200,00 recebeu 15% de desconto. O novo preço é:',
    ['R$ 150,00', 'R$ 160,00', 'R$ 170,00', 'R$ 175,00', 'R$ 185,00'], 2, 'Desconto de R$ 30,00; 200 − 30 = 170.'),
  q('Raciocínio Lógico', 'Todos os servidores são pontuais. Carlos é servidor. Logo:',
    ['Carlos é pontual', 'Carlos pode não ser pontual', 'Todo pontual é servidor', 'Carlos não é pontual', 'Nenhum pontual é servidor'], 0,
    'Se todo servidor é pontual e Carlos é servidor, Carlos é pontual.'),

  // INFORMÁTICA — 4
  q('Informática', 'Qual é o atalho padrão para copiar no Windows?',
    ['Ctrl + V', 'Ctrl + C', 'Ctrl + X', 'Ctrl + Z', 'Ctrl + P'], 1, 'Ctrl + C copia; Ctrl + V cola.'),
  q('Informática', 'Qual é a extensão padrão de um arquivo do Word atual?',
    ['.xlsx', '.pptx', '.docx', '.pdf', '.txt'], 2, 'O formato padrão do Word é .docx.'),
  q('Informática', 'Qual é uma boa prática para criar senhas seguras?',
    ['Usar a mesma senha em todos os sites', 'Usar a data de nascimento', 'Combinar letras, números e símbolos em uma senha longa', 'Compartilhar com colegas', 'Anotar em papel colado no monitor'], 2,
    'Senhas longas e variadas são mais difíceis de descobrir.'),
  q('Informática', 'O software malicioso que bloqueia dados e exige pagamento é chamado de:',
    ['Spyware', 'Ransomware', 'Adware', 'Firewall', 'Antivírus'], 1, 'Ransomware sequestra arquivos e pede resgate.'),

  // CONHECIMENTOS GERAIS E NOÇÕES DE DIREITO — 4
  q('Noções de Direito', 'A Administração Pública obedece aos princípios de legalidade, impessoalidade, moralidade, publicidade e:',
    ['Eficiência', 'Liberdade', 'Sigilo', 'Autonomia', 'Igualdade'], 0, 'Art. 37 da Constituição Federal (LIMPE).'),
  q('Noções de Direito', 'Em regra, o ingresso em cargo público efetivo depende de:',
    ['Indicação política', 'Concurso público de provas ou de provas e títulos', 'Sorteio', 'Análise apenas de currículo', 'Entrevista pessoal'], 1,
    'A Constituição exige concurso público para cargos efetivos.'),
  q('Conhecimentos Gerais', 'São Poderes da União, independentes e harmônicos entre si:',
    ['Legislativo, Executivo e Judiciário', 'Executivo, Judiciário e Ministério Público', 'Legislativo, Militar e Executivo', 'Federal, Estadual e Municipal', 'Judiciário, Eleitoral e Fiscal'], 0,
    'Art. 2º da Constituição Federal.'),
  q('Noções de Direito', 'Na Lei de Acesso à Informação (Lei nº 12.527/2011), a regra é:',
    ['O sigilo', 'A publicidade, sendo o sigilo exceção', 'Acesso só para jornalistas', 'Acesso só para servidores', 'Cobrança obrigatória pelas informações'], 1,
    'A transparência é a regra; o sigilo é exceção.'),
];

export const BANCOS_CONCURSO = {
  concurso: {
    titulo: 'Concurso Público',
    descricao: 'Simulado de treino com 20 questões de Português, Matemática, Raciocínio Lógico, Informática e Noções de Direito.',
    instituicao: 'Concurso',
    areas: 'Português, Matemática e Raciocínio Lógico, Informática e Noções de Direito',
    tempoMinutos: 30,
    questoes: questoesConcurso,
  },
};
