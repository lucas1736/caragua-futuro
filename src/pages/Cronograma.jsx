
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Cronograma() {
  const [planoSalvo, setPlanoSalvo] = useState(null);

  const diasSemana = [
    { nome: 'Segunda', abreviacao: 'Seg' },
    { nome: 'Terça', abreviacao: 'Ter' },
    { nome: 'Quarta', abreviacao: 'Qua' },
    { nome: 'Quinta', abreviacao: 'Qui' },
    { nome: 'Sexta', abreviacao: 'Sex' },
    { nome: 'Sábado', abreviacao: 'Sáb' },
    { nome: 'Domingo', abreviacao: 'Dom' },
  ];

  const materias = Array.isArray(planoSalvo?.materias)
    ? planoSalvo.materias
    : [];

  const diasAtivos = diasSemana.filter((dia) =>
    planoSalvo?.dias?.includes(dia.abreviacao)
  );

  useEffect(() => {
    function carregarPlano() {
      try {
        const dados = JSON.parse(
          localStorage.getItem('planoCaraguaFuturo') || 'null'
        );
        setPlanoSalvo(dados);
      } catch {
        setPlanoSalvo(null);
      }
    }

    carregarPlano();

    window.addEventListener('focus', carregarPlano);
    window.addEventListener('planoAtualizado', carregarPlano);

    return () => {
      window.removeEventListener('focus', carregarPlano);
      window.removeEventListener('planoAtualizado', carregarPlano);
    };
  }, []);

  function materiasDoDia(abreviacao) {
    const indiceDia = diasAtivos.findIndex(
      (dia) => dia.abreviacao === abreviacao
    );

    if (indiceDia === -1 || diasAtivos.length === 0) return [];

    return materias.filter(
      (_, indiceMateria) =>
        indiceMateria % diasAtivos.length === indiceDia
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-8">

        <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
          <div>
            <p className="text-sm font-bold text-emerald-700 uppercase tracking-wide">
              Organização dos estudos
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-2">
              Seu Cronograma Semanal
            </h2>
            <p className="text-base text-slate-500 mt-2">
              Organize seus estudos com base no plano que você salvou.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/planejamento"
              className="bg-white border border-slate-200 px-5 py-3 rounded-lg text-sm font-semibold hover:bg-slate-100 transition"
            >
              ✏️ Ajustar plano
            </Link>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl px-5 py-4 mb-6 shadow-sm">
          <p className="font-bold text-sm text-slate-700 mb-3">
            Legenda de matérias
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-600">
            <span>🟠 Matemática</span>
            <span>🟢 Ciências da Natureza</span>
            <span>🔵 Linguagens</span>
            <span>🟣 Ciências Humanas</span>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6">

          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <div className="min-w-[760px]">

                <div className="grid grid-cols-[90px_repeat(7,minmax(0,1fr))] bg-[#063b29] text-white">
                  <div className="p-4 text-sm font-semibold">Horário</div>
                  {diasSemana.map((dia) => (
                    <div
                      key={dia.abreviacao}
                      className="text-center py-4 px-2 text-sm font-bold"
                    >
                      {dia.nome}
                    </div>
                  ))}
                </div>

                {!planoSalvo ? (
                  <div className="p-10 text-center">
                    <p className="text-lg font-bold text-slate-700">
                      Você ainda não salvou um plano.
                    </p>
                    <p className="text-base text-slate-500 mt-2">
                      Acesse Planejamento para criar o seu cronograma.
                    </p>
                    <Link
                      to="/planejamento"
                      className="inline-block mt-5 bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-800"
                    >
                      Criar meu plano
                    </Link>
                  </div>
                ) : materias.length === 0 || diasAtivos.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="text-base text-slate-600">
                      Seu plano precisa ter pelo menos uma matéria e um dia de estudo.
                    </p>
                    <Link
                      to="/planejamento"
                      className="inline-block mt-4 text-emerald-700 font-bold hover:underline"
                    >
                      Editar planejamento
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-[90px_repeat(7,minmax(0,1fr))]">
                    <div className="border-r border-slate-200 bg-slate-50 p-3 text-center">
                      <span className="text-sm font-bold text-slate-500">
                        Horas/dia
                      </span>
                      <p className="mt-4 text-lg font-bold text-emerald-700">
                        {planoSalvo.horas}h
                      </p>
                    </div>

                    {diasSemana.map((dia) => {
                      const diaAtivo = diasAtivos.some(
                        (ativo) => ativo.abreviacao === dia.abreviacao
                      );

                      const listaMaterias = materiasDoDia(dia.abreviacao);

                      return (
                        <div
                          key={dia.abreviacao}
                          className="min-h-64 border-r border-b border-slate-200 p-2"
                        >
                          {!diaAtivo ? (
                            <p className="text-sm text-slate-600 text-center mt-8">
                              Dia livre
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {listaMaterias.map((materia) => (
                                <div
                                  key={materia}
                                  className="rounded-lg border border-emerald-200 bg-emerald-50 p-3"
                                >
                                  <p className="text-sm font-bold text-emerald-900 break-words">
                                    {materia}
                                  </p>
                                  <p className="mt-2 text-xs text-emerald-700">
                                    Estudo planejado
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-5">

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-lg text-slate-800 mb-4">
                Resumo do plano
              </h3>

              {planoSalvo ? (
                <div className="space-y-4 text-sm text-slate-600">
                  <p>
                    <strong className="text-slate-800">Objetivo:</strong>{' '}
                    {planoSalvo.objetivo || 'Não informado'}
                  </p>
                  <p>
                    <strong className="text-slate-800">Horas por dia:</strong>{' '}
                    {planoSalvo.horas ?? 0}h
                  </p>
                  <p>
                    <strong className="text-slate-800">Matérias:</strong>{' '}
                    {materias.length}
                  </p>
                  <p>
                    <strong className="text-slate-800">Dias selecionados:</strong>{' '}
                    {diasAtivos.length}
                  </p>
                  {planoSalvo.data && (
                    <p>
                      <strong className="text-slate-800">Data da prova:</strong>{' '}
                      {planoSalvo.data.split('-').reverse().join('/')}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Seu resumo aparecerá depois que você salvar o planejamento.
                </p>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-lg text-slate-800 mb-4">
                Matérias selecionadas
              </h3>

              {materias.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {materias.map((materia) => (
                    <span
                      key={materia}
                      className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg px-3 py-2 text-sm"
                    >
                      {materia}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Nenhuma matéria salva ainda.
                </p>
              )}
            </div>

          </aside>
        </div>
      </main>

      <footer className="bg-[#063b29] text-white mt-12">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="font-bold text-lg">Caraguá Futuro</h3>
            <p className="text-sm text-gray-300 mt-2 max-w-md leading-relaxed">
              Ajudando estudantes de Caraguatatuba e região a transformar rotinas em conquistas acadêmicas.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 text-sm">
            <div>
              <strong>Plataforma</strong>
              <p className="text-gray-300 mt-3">Início</p>
              <p className="text-gray-300 mt-2">Planejamento</p>
              <p className="text-gray-300 mt-2">Progresso</p>
            </div>

            <div>
              <strong>Contato</strong>
              <p className="text-gray-300 mt-3">Suporte</p>
              <p className="text-gray-300 mt-2">Termos de Uso</p>
              <p className="text-gray-300 mt-2">Privacidade</p>
            </div>
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-4 border-t border-white/10 text-xs text-gray-400">
          © 2026 Caraguá Futuro. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

export default Cronograma;
