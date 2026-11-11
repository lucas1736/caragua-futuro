
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import { registrarResultado } from '../service/simulados.js';

const QUESTOES = {
  'Matemática': [
    {
      pergunta: 'Quanto é 25% de 200?',
      alternativas: ['25', '40', '50', '75'],
      correta: 2,
    },
    {
      pergunta: 'Qual é o resultado de 8 × 7?',
      alternativas: ['54', '56', '64', '48'],
      correta: 1,
    },
    {
      pergunta: 'Resolva a equação: 2x + 6 = 14.',
      alternativas: ['2', '3', '4', '5'],
      correta: 2,
    },
  ],

  'Português': [
    {
      pergunta: 'Qual alternativa apresenta um substantivo?',
      alternativas: ['Correr', 'Bonito', 'Casa', 'Rapidamente'],
      correta: 2,
    },
    {
      pergunta: 'Qual é o plural de cidadão?',
      alternativas: ['Cidadões', 'Cidadãos', 'Cidadães', 'Cidadãoses'],
      correta: 1,
    },
    {
      pergunta: 'Em qual alternativa há um verbo no passado?',
      alternativas: ['Eu estudo', 'Eu estudarei', 'Eu estudei', 'Eu estudarei amanhã'],
      correta: 2,
    },
  ],

  'Física': [
    {
      pergunta: 'Qual é a unidade de medida da força no Sistema Internacional?',
      alternativas: ['Joule', 'Newton', 'Watt', 'Metro'],
      correta: 1,
    },
    {
      pergunta: 'Qual fórmula representa a velocidade média?',
      alternativas: ['Distância × tempo', 'Distância / tempo', 'Massa × aceleração', 'Tempo / distância'],
      correta: 1,
    },
    {
      pergunta: 'Qual é a aceleração de um corpo em movimento uniforme?',
      alternativas: ['Zero', '10 m/s²', '100 m/s²', 'Depende da massa'],
      correta: 0,
    },
  ],

  'Química': [
    {
      pergunta: 'Qual é o símbolo químico da água?',
      alternativas: ['CO2', 'O2', 'H2O', 'NaCl'],
      correta: 2,
    },
    {
      pergunta: 'Qual partícula possui carga elétrica negativa?',
      alternativas: ['Próton', 'Nêutron', 'Elétron', 'Núcleo'],
      correta: 2,
    },
    {
      pergunta: 'Qual é o pH de uma solução neutra, a 25 °C?',
      alternativas: ['0', '5', '7', '14'],
      correta: 2,
    },
  ],

  'Biologia': [
    {
      pergunta: 'Qual estrutura é responsável pela produção de energia na célula?',
      alternativas: ['Ribossomo', 'Mitocôndria', 'Núcleo', 'Membrana'],
      correta: 1,
    },
    {
      pergunta: 'Qual molécula armazena as informações genéticas?',
      alternativas: ['DNA', 'Glicose', 'Água', 'Lipídio'],
      correta: 0,
    },
    {
      pergunta: 'Como são chamados os organismos que produzem seu próprio alimento?',
      alternativas: ['Consumidores', 'Decompositores', 'Autótrofos', 'Parasitas'],
      correta: 2,
    },
  ],

  'História': [
    {
      pergunta: 'Em que ano ocorreu a Independência do Brasil?',
      alternativas: ['1500', '1822', '1889', '1922'],
      correta: 1,
    },
    {
      pergunta: 'Quem foi o primeiro presidente do Brasil?',
      alternativas: ['Dom Pedro I', 'Getúlio Vargas', 'Deodoro da Fonseca', 'Juscelino Kubitschek'],
      correta: 2,
    },
    {
      pergunta: 'Qual acontecimento marcou o início da Revolução Francesa?',
      alternativas: ['Queda da Bastilha', 'Descobrimento do Brasil', 'Guerra Fria', 'Revolução Industrial'],
      correta: 0,
    },
  ],

  'Geografia': [
    {
      pergunta: 'Qual é o maior país da América do Sul em extensão territorial?',
      alternativas: ['Argentina', 'Brasil', 'Chile', 'Peru'],
      correta: 1,
    },
    {
      pergunta: 'Qual é a capital do estado de São Paulo?',
      alternativas: ['Campinas', 'Santos', 'São Paulo', 'Caraguatatuba'],
      correta: 2,
    },
    {
      pergunta: 'Qual linha imaginária divide a Terra em hemisférios Norte e Sul?',
      alternativas: ['Meridiano de Greenwich', 'Trópico de Capricórnio', 'Linha do Equador', 'Círculo Polar Ártico'],
      correta: 2,
    },
  ],

  'Redação': [
    {
      pergunta: 'Qual é a principal função da introdução de uma redação dissertativa?',
      alternativas: [
        'Apresentar o tema e a tese',
        'Apresentar somente exemplos',
        'Finalizar o texto',
        'Repetir a conclusão',
      ],
      correta: 0,
    },
    {
      pergunta: 'Qual alternativa apresenta um conectivo de conclusão?',
      alternativas: ['Entretanto', 'Além disso', 'Portanto', 'Embora'],
      correta: 2,
    },
    {
      pergunta: 'Em uma redação dissertativa-argumentativa, os argumentos devem:',
      alternativas: [
        'Ser apenas opiniões sem explicação',
        'Defender a tese com justificativas',
        'Fugir do tema',
        'Substituir a introdução',
      ],
      correta: 1,
    },
  ],
};

function RealizarSimulado() {
  const { materia } = useParams();
  const navigate = useNavigate();

  const nomeMateria = decodeURIComponent(materia || '');
  const questoes = QUESTOES[nomeMateria] || [];

  const [respostas, setRespostas] = useState({});
  const [resultado, setResultado] = useState(null);

  function selecionarResposta(indiceQuestao, alternativa) {
    setRespostas((atual) => ({
      ...atual,
      [indiceQuestao]: alternativa,
    }));
  }

  function finalizarSimulado() {
    let acertos = 0;

    questoes.forEach((questao, indice) => {
      if (respostas[indice] === questao.correta) {
        acertos += 1;
      }
    });

    registrarResultado(nomeMateria, acertos, questoes.length);

    setResultado({
      acertos,
      total: questoes.length,
      porcentagem: Math.round((acertos / questoes.length) * 100),
    });
  }

  if (questoes.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
          <div className="bg-white rounded-xl border p-7 text-center">
            <h1 className="text-xl font-bold">Simulado não encontrado</h1>
            <p className="text-sm text-slate-500 mt-2">
              Não encontramos questões para esta matéria.
            </p>
            <Link to="/simulados" className="text-emerald-700 font-bold text-sm inline-block mt-5">
              Voltar aos simulados
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-7 py-8">
        <Link
          to="/simulados"
          className="text-sm text-emerald-700 font-semibold hover:underline"
        >
          ← Voltar aos simulados
        </Link>

        <div className="mt-5 mb-7">
          <span className="text-xs text-emerald-700 font-bold uppercase">
            Simulado de conhecimentos
          </span>
          <h1 className="text-3xl font-extrabold text-slate-800 mt-2">
            {nomeMateria}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Responda às questões e finalize para conferir seu resultado.
          </p>
        </div>

        {resultado === null ? (
          <>
            <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Questões respondidas</span>
                <strong>{Object.keys(respostas).length} de {questoes.length}</strong>
              </div>
              <div className="h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{
                    width: `${(Object.keys(respostas).length / questoes.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-5">
              {questoes.map((questao, indice) => (
                <section
                  key={indice}
                  className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6"
                >
                  <p className="text-xs text-emerald-700 font-bold mb-2">
                    QUESTÃO {indice + 1}
                  </p>

                  <h2 className="font-bold text-slate-800 mb-5">
                    {questao.pergunta}
                  </h2>

                  <div className="space-y-3">
                    {questao.alternativas.map((alternativa, indiceAlternativa) => (
                      <label
                        key={indiceAlternativa}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                          respostas[indice] === indiceAlternativa
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`questao-${indice}`}
                          checked={respostas[indice] === indiceAlternativa}
                          onChange={() => selecionarResposta(indice, indiceAlternativa)}
                          className="accent-emerald-600"
                        />
                        <span className="text-sm text-slate-700">
                          {String.fromCharCode(65 + indiceAlternativa)}. {alternativa}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <button
              type="button"
              onClick={finalizarSimulado}
              disabled={Object.keys(respostas).length !== questoes.length}
              className="w-full mt-6 bg-[#063b29] hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition"
            >
              Finalizar e corrigir simulado
            </button>

            {Object.keys(respostas).length !== questoes.length && (
              <p className="text-center text-xs text-slate-500 mt-3">
                Responda todas as questões para finalizar.
              </p>
            )}
          </>
        ) : (
          <section className="bg-white border border-slate-200 rounded-xl p-7 text-center shadow-sm">
            <div className="text-5xl mb-4">
              {resultado.porcentagem >= 70 ? '🎉' : '📚'}
            </div>

            <h2 className="text-2xl font-extrabold text-slate-800">
              Simulado finalizado!
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Confira seu desempenho em {nomeMateria}.
            </p>

            <div className="my-7">
              <p className="text-5xl font-extrabold text-emerald-600">
                {resultado.porcentagem}%
              </p>
              <p className="text-sm text-slate-500 mt-2">
                {resultado.acertos} acertos de {resultado.total} questões
              </p>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-7">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${resultado.porcentagem}%` }}
              />
            </div>

            <p className="text-sm text-slate-600 mb-6">
              {resultado.porcentagem >= 70
                ? 'Muito bem! Continue praticando para manter seu desempenho.'
                : 'Continue estudando e tente novamente para melhorar seu resultado.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate('/simulados')}
                className="flex-1 bg-[#063b29] text-white font-bold text-sm py-3 rounded-lg"
              >
                Voltar aos simulados
              </button>

              <Link
                to="/progresso"
                className="flex-1 border border-emerald-600 text-emerald-700 font-bold text-sm py-3 rounded-lg"
              >
                Ver meu progresso
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default RealizarSimulado;
