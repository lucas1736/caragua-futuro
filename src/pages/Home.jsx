
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen">

      {/* Banner principal */}
      <section className="bg-[#063b29] text-white">
        <div className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-20">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#174c3b] px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                <span className="text-sm text-gray-200">
                  Plataforma de estudos para o litoral norte
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-2xl">
                Seu futuro começa com um plano possível.
              </h2>

              <p className="text-base lg:text-lg text-gray-300 leading-relaxed max-w-xl mt-6">
                Organize seus estudos de forma simples e realista.
                A nossa Inteligência Artificial cria o cronograma ideal
                baseado na sua rotina e objetivos de Caraguatatuba.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  to="/planejamento"
                  className="bg-emerald-500 hover:bg-emerald-400 text-[#063b29] font-bold text-sm px-6 py-4 rounded-lg transition"
                >
                  Montar meu plano
                </Link>

                <Link
                  to="/cronograma"
                  className="bg-[#174c3b] hover:bg-[#205a47] text-white font-semibold text-sm px-6 py-4 rounded-lg transition"
                >
                  Ver demonstração ◉
                </Link>
              </div>
            </div>

            <div className="w-full">
              <img
                alt="Plataforma de estudos"
                className="w-full h-64 sm:h-80 lg:h-[420px] object-cover rounded-2xl shadow-xl"
                src="/assets/foto principal.png"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-wide">
              Funcionalidades
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold mt-3 text-slate-900">
              Tudo o que você precisa para ser aprovado
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-5 text-2xl text-emerald-600">
                ◎
              </div>
              <h3 className="font-bold text-xl mb-3">Objetivo Claro</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Defina sua meta — ENEM, vestibulares locais (FATEC, IFSP)
                ou concursos públicos da região.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-5 text-2xl text-emerald-600">
                ◷
              </div>
              <h3 className="font-bold text-xl mb-3">Seu Tempo</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Mapeie suas horas disponíveis de forma realista,
                incluindo fins de semana e feriados.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm hover:shadow-md transition sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-5 text-2xl text-emerald-600">
                ♧
              </div>
              <h3 className="font-bold text-xl mb-3">Plano Inteligente</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Nossa inteligência artificial cria o cronograma
                focado nas suas necessidades e objetivos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visualização do cronograma */}
      <section className="bg-slate-100 py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-sm font-bold text-emerald-600 uppercase tracking-wide">
                Visualização
              </p>

              <h2 className="text-3xl lg:text-4xl font-extrabold mt-3 max-w-xl text-slate-900">
                Um cronograma adaptável e dinâmico
              </h2>

              <p className="text-base text-slate-600 leading-relaxed max-w-xl mt-5">
                Diga adeus a planilhas estáticas e complexas.
                Nosso sistema divide suas matérias em blocos
                equilibrados de teoria, exercícios e revisão.
              </p>

              <div className="mt-7 space-y-4 text-base text-slate-700">
                {[
                  'Divisão equilibrada de temas',
                  'Alertas automáticos de revisão espaçada',
                  'Histórico de produtividade integrado',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold">
                      ✓
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                  <span className="font-bold text-base sm:text-lg">
                    Visualização Semanal
                  </span>
                </div>
                <span className="text-sm text-slate-400">
                  Exemplo de planejamento
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <p className="text-sm font-bold mb-3">Seg</p>
                  <div className="bg-blue-50 rounded-xl p-3 sm:p-4 text-left min-h-28">
                    <p className="text-sm font-bold text-blue-700">Matemática</p>
                    <p className="text-sm text-slate-600 mt-2">Teoria</p>
                    <p className="text-sm text-slate-600">1h 30min</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold mb-3">Ter</p>
                  <div className="bg-pink-50 rounded-xl p-3 sm:p-4 text-left min-h-28">
                    <p className="text-sm font-bold text-pink-700">Português</p>
                    <p className="text-sm text-slate-600 mt-2">Gramática</p>
                    <p className="text-sm text-slate-600">1h</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold mb-3">Qua</p>
                  <div className="bg-emerald-50 rounded-xl p-3 sm:p-4 text-left min-h-28">
                    <p className="text-sm font-bold text-emerald-700">Biologia</p>
                    <p className="text-sm text-slate-600 mt-2">Exercícios</p>
                    <p className="text-sm text-slate-600">2h</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold mb-3">Qui</p>
                  <div className="bg-orange-50 rounded-xl p-3 sm:p-4 text-left min-h-28">
                    <p className="text-sm font-bold text-orange-700">História</p>
                    <p className="text-sm text-slate-600 mt-2">Revisão</p>
                    <p className="text-sm text-slate-600">1h 30min</p>
                  </div>
                </div>
              </div>

              <Link
                to="/cronograma"
                className="block text-center mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-lg transition"
              >
                Acessar meu cronograma
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Indicadores */}
      <section className="bg-[#063b29] border-b-2 border-emerald-400">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-14 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-400">
                2.500+
              </h2>
              <p className="text-base text-gray-200 mt-2">
                Estudantes ativos de Caraguatatuba
              </p>
            </div>

            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-400">
                95%
              </h2>
              <p className="text-base text-gray-200 mt-2">
                Taxa de aprovação
              </p>
            </div>

            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-400">
                10.000+
              </h2>
              <p className="text-base text-gray-200 mt-2">
                Planos criados pela IA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metodologia */}
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-wide">
              Metodologia
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold mt-3">
              Desafio em Caraguatatuba
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            <div>
              <h3 className="text-4xl font-extrabold text-emerald-500">01</h3>
              <h4 className="font-bold text-xl mt-3">Defina seu objetivo</h4>
              <p className="text-base text-slate-600 leading-relaxed mt-3">
                Complete as tarefas do seu plano e mantenha sua sequência de estudos.
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-extrabold text-emerald-500">02</h3>
              <h4 className="font-bold text-xl mt-3">Configure seu tempo</h4>
              <p className="text-base text-slate-600 leading-relaxed mt-3">
                Diga quantas horas por dia e quais dias da semana você pode estudar.
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-extrabold text-emerald-500">03</h3>
              <h4 className="font-bold text-xl mt-3">Receba seu plano</h4>
              <p className="text-base text-slate-600 leading-relaxed mt-3">
                Receba sua grade de estudos organizada de acordo com sua rotina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="bg-slate-100 py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-wide">
              Depoimentos
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold mt-3">
              Histórias de quem alcançou a aprovação
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-7 shadow-sm">
              <p className="text-base text-slate-600 leading-relaxed">
                "A plataforma me ajudou a passar na FATEC. Eu trabalhava o dia
                todo e só tinha 2 horas por noite. A IA distribuiu meus estudos
                perfeitamente."
              </p>
              <div className="mt-6">
                <h4 className="text-base font-bold">Mariana Silva</h4>
                <p className="text-sm text-emerald-600 font-semibold mt-1">
                  Aprovada em Análise de Sistemas
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-sm">
              <p className="text-base text-slate-600 leading-relaxed">
                "O Assistente IA tirou todas as minhas dúvidas de Física e
                Redação na semana da prova do ENEM. Melhor investimento que fiz."
              </p>
              <div className="mt-6">
                <h4 className="text-base font-bold">Pedro Santos</h4>
                <p className="text-sm text-emerald-600 font-semibold mt-1">
                  Aprovado no ENEM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-[#063b29] text-white">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h2 className="text-xl font-extrabold">Caraguá Futuro</h2>
              <p className="text-sm text-gray-300 leading-relaxed mt-4 max-w-sm">
                Ajudando estudantes de Caraguatatuba e região a transformarem
                rotinas em conquistas acadêmicas.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold">Plataforma</h3>
              <div className="flex flex-col gap-3 mt-4">
                <Link className="text-sm text-gray-300 hover:text-emerald-400" to="/">Início</Link>
                <Link className="text-sm text-gray-300 hover:text-emerald-400" to="/planejamento">Planejamento</Link>
                <Link className="text-sm text-gray-300 hover:text-emerald-400" to="/simulados">Simulados</Link>
                <Link className="text-sm text-gray-300 hover:text-emerald-400" to="/progresso">Progresso</Link>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold">Contato</h3>
              <div className="flex flex-col gap-3 mt-4">
                <Link className="text-sm text-gray-300 hover:text-emerald-400" to="/assistente">Suporte</Link>
                <span className="text-sm text-gray-300">Termos de Uso</span>
                <span className="text-sm text-gray-300">Privacidade</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#174c3b] mt-10 pt-7">
            <p className="text-sm text-gray-400">
              © 2026 Caraguá Futuro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
