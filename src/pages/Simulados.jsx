
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import { obterResumoMateria } from '../service/simulados.js';

const CHAVE_PLANO = 'planoCaraguaFuturo';

function lerPlano() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_PLANO)) || null;
  } catch {
    return null;
  }
}

function Simulados() {
  const [plano, setPlano] = useState(lerPlano);

  function atualizarPlano() {
    setPlano(lerPlano());
  }

  useEffect(() => {
    window.addEventListener('planoAtualizado', atualizarPlano);
    window.addEventListener('focus', atualizarPlano);

    return () => {
      window.removeEventListener('planoAtualizado', atualizarPlano);
      window.removeEventListener('focus', atualizarPlano);
    };
  }, []);

  const materias = Array.isArray(plano?.materias) ? plano.materias : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-7 py-8">
        <div className="mb-8">
          <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider">
            Pratique seus conhecimentos
          </span>

          <h1 className="text-3xl font-extrabold text-slate-800 mt-2">
            Simulados
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Escolha uma matéria e teste o que você aprendeu. Seus resultados
            serão enviados automaticamente para a página de progresso.
          </p>
        </div>

        {materias.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <h2 className="font-bold text-lg text-slate-800">
              Você ainda não escolheu suas matérias
            </h2>

            <p className="text-sm text-slate-500 mt-2 mb-5">
              Primeiro, crie seu planejamento para encontrar simulados
              relacionados aos seus estudos.
            </p>

            <Link
              to="/planejamento"
              className="inline-block bg-emerald-500 hover:bg-emerald-400 text-[#063b29] font-bold text-sm px-6 py-3 rounded-lg"
            >
              Criar planejamento
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">
                Suas matérias
              </h2>

              <span className="text-xs text-slate-500">
                {materias.length} matéria(s)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {materias.map((materia) => {
                const resultado = obterResumoMateria(materia);

                return (
                  <div
                    key={materia}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
                  >
                    <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl mb-4">
                      <span>📚</span>
                    </div>

                    <h3 className="font-bold text-lg text-slate-800">
                      {materia}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Teste seus conhecimentos nesta matéria.
                    </p>

                    <div className="mt-5 mb-4">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-500">
                          Seu aproveitamento
                        </span>
                        <strong className="text-emerald-700">
                          {resultado.porcentagem}%
                        </strong>
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${resultado.porcentagem}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 mb-5">
                      {resultado.simulados} simulado(s) realizado(s)
                      <br />
                      {resultado.acertos} acerto(s) de {resultado.total} questões
                    </div>

                    <Link
                      to={`/simulados/${encodeURIComponent(materia)}`}
                      className="block text-center bg-[#063b29] hover:bg-emerald-800 text-white font-bold text-sm py-3 rounded-lg transition"
                    >
                      Iniciar simulado
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Simulados;
