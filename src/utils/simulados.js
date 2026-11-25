export function embaralhar(lista, aleatorio = Math.random) {
  const resultado = [...lista];
  for (let indice = resultado.length - 1; indice > 0; indice -= 1) {
    const destino = Math.floor(aleatorio() * (indice + 1));
    [resultado[indice], resultado[destino]] = [resultado[destino], resultado[indice]];
  }
  return resultado;
}

export function embaralharQuestoes(questoes, aleatorio = Math.random) {
  return embaralhar(questoes, aleatorio).map((questao) => {
    const alternativasComCorreta = questao.alternativas.map((texto, indice) => ({
      texto,
      correta: indice === questao.correta,
    }));
    const alternativasEmbaralhadas = embaralhar(alternativasComCorreta, aleatorio);
    return {
      ...questao,
      alternativas: alternativasEmbaralhadas.map((item) => item.texto),
      correta: alternativasEmbaralhadas.findIndex((item) => item.correta),
    };
  });
}

export function calcularResultado(questoes, respostas) {
  const desempenhoMaterias = {};
  let acertos = 0;
  for (const [indice, questao] of questoes.entries()) {
    const acertou = respostas[indice] === questao.correta;
    if (acertou) acertos += 1;
    const materia = questao.materia || 'Geral';
    desempenhoMaterias[materia] ||= { acertos: 0, total: 0 };
    desempenhoMaterias[materia].total += 1;
    if (acertou) desempenhoMaterias[materia].acertos += 1;
  }
  return {
    acertos,
    total: questoes.length,
    desempenhoMaterias: Object.entries(desempenhoMaterias).map(([materia, dados]) => ({
      materia,
      ...dados,
    })),
  };
}

export function agregarDesempenhoMaterias(resultados) {
  return resultados.reduce((agregado, resultado) => {
    for (const item of resultado.desempenhoMaterias || []) {
      const materia = item.materia || 'Geral';
      agregado[materia] ||= { acertos: 0, total: 0, simulados: 0 };
      agregado[materia].acertos += Number(item.acertos) || 0;
      agregado[materia].total += Number(item.total) || 0;
      agregado[materia].simulados += 1;
    }
    return agregado;
  }, {});
}
