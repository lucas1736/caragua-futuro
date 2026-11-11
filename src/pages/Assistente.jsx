import Footer from '../components/Footer.jsx';

const sugestoes = [
  'Como organizar minha semana de estudos?',
  'Dicas para a redação do ENEM',
  'Como funciona a revisão espaçada?',
  'Quais matérias priorizar para a FATEC?',
];

// Página somente visual: não há IA real conectada.
function Assistente() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-7 py-8">
        <section className="mb-6">
          <h2 className="text-2xl font-extrabold">Assistente IA</h2>
          <p className="text-xs text-slate-500 mt-1">
            Tire dúvidas e receba orientações sobre seus estudos.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-sm">
                🤖
              </div>
              <div>
                <p className="font-bold text-sm leading-none">Assistente Caraguá Futuro</p>
                <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Online
                </p>
              </div>
            </div>

            <div className="flex-1 px-5 py-6 space-y-5 min-h-[380px]">
              <div className="flex items-start gap-3 max-w-[85%]">
                <div className="w-7 h-7 shrink-0 bg-emerald-100 rounded-full flex items-center justify-center text-xs">
                  🤖
                </div>
                <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-slate-700 leading-relaxed">
                  Olá! Sou o assistente do Caraguá Futuro. Posso ajudar você a organizar
                  a rotina, escolher matérias e tirar dúvidas. Por onde quer começar?
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-emerald-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-xs leading-relaxed max-w-[85%]">
                  Trabalho o dia todo e só tenho 2 horas por noite. Como estudo para o ENEM?
                </div>
              </div>

              <div className="flex items-start gap-3 max-w-[85%]">
                <div className="w-7 h-7 shrink-0 bg-emerald-100 rounded-full flex items-center justify-center text-xs">
                  🤖
                </div>
                <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-slate-700 leading-relaxed">
                  Com 2 horas por noite, o ideal é dividir em blocos curtos:
                  <ul className="list-disc ml-4 mt-2 space-y-1">
                    <li>1h de teoria na matéria do dia</li>
                    <li>40 min de exercícios</li>
                    <li>20 min de revisão do que viu na semana</li>
                  </ul>
                  <p className="mt-2">Use o Planejamento para montar essa grade automaticamente.</p>
                </div>
              </div>
            </div>

            <form
              className="flex items-center gap-3 px-5 py-4 border-t border-slate-100"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="text"
                placeholder="Digite sua pergunta..."
                className="flex-1 border border-slate-200 rounded-lg px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-[#063b29] font-bold text-xs px-5 py-3 rounded-lg transition"
              >
                Enviar
              </button>
            </form>
          </div>

          <aside className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-xs mb-3">Sugestões de perguntas</h3>
              <div className="flex flex-col gap-2">
                {sugestoes.map((texto) => (
                  <button
                    key={texto}
                    type="button"
                    className="text-left text-[10px] text-slate-600 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-lg px-3 py-2 transition"
                  >
                    {texto}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#063b29] text-white rounded-xl p-5">
              <h3 className="font-bold text-xs">Ainda sem plano?</h3>
              <p className="text-[10px] text-gray-300 mt-2 leading-relaxed">
                Monte seu cronograma de estudos em poucos minutos.
              </p>
              <a
                href="/planejamento"
                className="inline-block mt-4 bg-emerald-500 hover:bg-emerald-400 text-[#063b29] font-bold text-[10px] px-4 py-2 rounded-md transition"
              >
                Montar meu plano
              </a>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Assistente;
