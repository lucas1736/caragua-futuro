import { useState, useEffect } from 'react';

function Cronograma() {
  const [planoSalvo, setPlanoSalvo] = useState(null);

  const diasSemana = [
    { nome: 'Segunda', abreviacao: 'Seg' },
    { nome: 'Terça', abreviacao: 'Ter' },
    { nome: 'Quarta', abreviacao: 'Qua' },
    { nome: 'Quinta', abreviacao: 'Qui' },
    { nome: 'Sexta', abreviacao: 'Sex' },
    { nome: 'Sábado', abreviacao: 'Sáb' },
    { nome: 'Domingo', abreviacao: 'Dom' }
  ];

  const materias = Array.isArray(planoSalvo?.materias)
    ? planoSalvo.materias
    : [];

  const diasAtivos = diasSemana.filter((dia) =>
    planoSalvo?.dias?.includes(dia.abreviacao)
  );

  function materiasDoDia(abreviacao) {
    const indiceDia = diasAtivos.findIndex(
      (dia) => dia.abreviacao === abreviacao
    );

    if (indiceDia === -1 || diasAtivos.length === 0) {
      return [];
    }

    return materias.filter(
      (_, indiceMateria) =>
        indiceMateria % diasAtivos.length === indiceDia
    );
  }

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

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-7">
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-2xl font-extrabold">Seu Cronograma Semanal</h2>
            <p className="text-xs text-slate-500 mt-1">
              Organize seus estudos com base no plano que você salvou.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="bg-white border border-slate-200 px-3 py-2 rounded-md text-[10px] font-semibold hover:bg-slate-100 transition"
              id="btnAjustar"
            >
              ✏️ Ajustar plano
            </button>
            <button
              className="bg-white border border-slate-200 px-3 py-2 rounded-md text-[10px] font-semibold hover:bg-slate-100 transition"
              id="btnExportar"
            >
              ⇩ Exportar PDF
            </button>
            <button
              className="bg-emerald-500 hover:bg-emerald-400 text-[#063b29] px-3 py-2 rounded-md text-[10px] font-bold transition"
              id="btnCompartilhar"
            >
              ↗ Compartilhar
            </button>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-lg px-4 py-3 mb-5">
          <div className="flex flex-wrap items-center gap-4 text-[9px] text-slate-500">
            <strong className="text-slate-600">Legenda de Matérias:</strong>
            <span>🟠 Matemática</span>
            <span>🟢 Ciências da Natureza</span>
            <span>🔵 Linguagens</span>
            <span>🟣 Ciências Humanas</span>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
          <section className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
            <div className="min-w-[680px]">
            <div className="grid grid-cols-[55px_repeat(7,minmax(0,1fr))] bg-[#063b29] text-white">
              <div />
              {diasSemana.map((dia) => (
                <div
                  key={dia.abreviacao}
                  className="text-center py-3 text-[9px]"
                >
                  {dia.nome}
                </div>
              ))}
            </div>

            {!planoSalvo ? (
              <div className="p-8 text-center text-sm text-slate-500">
                Você ainda não salvou um plano. Acesse Planejamento para criar o seu.
                <a
                  href="/planejamento"
                  className="block mt-3 text-emerald-700 font-bold hover:underline"
                >
                  Criar meu plano
                </a>
              </div>
            ) : materias.length === 0 || diasAtivos.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                Seu plano precisa ter pelo menos uma matéria e um dia de estudo.
                <a
                  href="/planejamento"
                  className="block mt-3 text-emerald-700 font-bold hover:underline"
                >
                  Editar planejamento
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-[55px_repeat(7,minmax(0,1fr))]">
                <div className="border-r border-slate-200 bg-slate-50 p-2 text-center">
                  <span className="text-[9px] font-bold text-slate-500">
                    Horas/dia
                  </span>
                  <p className="mt-4 text-[10px] font-semibold text-emerald-700">
                    {planoSalvo.horas}h
                  </p>
                </div>

                {diasSemana.map((dia) => {
                  const diaAtivo = diasAtivos.some(
                    (ativo) => ativo.abreviacao === dia.abreviacao
                  );

                  const materiasDoDiaAtual = materiasDoDia(dia.abreviacao);

                  return (
                    <div
                      key={dia.abreviacao}
                      className="min-h-48 border-r border-b border-slate-200 p-1.5"
                    >
                      {!diaAtivo ? (
                        <p className="text-[9px] text-slate-400 text-center mt-4">
                          Dia livre
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {materiasDoDiaAtual.map((materia) => (
                            <div
                              key={materia}
                              className="rounded-md border border-emerald-200 bg-emerald-50 p-2"
                            >
                              <p className="text-[9px] font-bold text-emerald-900 break-words">
                                {materia}
                              </p>
                              <p className="mt-1 text-[8px] text-emerald-700">
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
          </section>

          <aside className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-xs mb-3">Resumo do plano</h3>

              {planoSalvo ? (
                <div className="space-y-3 text-[10px] text-slate-600">
                  <p>
                    <strong>Objetivo:</strong> {planoSalvo.objetivo || 'Não informado'}
                  </p>
                  <p>
                    <strong>Horas por dia:</strong> {planoSalvo.horas ?? 0}h
                  </p>
                  <p>
                    <strong>Matérias:</strong> {materias.length}
                  </p>
                  <p>
                    <strong>Dias selecionados:</strong> {diasAtivos.length}
                  </p>
                  {planoSalvo.data && (
                    <p>
                      <strong>Data da prova:</strong>{' '}
                      {planoSalvo.data.split('-').reverse().join('/')}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[10px] text-slate-500">
                  Seu resumo aparecerá depois que você salvar o planejamento.
                </p>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-xs mb-3">Matérias selecionadas</h3>
              {materias.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {materias.map((materia) => (
                    <span
                      key={materia}
                      className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md px-2 py-1 text-[9px]"
                    >
                      {materia}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-500">
                  Nenhuma matéria salva ainda.
                </p>
              )}
            </div>

            <div className="bg-[#063b29] text-white rounded-xl p-5">
              <div className="text-emerald-400 text-xl mb-2">♧</div>
              <h3 className="font-bold text-xs mb-2">Dica Pomodoro</h3>
              <p className="text-[9px] text-gray-300 leading-relaxed">
                Estude por 25 minutos e faça uma pausa de 5 minutos para manter o foco.
              </p>
              <button
                className="mt-4 bg-emerald-500 text-[#063b29] px-3 py-2 rounded-md text-[9px] font-bold hover:bg-emerald-400"
                id="btnPomodoro"
                onClick={() => alert('Inicie um cronômetro de 25 minutos para sua sessão de estudo!')}
              >
                Iniciar Pomodoro
              </button>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-[#063b29] text-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="font-bold">Caraguá Futuro</h3>
            <p className="text-[9px] text-gray-400 mt-2 max-w-xs">
              Ajudando estudantes de Caraguatatuba e região a transformar rotinas em conquistas acadêmicas.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-2 text-[9px]">
            <div>
              <strong>Plataforma</strong>
              <p className="text-gray-400 mt-2">Início</p>
              <p className="text-gray-400 mt-2">Planejamento</p>
              <p className="text-gray-400 mt-2">Progresso</p>
            </div>
            <div>
              <strong>Contato</strong>
              <p className="text-gray-400 mt-2">Suporte</p>
              <p className="text-gray-400 mt-2">Termos de Uso</p>
              <p className="text-gray-400 mt-2">Privacidade</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 border-t border-white/10 text-[8px] text-gray-500">
          © 2026 Caraguá Futuro. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

export default Cronograma;