
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import { BANCOS_IFSP } from '../service/questoesIFSP.js';
import { BANCO_ETEC } from '../service/questoesETEC.js';
import { registrarResultadoModalidade } from '../service/simulados.js';

function RealizarSimulado() {
  const { materia } = useParams();
  const navigate = useNavigate();

  const modalidade = materia || '';

  const banco =
    modalidade === 'etec'
      ? BANCO_ETEC
      : BANCOS_IFSP[modalidade];

  const questoes = banco?.questoes || [];

  const [respostas, setRespostas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [tempoRestante, setTempoRestante] = useState(25 * 60);

  const isETEC = modalidade === 'etec';

  function selecionarResposta(indiceQuestao, alternativa) {
    setRespostas((atual) => ({
      ...atual,
      [indiceQuestao]: alternativa,
    }));
  }

  const finalizarSimulado = useCallback((automatico = false) => {
    if (resultado !== null) return;

    if (
      !automatico &&
      Object.keys(respostas).length !== questoes.length
    ) {
      return;
    }

    const acertos = questoes.reduce((total, questao, indice) => {
      return total + (respostas[indice] === questao.correta ? 1 : 0);
    }, 0);

    const total = questoes.length;
    const porcentagem = Math.round((acertos / total) * 100);

    registrarResultadoModalidade(modalidade, acertos, total);

    setResultado({
      acertos,
      total,
      porcentagem,
      automatico,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [respostas, questoes, modalidade, resultado]);

  // Inicia a contagem regressiva de 25 minutos.
  useEffect(() => {
    if (resultado !== null || questoes.length === 0) return;

    const intervalo = setInterval(() => {
      setTempoRestante((atual) => Math.max(atual - 1, 0));
    }, 1000);

    return () => clearInterval(intervalo);
  }, [resultado, questoes.length]);

  // Finaliza automaticamente quando o tempo acaba.
  useEffect(() => {
    if (
      tempoRestante === 0 &&
      resultado === null &&
      questoes.length > 0
    ) {
      finalizarSimulado(true);
    }
  }, [tempoRestante, resultado, questoes.length, finalizarSimulado]);

  const minutos = String(Math.floor(tempoRestante / 60)).padStart(2, '0');
  const segundos = String(tempoRestante % 60).padStart(2, '0');

  const tempoAcabando = tempoRestante <= 5 * 60;
  const ultimoMinuto = tempoRestante <= 60;

  if (!banco || questoes.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
          <div className="bg-white rounded-xl border p-7 text-center">
            <h1 className="text-xl font-bold text-slate-800">
              Simulado não encontrado
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Escolha um dos simulados disponíveis para continuar.
            </p>

            <Link
              to="/simulados"
              className="text-emerald-700 font-bold text-sm inline-block mt-5"
            >
              Voltar aos simulados
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const respondidas = Object.keys(respostas).length;
  const porcentagemRespondida = (respondidas / questoes.length) * 100;

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
            Simulado {isETEC ? 'ETEC' : 'IFSP'}
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">
            {banco.titulo}
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            {banco.descricao}
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <span className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-2 rounded-lg">
              {questoes.length} questões
            </span>

            <span className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-2 rounded-lg">
              {isETEC
                ? 'Português, Matemática, Ciências Humanas e Ciências da Natureza'
                : 'Português e Matemática'}
            </span>

            <span className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-2 rounded-lg">
              5 alternativas
            </span>

            <span className="bg-amber-50 text-amber-800 text-xs font-semibold px-3 py-2 rounded-lg">
              ⏱️ 25 minutos
            </span>
          </div>
        </div>

        {resultado === null ? (
          <>
            <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 sticky top-2 z-10 shadow-sm">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex-1 min-w-[150px]">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Questões respondidas</span>
                    <strong>
                      {respondidas} de {questoes.length}
                    </strong>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${porcentagemRespondida}%` }}
                    />
                  </div>
                </div>

                <div
                  className={`text-center rounded-lg px-5 py-2 ${
                    ultimoMinuto
                      ? 'bg-red-100 text-red-700'
                      : tempoAcabando
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-50 text-emerald-800'
                  }`}
                >
                  <p className="text-xs font-semibold">
                    Tempo restante
                  </p>

                  <p className="text-2xl font-extrabold tabular-nums">
                    {minutos}:{segundos}
                  </p>
                </div>
              </div>

              {tempoAcabando && (
                <p className="text-xs text-red-600 font-semibold mt-3 text-center">
                  Atenção! O tempo está acabando.
                </p>
              )}
            </div>

            <div className="space-y-5">
              {questoes.map((questao, indice) => (
                <section
                  key={indice}
                  className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6"
                >
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                    <p className="text-xs text-emerald-700 font-bold">
                      QUESTÃO {indice + 1}
                    </p>

                    <span className="text-xs text-slate-400">
                      {questao.materia}
                    </span>
                  </div>

                  <h2 className="font-bold text-slate-800 mb-5 leading-relaxed">
                    {questao.pergunta}
                  </h2>

                  <div className="space-y-3">
                    {questao.alternativas.map((alternativa, indiceAlternativa) => (
                      <label
                        key={indiceAlternativa}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                          respostas[indice] === indiceAlternativa
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`questao-${indice}`}
                          checked={respostas[indice] === indiceAlternativa}
                          onChange={() =>
                            selecionarResposta(indice, indiceAlternativa)
                          }
                          className="accent-emerald-600 mt-1"
                        />

                        <span className="text-sm text-slate-700">
                          <strong className="mr-1">
                            {String.fromCharCode(65 + indiceAlternativa)}.
                          </strong>
                          {alternativa}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <button
              type="button"
              onClick={() => finalizarSimulado(false)}
              disabled={respondidas !== questoes.length}
              className="w-full mt-6 bg-[#063b29] hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition"
            >
              Finalizar e corrigir simulado
            </button>

            {respondidas !== questoes.length && (
              <p className="text-center text-xs text-slate-500 mt-3">
                Ainda faltam {questoes.length - respondidas} questão(ões).
                Responda todas para finalizar manualmente. Quando o tempo acabar,
                o simulado será encerrado automaticamente.
              </p>
            )}
          </>
        ) : (
          <>
            <section className="bg-white border border-slate-200 rounded-xl p-7 text-center shadow-sm mb-6">
              <div className="text-5xl mb-4">
                {resultado.porcentagem >= 70 ? '🎉' : '📚'}
              </div>

              <h2 className="text-2xl font-extrabold text-slate-800">
                Simulado finalizado!
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                {resultado.automatico
                  ? 'O tempo acabou e suas respostas foram corrigidas automaticamente.'
                  : 'Você concluiu o simulado antes do tempo acabar.'}
              </p>

              <p className="text-sm text-slate-500 mt-2">
                Seu resultado em {banco.titulo}.
              </p>

              <div className="my-7">
                <p className="text-5xl font-extrabold text-emerald-600">
                  {resultado.porcentagem}%
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  {resultado.acertos} acertos de {resultado.total} questões
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="text-xs text-emerald-700">Acertos</p>
                  <p className="text-xl font-bold text-emerald-800">
                    {resultado.acertos}
                  </p>
                </div>

                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-red-700">Erros</p>
                  <p className="text-xl font-bold text-red-800">
                    {resultado.total - resultado.acertos}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 mt-6">
                {resultado.porcentagem >= 70
                  ? 'Muito bem! Continue praticando para manter seu desempenho.'
                  : 'Continue estudando os conteúdos e tente novamente para melhorar seu resultado.'}
              </p>
            </section>

            <h2 className="text-xl font-extrabold text-slate-800 mb-4">
              Correção das questões
            </h2>

            <div className="space-y-4">
              {questoes.map((questao, indice) => {
                const respostaAluno = respostas[indice];
                const acertou = respostaAluno === questao.correta;

                return (
                  <section
                    key={indice}
                    className="bg-white border border-slate-200 rounded-xl p-5"
                  >
                    <div className="flex justify-between items-center gap-3 mb-3">
                      <span className="text-xs font-bold text-slate-500">
                        QUESTÃO {indice + 1} · {questao.materia}
                      </span>

                      <span
                        className={`text-xs font-bold ${
                          acertou ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {acertou ? '✓ Acertou' : '✕ Errou'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-800 mb-4">
                      {questao.pergunta}
                    </h3>

                    <p className="text-sm text-slate-600">
                      Sua resposta:{' '}
                      <strong>
                        {respostaAluno === undefined
                          ? 'Não respondida'
                          : `${String.fromCharCode(65 + respostaAluno)}. ${questao.alternativas[respostaAluno]}`}
                      </strong>
                    </p>

                    {!acertou && (
                      <p className="text-sm text-emerald-700 mt-2">
                        Resposta correta:{' '}
                        <strong>
                          {String.fromCharCode(65 + questao.correta)}.{' '}
                          {questao.alternativas[questao.correta]}
                        </strong>
                      </p>
                    )}

                    <div className="bg-slate-50 rounded-lg p-3 mt-3">
                      <p className="text-xs font-bold text-slate-700 mb-1">
                        Entenda a resposta
                      </p>

                      <p className="text-sm text-slate-600">
                        {questao.explicacao}
                      </p>
                    </div>
                  </section>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate('/simulados')}
                className="flex-1 bg-[#063b29] text-white font-bold text-sm py-3 rounded-lg"
              >
                Voltar aos simulados
              </button>

              <Link
                to="/progresso"
                className="flex-1 text-center border border-emerald-600 text-emerald-700 font-bold text-sm py-3 rounded-lg"
              >
                Ver meu progresso
              </Link>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default RealizarSimulado;
