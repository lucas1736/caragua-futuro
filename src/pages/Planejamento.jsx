
import { useEffect, useRef } from 'react';
import Footer from '../components/Footer.jsx';
import iniciarPlanejamento from '../service/Planejamento.js';

function Planejamento() {
  const raiz = useRef(null);

  useEffect(() => {
    if (!raiz.current || raiz.current.dataset.iniciado) return;

    raiz.current.dataset.iniciado = '1';
    iniciarPlanejamento();
  }, []);

  return (
    <div ref={raiz} className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-5 md:px-7 py-9">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Monte seu plano de estudos
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure suas preferências para nossa inteligência artificial
            desenhar sua grade de estudos ideal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">

            {/* 1. OBJETIVO */}
            <div className="mb-5">
              <label
                className="block font-bold text-xs mb-2"
                htmlFor="objetivo"
              >
                1. Qual é o seu objetivo principal?
              </label>

              <select
                className="w-full border border-slate-200 rounded-md px-3 py-3 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"
                id="objetivo"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="IFSP">IFSP</option>
                <option value="ETEC">ETEC</option>
                <option value="FATEC">FATEC</option>
                <option value="Concurso público">Concurso público</option>
                <option value="Vestibular">Vestibular</option>
              </select>
            </div>

            {/* 2. MODALIDADE */}
            <div className="mb-5">
              <label
                className="block font-bold text-xs mb-2"
                htmlFor="modalidade"
              >
                2. Qual modalidade você pretende prestar?
              </label>

              <select
                className="w-full border border-slate-200 rounded-md px-3 py-3 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-slate-100 disabled:text-slate-400"
                id="modalidade"
                defaultValue=""
                disabled
              >
                <option value="">
                  Primeiro selecione seu objetivo
                </option>
              </select>

              <p className="text-[10px] text-slate-500 mt-2">
                As opções serão exibidas conforme o objetivo escolhido.
              </p>
            </div>

            {/* 3. MATÉRIAS */}
            <div className="mb-5">
              <h3 className="font-bold text-xs mb-2">
                3. Matérias para estudar:
              </h3>

              <p className="text-[10px] text-slate-500 mb-3">
                As matérias serão selecionadas automaticamente conforme
                a modalidade escolhida. Você também poderá ajustá-las.
              </p>

              <div className="flex flex-wrap gap-2" id="materias">
                {[
                  'Matemática',
                  'Português',
                  'Física',
                  'Química',
                  'Biologia',
                  'História',
                  'Geografia',
                  'Redação',
                ].map(materia => (
                  <button
                    key={materia}
                    className="materia bg-slate-50 border border-slate-200 text-slate-600 text-[10px] px-4 py-2 rounded-full transition"
                    data-materia={materia}
                    type="button"
                    aria-pressed="false"
                  >
                    {materia}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. TEMPO */}
            <div className="mb-5">
              <h3 className="font-bold text-xs mb-2">
                4. Tempo disponível por dia:
              </h3>

              <div className="flex flex-wrap justify-between gap-2 text-[9px] text-slate-500 mb-2">
                <span>Mínimo: 1 hora</span>
                <span
                  className="text-emerald-500 font-bold"
                  id="tempoSelecionado"
                >
                  3 horas / dia selecionadas
                </span>
                <span>Máximo: 8 horas</span>
              </div>

              <input
                className="w-full accent-emerald-500 cursor-pointer"
                id="tempo"
                max="8"
                min="1"
                step="1"
                type="range"
                defaultValue="3"
              />
            </div>

            {/* 5. DIAS */}
            <div className="mb-5">
              <h3 className="font-bold text-xs mb-3">
                5. Dias da semana para estudar:
              </h3>

              <div className="grid grid-cols-7 gap-1">
                {[
                  ['Seg', true],
                  ['Ter', true],
                  ['Qua', true],
                  ['Qui', true],
                  ['Sex', true],
                  ['Sáb', false],
                  ['Dom', false],
                ].map(([dia, selecionado]) => (
                  <button
                    key={dia}
                    className={`dia ${
                      selecionado
                        ? 'bg-[#063b29] text-white font-bold'
                        : 'bg-slate-50 border border-slate-200 text-slate-600'
                    } text-[9px] py-3 rounded-md`}
                    data-dia={dia}
                    type="button"
                    aria-pressed={selecionado}
                  >
                    {dia}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. DATA */}
            <div className="mb-5">
              <h3 className="font-bold text-xs mb-3">
                6. Data estimada do exame:
              </h3>

              <input
                className="w-full border border-slate-200 rounded-md px-3 py-3 text-xs outline-none focus:ring-2 focus:ring-emerald-400"
                id="dataExame"
                type="date"
              />
            </div>

            <button
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#063b29] font-bold text-sm sm:text-xs py-3.5 sm:py-3 rounded-md transition whitespace-normal break-words"
              id="gerarPlano"
              type="button"
            >
              ✨ Gerar meu plano
            </button>
          </div>

          {/* ASSISTENTE */}
          <aside
            className="bg-[#063b29] rounded-xl text-white p-5 h-fit"
            id="assistente"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-[#174c3b]">
              <div className="w-8 h-8 bg-[#0d523b] rounded-md flex items-center justify-center">
                <span className="text-emerald-400">✨</span>
              </div>

              <div>
                <h3 className="font-bold text-xs">Análise da IA</h3>
                <p className="text-[8px] text-emerald-400">
                  EM TEMPO REAL
                </p>
              </div>
            </div>

            <div className="mt-5">
              <h4 className="font-bold text-[10px] mb-3">
                Prioridades Detectadas:
              </h4>

              <div className="bg-[#174c3b] rounded-md p-3 mb-2">
                <p
                  className="text-[10px] text-emerald-400 font-semibold"
                  id="prioridadeMateria"
                >
                  Selecione uma modalidade
                </p>
                <p className="text-[8px] text-gray-300 mt-1">
                  Matérias relacionadas à prova escolhida
                </p>
              </div>

              <div className="bg-[#174c3b] rounded-md p-3 mb-2">
                <p className="text-[10px] text-emerald-400 font-semibold">
                  Sugestão de Distribuição
                </p>
                <p
                  className="text-[8px] text-gray-300 mt-1"
                  id="distribuicao"
                >
                  3 blocos de teoria e 2 de prática semanais
                </p>
              </div>

              <div className="bg-[#174c3b] rounded-md p-3">
                <p className="text-[10px] text-emerald-400 font-semibold">
                  Nível de Dificuldade
                </p>
                <p
                  className="text-[8px] text-gray-300 mt-1"
                  id="nivelDificuldade"
                >
                  Intermediário - equilibrar teoria e exercícios
                </p>
              </div>

              <div className="bg-[#0b4a35] rounded-md p-3 mt-4">
                <div className="flex gap-2">
                  <span className="text-emerald-400">💡</span>
                  <p
                    className="text-[8px] text-gray-300 leading-relaxed"
                    id="dicaIA"
                  >
                    Dica da IA: mantenha um tempo para revisões e descanso.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />

      {/* MODAL */}
      <div
        className="hidden fixed inset-0 bg-black/50 items-start sm:items-center justify-center p-3 sm:p-5 z-50 overflow-y-auto"
        id="modalPlano"
      >
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-4 sm:p-6 my-auto max-h-[92vh] overflow-y-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold">
              Seu plano de estudos
            </h2>

            <button
              className="text-slate-400 hover:text-slate-800 text-xl"
              id="fecharModal"
              type="button"
              aria-label="Fechar modal"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Plano criado com base nas suas preferências.
          </p>

          <div className="mt-5 space-y-3" id="resultadoPlano"></div>

          <button
            className="w-full mt-5 bg-emerald-500 hover:bg-emerald-400 disabled:cursor-not-allowed text-[#063b29] font-bold py-3.5 sm:py-3 rounded-md text-sm sm:text-xs"
            id="confirmarPlano"
            type="button"
          >
            Salvar meu plano
          </button>

          <p
            id="mensagemPlanoSalvo"
            className="hidden mt-3 text-center text-sm text-emerald-600 font-semibold break-words"
            role="status"
          ></p>

          <a
            id="linkCronograma"
            href="/cronograma"
            className="hidden mt-3 w-full text-center border border-emerald-500 text-emerald-700 hover:bg-emerald-50 font-bold py-3 rounded-md text-xs"
          >
            Ver meu cronograma
          </a>
        </div>
      </div>
    </div>
  );
}

export default Planejamento;
