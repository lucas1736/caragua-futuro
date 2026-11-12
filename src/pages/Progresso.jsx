
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import { getUsuario } from '../service/auth.js';
import { listarMetas } from '../service/metas.js';
import { obterResultados, limparResultados } from '../service/simulados.js';

const CHAVE_PROGRESSO = 'progressoCaraguaFuturo';
const CHAVE_PLANO = 'planoCaraguaFuturo';

const modalidadesVestibulares = [
  {
    id: 'integrado',
    nome: 'IFSP Integrado ao Ensino Médio',
  },
  {
    id: 'concomitante',
    nome: 'IFSP Concomitante e Subsequente',
  },
  {
    id: 'etec',
    nome: 'Vestibulinho ETEC',
  },
];

function paraISO(data) {
  const a = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${a}-${m}-${d}`;
}

function deISO(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d);
}

function inicioDaSemana(data) {
  const d = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  const diaSemana = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - diaSemana);
  return d;
}

function formatarHoras(valor) {
  return Number.isInteger(valor)
    ? `${valor}`
    : valor.toFixed(1).replace('.', ',');
}

function lerJSON(chave, padrao) {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch {
    return padrao;
  }
}

function lerProgresso() {
  const dados = lerJSON(CHAVE_PROGRESSO, {});

  return {
    materias: dados?.materias || {},
    registros: dados?.registros || {},
  };
}

function Progresso() {
  const [progresso, setProgresso] = useState(lerProgresso);
  const [resultados, setResultados] = useState(obterResultados);
  const [plano, setPlano] = useState(() =>
    lerJSON(CHAVE_PLANO, null)
  );
  const [usuario, setUsuario] = useState(() => getUsuario());
  const [metas, setMetas] = useState(null);
  const [erroMetas, setErroMetas] = useState('');

  const hoje = paraISO(new Date());
  const [dataRegistro, setDataRegistro] = useState(hoje);
  const [horasRegistro, setHorasRegistro] = useState('1');
  const [erroForm, setErroForm] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(
        CHAVE_PROGRESSO,
        JSON.stringify(progresso)
      );
    } catch {
      // Ignora problemas de armazenamento.
    }
  }, [progresso]);

  useEffect(() => {
    function atualizar() {
      setPlano(lerJSON(CHAVE_PLANO, null));
      setUsuario(getUsuario());
      setResultados(obterResultados());
    }

    window.addEventListener('planoAtualizado', atualizar);
    window.addEventListener('caragua-auth-mudou', atualizar);
    window.addEventListener('simuladosAtualizados', atualizar);
    window.addEventListener('focus', atualizar);

    return () => {
      window.removeEventListener('planoAtualizado', atualizar);
      window.removeEventListener('caragua-auth-mudou', atualizar);
      window.removeEventListener('simuladosAtualizados', atualizar);
      window.removeEventListener('focus', atualizar);
    };
  }, []);

  useEffect(() => {
    let ativo = true;

    if (!usuario) {
      setMetas(null);
      setErroMetas('');
      return undefined;
    }

    listarMetas()
      .then((lista) => {
        if (ativo) {
          setMetas(Array.isArray(lista) ? lista : []);
          setErroMetas('');
        }
      })
      .catch((e) => {
        if (ativo) {
          setMetas(null);
          setErroMetas(e.message);
        }
      });

    return () => {
      ativo = false;
    };
  }, [usuario]);

  function valorModalidade(id) {
    const dados = resultados.modalidades?.[id];

    if (!dados || !dados.total) return 0;

    return Math.round(
      (dados.acertos / dados.total) * 100
    );
  }

  const modalidadesComResultado = modalidadesVestibulares.filter(
    (modalidade) =>
      (resultados.modalidades?.[modalidade.id]?.total || 0) > 0
  );

  const conclusao = modalidadesComResultado.length > 0
    ? Math.round(
        modalidadesComResultado.reduce(
          (soma, modalidade) =>
            soma + valorModalidade(modalidade.id),
          0
        ) / modalidadesComResultado.length
      )
    : 0;

  const inicioSemanaAtual = inicioDaSemana(new Date());

  const semanas = useMemo(() => {
    const totais = Array(8).fill(0);

    Object.entries(progresso.registros).forEach(([iso, horas]) => {
      const h = Number(horas);

      if (!Number.isFinite(h) || h <= 0) return;

      const diff = Math.round(
        (inicioSemanaAtual - inicioDaSemana(deISO(iso))) /
          (7 * 24 * 3600 * 1000)
      );

      if (diff >= 0 && diff < 8) {
        totais[7 - diff] += h;
      }
    });

    return totais;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progresso.registros, hoje]);

  const horasSemana = semanas[7];

  const metaHoras =
    plano?.horas && Array.isArray(plano?.dias)
      ? Number(plano.horas) * plano.dias.length
      : 0;

  const sequencia = useMemo(() => {
    let dias = 0;
    const cursor = new Date();

    if (!(Number(progresso.registros[paraISO(cursor)]) > 0)) {
      cursor.setDate(cursor.getDate() - 1);
    }

    while (
      Number(progresso.registros[paraISO(cursor)]) > 0
    ) {
      dias += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return dias;
  }, [progresso.registros, hoje]);

  const metasFeitas = metas
    ? metas.filter((m) => m.concluida).length
    : 0;

  const metasTotal = metas ? metas.length : 0;

  const pctMetas = metasTotal > 0
    ? Math.round((metasFeitas / metasTotal) * 100)
    : 0;

  const maiorSemana = Math.max(...semanas, 1);

  function registrarHoras(evento) {
    evento.preventDefault();
    setErroForm('');

    const horas = Number(
      String(horasRegistro).replace(',', '.')
    );

    if (!dataRegistro || dataRegistro > hoje) {
      setErroForm('Escolha uma data de hoje ou anterior.');
      return;
    }

    if (
      !Number.isFinite(horas) ||
      horas <= 0 ||
      horas > 24
    ) {
      setErroForm('Informe um valor de horas entre 0,5 e 24.');
      return;
    }

    setProgresso((atual) => ({
      ...atual,
      registros: {
        ...atual.registros,
        [dataRegistro]:
          (Number(atual.registros[dataRegistro]) || 0) + horas,
      },
    }));

    setHorasRegistro('1');
  }

  function limparRegistros() {
    if (
      window.confirm(
        'Apagar o histórico de horas e todos os resultados dos simulados?'
      )
    ) {
      setProgresso({
        materias: {},
        registros: {},
      });

      limparResultados();

      setResultados({
        materias: {},
        modalidades: {},
        historico: [],
      });
    }
  }

  const circ = 2 * Math.PI * 16;

  const inputClasse =
    'w-full border border-slate-200 rounded-md px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-400';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-7 py-8">

        <section className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold">
              Seu Progresso
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Acompanhe seus resultados nos simulados, horas dedicadas e metas.
            </p>
          </div>

          <button
            type="button"
            onClick={limparRegistros}
            className="text-[11px] text-slate-500 hover:text-red-600 border border-slate-200 bg-white px-3 py-2 rounded-md"
          >
            Zerar progresso
          </button>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-slate-600">
                  Conclusão Geral
                </p>

                <h3 className="text-2xl font-extrabold mt-2">
                  {conclusao}%
                </h3>

                <p className="text-[8px] text-slate-500">
                  Média dos resultados dos simulados realizados
                </p>
              </div>

              <svg
                className="w-10 h-10 -rotate-90"
                viewBox="0 0 40 40"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="4"
                />

                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={
                    circ * (1 - conclusao / 100)
                  }
                />
              </svg>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] text-slate-600">
              Horas Estudadas (semana)
            </p>

            <h3 className="text-2xl font-extrabold mt-2">
              {formatarHoras(horasSemana)}h
            </h3>

            <p className="text-[8px] text-slate-500">
              {metaHoras > 0
                ? `Meta: ${metaHoras} horas semanais`
                : 'Crie um plano para definir sua meta'}
            </p>

            {metaHoras > 0 && (
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3">
                <div
                  className="h-1.5 bg-emerald-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (horasSemana / metaHoras) * 100
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] text-slate-600">
              Metas Cumpridas
            </p>

            {usuario ? (
              <>
                <h3 className="text-2xl font-extrabold mt-2">
                  {metas
                    ? `${metasFeitas} / ${metasTotal}`
                    : '—'}
                </h3>

                <p className="text-[8px] text-slate-500">
                  {erroMetas ||
                    (metas
                      ? 'Suas metas de estudo'
                      : 'Carregando...')}
                </p>

                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3">
                  <div
                    className="h-1.5 bg-emerald-500 rounded-full"
                    style={{ width: `${pctMetas}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-extrabold mt-2">
                  —
                </h3>

                <p className="text-[9px] text-slate-500 mt-1">
                  <Link
                    to="/login"
                    className="text-emerald-600 font-semibold"
                  >
                    Entre
                  </Link>{' '}
                  para ver suas metas.
                </p>
              </>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-[10px] text-slate-600">
                  Sequência de Estudos
                </p>

                <h3 className="text-2xl font-extrabold mt-2">
                  {sequencia} {sequencia === 1 ? 'Dia' : 'Dias'}
                </h3>

                <p className="text-[8px] text-slate-500">
                  {sequencia > 0
                    ? 'Continue assim!'
                    : 'Registre horas hoje para começar'}
                </p>
              </div>

              <span className="text-red-500 text-sm">
                🔥
              </span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 mb-5">

          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm min-w-0">
            <h3 className="font-bold text-sm mb-5">
              Evolução Semanal de Estudos
            </h3>

            <div className="h-40 flex items-end justify-between gap-1 sm:gap-3">
              {semanas.map((horas, i) => (
                <div
                  key={i}
                  className="flex-1 h-full flex flex-col justify-end items-center gap-2 min-w-0"
                >
                  <span className="text-[8px] text-slate-500">
                    {horas > 0
                      ? formatarHoras(
                          Math.round(horas * 10) / 10
                        )
                      : ''}
                  </span>

                  <div
                    className="w-full max-w-[28px] bg-emerald-500 rounded-t transition-all duration-500"
                    style={{
                      height: `${
                        horas > 0
                          ? Math.max(
                              4,
                              (horas / maiorSemana) * 80
                            )
                          : 2
                      }%`,
                    }}
                    title={`${formatarHoras(
                      Math.round(horas * 10) / 10
                    )} horas estudadas`}
                  />

                  <span className="text-[7px] sm:text-[8px] text-slate-500 whitespace-nowrap">
                    {i === 7 ? 'Atual' : `S-${7 - i}`}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[9px] text-slate-400 mt-3">
              Horas por semana nas últimas 8 semanas (S-1 = semana passada).
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <h3 className="font-bold text-sm mb-1">
              Progresso por Vestibular
            </h3>

            <p className="text-[9px] text-slate-400 mb-4">
              Desempenho calculado automaticamente pelos simulados realizados.
            </p>

            {modalidadesVestibulares.map((modalidade) => {
              const valor = valorModalidade(modalidade.id);
              const dados =
                resultados.modalidades?.[modalidade.id];

              return (
                <div
                  key={modalidade.id}
                  className="mb-5 last:mb-0"
                >
                  <div className="flex justify-between text-[10px] font-semibold mb-2 gap-2">
                    <span>{modalidade.nome}</span>
                    <span>{valor}%</span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${valor}%` }}
                    />
                  </div>

                  <p className="text-[9px] text-slate-400 mt-1">
                    {dados
                      ? `${dados.acertos} acertos de ${dados.total} questões · ${dados.simulados} simulado(s)`
                      : 'Nenhum simulado realizado ainda'}
                  </p>
                </div>
              );
            })}

            <Link
              to="/simulados"
              className="block text-center mt-5 bg-[#063b29] hover:bg-emerald-800 text-white font-bold text-xs py-3 rounded-lg transition"
            >
              Fazer simulados
            </Link>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4">
            Registrar horas estudadas
          </h3>

          <form
            onSubmit={registrarHoras}
            className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end"
          >
            <div>
              <label
                htmlFor="dataRegistro"
                className="block text-[10px] font-semibold mb-1"
              >
                Dia
              </label>

              <input
                id="dataRegistro"
                type="date"
                max={hoje}
                value={dataRegistro}
                onChange={(e) => setDataRegistro(e.target.value)}
                className={inputClasse}
              />
            </div>

            <div>
              <label
                htmlFor="horasRegistro"
                className="block text-[10px] font-semibold mb-1"
              >
                Horas
              </label>

              <input
                id="horasRegistro"
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                value={horasRegistro}
                onChange={(e) => setHorasRegistro(e.target.value)}
                className={inputClasse}
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-[#063b29] font-bold text-xs px-6 py-3 rounded-md transition"
            >
              Registrar
            </button>
          </form>

          {erroForm && (
            <p className="text-xs text-red-600 mt-3">
              {erroForm}
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Progresso;
