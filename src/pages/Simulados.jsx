
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import { obterResumoModalidade } from '../service/simulados.js';

const MODALIDADES = [
  {
    id: 'integrado',
    titulo: 'IFSP Integrado ao Ensino Médio',
    descricao: 'Para quem deseja cursar o Ensino Médio junto com o curso técnico.',
    icone: '🎓',
    questoes: 30,
    areas: 'Português e Matemática',
    instituicao: 'IFSP',
  },
  {
    id: 'concomitante',
    titulo: 'IFSP Concomitante e Subsequente',
    descricao: 'Para quem cursa o Ensino Médio em outra escola ou já concluiu essa etapa.',
    icone: '📚',
    questoes: 30,
    areas: 'Português e Matemática',
    instituicao: 'IFSP',
  },
  {
    id: 'etec',
    titulo: 'ETEC — Vestibulinho',
    descricao: 'Prepare-se para o processo seletivo das Escolas Técnicas Estaduais.',
    icone: '🏫',
    questoes: 50,
    areas: 'Português, Matemática, Ciências Humanas e Ciências da Natureza',
    instituicao: 'ETEC',
  },
];

function Simulados() {
  const [resultados, setResultados] = useState({});

  function atualizarResultados() {
    setResultados({
      integrado: obterResumoModalidade('integrado'),
      concomitante: obterResumoModalidade('concomitante'),
      etec: obterResumoModalidade('etec'),
    });
  }

  useEffect(() => {
    atualizarResultados();

    window.addEventListener('simuladosAtualizados', atualizarResultados);
    window.addEventListener('focus', atualizarResultados);

    return () => {
      window.removeEventListener('simuladosAtualizados', atualizarResultados);
      window.removeEventListener('focus', atualizarResultados);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-7 py-8">

        <div className="mb-8">
          <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider">
            Prepare-se para sua aprovação
          </span>

          <h1 className="text-3xl font-extrabold text-slate-800 mt-2">
            Simulados
          </h1>

          <p className="text-sm text-slate-500 mt-2 max-w-2xl">
            Escolha o processo seletivo que deseja realizar e pratique com
            questões de treinamento. Seus resultados serão enviados
            automaticamente para a página de progresso.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-7">
          <h2 className="font-bold text-emerald-900">
            Conheça os simulados
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-2xl font-extrabold text-emerald-800">30</p>
              <p className="text-xs text-emerald-800">Questões no IFSP</p>
            </div>

            <div>
              <p className="text-2xl font-extrabold text-emerald-800">50</p>
              <p className="text-xs text-emerald-800">Questões na ETEC</p>
            </div>

            <div>
              <p className="text-2xl font-extrabold text-emerald-800">5</p>
              <p className="text-xs text-emerald-800">Alternativas por questão</p>
            </div>
          </div>
        </div>

        <h2 className="font-bold text-slate-800 mb-4">
          Escolha seu simulado
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODALIDADES.map((modalidade) => {
            const resultado = resultados[modalidade.id] || {
              porcentagem: 0,
              simulados: 0,
              acertos: 0,
              total: 0,
            };

            return (
              <article
                key={modalidade.id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl mb-4">
                  {modalidade.icone}
                </div>

                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  {modalidade.instituicao}
                </span>

                <h3 className="text-xl font-bold text-slate-800 mt-1">
                  {modalidade.titulo}
                </h3>

                <p className="text-sm text-slate-500 mt-2 min-h-10">
                  {modalidade.descricao}
                </p>

                <div className="bg-slate-50 rounded-lg p-3 mt-4">
                  <p className="text-sm font-semibold text-slate-700">
                    {modalidade.questoes} questões
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {modalidade.areas}
                  </p>
                </div>

                <div className="mt-5 mb-3">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-500">
                      Aproveitamento acumulado
                    </span>

                    <strong className="text-emerald-700">
                      {resultado.porcentagem}%
                    </strong>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${resultado.porcentagem}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-5">
                  {resultado.simulados} simulado(s) realizado(s)
                  <br />
                  {resultado.acertos} acertos de {resultado.total} questões
                </p>

                <Link
                  to={`/simulados/${modalidade.id}`}
                  className="block text-center bg-[#063b29] hover:bg-emerald-800 text-white font-bold text-sm py-3 rounded-lg transition mt-auto"
                >
                  Iniciar simulado
                </Link>
              </article>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 mt-6">
          Os simulados são compostos por questões de treinamento elaboradas
          no estilo dos processos seletivos. Não são cadernos oficiais nem
          substituem a consulta aos editais vigentes.
        </p>
      </main>

      <Footer />
    </div>
  );
}

export default Simulados;
