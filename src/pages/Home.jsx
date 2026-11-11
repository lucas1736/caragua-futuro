
function Home() {

  return (
    <div className="min-h-screen">
      


<section className="bg-[#063b29] text-white">
<div className="max-w-7xl mx-auto px-4 sm:px-7 py-12 md:py-14">
<div className="grid md:grid-cols-2 gap-12 items-center">

<div>

<div className="inline-flex items-center gap-2 bg-[#174c3b] px-3 py-1 rounded-full mb-5">
<span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
<span className="text-[9px] text-gray-200">
                            Aprovado por estudantes do litoral norte
                        </span>
</div>

<h2 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-xl">
                        Seu futuro começa com
                        <br/>
                        um plano possível.
                    </h2>

<p className="text-gray-300 text-sm leading-relaxed max-w-xl mt-5">
                        Organize seus estudos de forma simples e realista.
                        A nossa Inteligência Artificial cria o cronograma ideal
                        baseado na sua rotina e objetivos de Caraguatatuba.
                    </p>

<div className="flex flex-wrap gap-2 mt-7">
<button
  onClick={() => window.location.href = '/planejamento'}
  className="bg-emerald-500 hover:bg-emerald-400 text-[#063b29] font-bold text-[11px] px-5 py-3 rounded-md transition"
>
  Montar meu plano
</button>
<button className="bg-[#174c3b] hover:bg-[#205a47] text-white font-medium text-[11px] px-5 py-3 rounded-md transition">
                            Ver demonstração
                            <span className="ml-1">◉</span>
</button>
</div>
</div>

<div className="w-full">
<img alt="Plataforma de estudos" className="w-full h-[280px] md:h-[330px] object-cover rounded-2xl" src="/assets/foto principal.png"/>
</div>
</div>
</div>
</section>

<section className="bg-slate-50 py-12">
<div className="max-w-7xl mx-auto px-4 sm:px-7">

<div className="text-center mb-8">
<p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide">
                    Funcionalidades
                </p>
<h2 className="text-2xl font-extrabold mt-1">
                    Tudo o que você precisa para ser aprovado
                </h2>
</div>

<div className="grid md:grid-cols-3 gap-5">

<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
<div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
<span className="text-emerald-500">
                            ◎
                        </span>
</div>
<h3 className="font-bold text-sm mb-2">
                        Objetivo Claro
                    </h3>
<p className="text-[10px] text-slate-500 leading-relaxed">
                        Defina sua meta — ENEM, vestibulares locais
                        (FATEC, IFSP) ou concursos públicos da região.
                    </p>
</div>

<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
<div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
<span className="text-emerald-500">
                            ◷
                        </span>
</div>
<h3 className="font-bold text-sm mb-2">
                        Seu Tempo
                    </h3>
<p className="text-[10px] text-slate-500 leading-relaxed">
                        Mapeie suas horas disponíveis de forma realista,
                        incluindo fins de semana e feriados.
                    </p>
</div>

<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
<div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
<span className="text-emerald-500">
                            ♧
                        </span>
</div>
<h3 className="font-bold text-sm mb-2">
                        Plano Inteligente
                    </h3>
<p className="text-[10px] text-slate-500 leading-relaxed">
                        Nossa inteligência artificial cria o cronograma
                        perfeito focado em seus pontos fortes.
                    </p>
</div>
</div>
</div>
</section>

<section className="bg-slate-100 py-14">
<div className="max-w-7xl mx-auto px-4 sm:px-7">
<div className="grid md:grid-cols-2 gap-12 items-center">

<div>
<p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide">
                        Visualização
                    </p>
<h2 className="text-2xl font-extrabold mt-2 max-w-md">
                        Um cronograma adaptável e dinâmico
                    </h2>
<p className="text-xs text-slate-500 leading-relaxed max-w-lg mt-4">
                        Diga adeus a planilhas estáticas e complexas.
                        Nosso sistema divide suas matérias em blocos
                        equilibrados de teoria, exercícios e revisão.
                    </p>

<div className="mt-5 space-y-3 text-[10px]">
<div className="mt-5 space-y-3 text-[10px]">

<div className="flex items-center gap-3">
<span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
<svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" stroke-width="3" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M5 12l4 4L19 6" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
</span>
<span className="text-slate-800">
            Divisão equilibrada de temas
        </span>
</div>

<div className="flex items-center gap-3">
<span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
<svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" stroke-width="3" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M5 12l4 4L19 6" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
</span>
<span className="text-slate-800">
            Alertas automáticos de revisão espaçada
        </span>
</div>

<div className="flex items-center gap-3">
<span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
<svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" stroke-width="3" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M5 12l4 4L19 6" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
</span>
<span className="text-slate-800">
            Histórico de produtividade integrado
        </span>
</div>
</div>

<div className="bg-white rounded-xl shadow-md p-4">

<div className="flex items-center justify-between mb-4">
<div className="flex items-center gap-2">
<span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
<span className="font-bold text-[10px]">
                                Visualização Semanal (Exemplo)
                            </span>
</div>
<span className="text-[8px] text-slate-400">
                            Q3 Planejamento
                        </span>
</div>

<div className="grid grid-cols-4 gap-2 text-center">
<div>
<p className="text-[8px] font-semibold mb-2">
                                Seg
                            </p>
<div className="bg-blue-50 rounded-md p-3 text-left">
<p className="text-[8px] font-bold text-blue-600">
                                    Matemática
                                </p>
<p className="text-[7px] text-slate-500 mt-1">
                                    Teoria
                                </p>
<p className="text-[7px] text-slate-500">
                                    1h 30m
                                </p>
</div>
</div>
<div>
<p className="text-[8px] font-semibold mb-2">
                                Ter
                            </p>
<div className="bg-pink-50 rounded-md p-3 text-left">
<p className="text-[8px] font-bold text-pink-600">
                                    Português
                                </p>
<p className="text-[7px] text-slate-500 mt-1">
                                    Gramática
                                </p>
<p className="text-[7px] text-slate-500">
                                    1h
                                </p>
</div>
</div>
<div>
<p className="text-[8px] font-semibold mb-2">
                                Qua
                            </p>
<div className="bg-emerald-50 rounded-md p-3 text-left">
<p className="text-[8px] font-bold text-emerald-600">
                                    Biologia
                                </p>
<p className="text-[7px] text-slate-500 mt-1">
                                    Exercícios
                                </p>
<p className="text-[7px] text-slate-500">
                                    2h
                                </p>
</div>
</div>
<div>
<p className="text-[8px] font-semibold mb-2">
                                Qui
                            </p>
<div className="bg-orange-50 rounded-md p-3 text-left">
<p className="text-[8px] font-bold text-orange-600">
                                    História
                                </p>
<p className="text-[7px] text-slate-500 mt-1">
                                    Revisão
                                </p>
<p className="text-[7px] text-slate-500">
                                    1h 30m
                                </p>
</div>
</div>
</div>
</div>
</div>
</div>
</div></div></section>

<section className="bg-[#063b29] border-b-2 border-emerald-400">
<div className="max-w-7xl mx-auto px-4 sm:px-7 py-12">
<div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">

<div className="">
<h2 className="text-3xl md:text-4xl font-extrabold text-emerald-500">
                    2.500+
                </h2>
<p className="text-xs text-gray-300 mt-1">
                    Estudantes ativos de Caraguatatuba
                </p>
</div>

<div className="">
<h2 className="text-3xl md:text-4xl font-extrabold text-emerald-500">
                    95%
                </h2>
<p className="text-xs text-gray-300 mt-1">
                    Taxa de aprovação
                </p>
</div>

<div className="">
<h2 className="text-3xl md:text-4xl font-extrabold text-emerald-500">
                    10.000+
                </h2>
<p className="text-xs text-gray-300 mt-1">
                    Planos criados pela IA
                </p>
</div>
</div>
</div>
</section>

<section className="bg-slate-50 py-14">
<div className="max-w-7xl mx-auto px-4 sm:px-7">

<div className="text-center mb-10">
<p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide">
                Metodologia
            </p>
<h2 className="text-2xl md:text-3xl font-extrabold mt-2">
                Desafio em Caraguatatuba
            </h2>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-12">

<div>
<h3 className="text-2xl font-extrabold text-emerald-500">
                    01
                </h3>
<h4 className="font-bold text-sm mt-2">
                    Defina seu objetivo
                </h4>
<p className="text-[10px] text-slate-500 leading-relaxed mt-3 max-w-sm">
                    Complete as tarefas do seu plano e mantenha sua sequência de estudos
                </p>
</div>

<div>
<h3 className="text-2xl font-extrabold text-emerald-500">
                    02
                </h3>
<h4 className="font-bold text-sm mt-2">
                    Configure seu tempo
                </h4>
<p className="text-[10px] text-slate-500 leading-relaxed mt-3 max-w-sm">
                    Diga quantas horas por dia e quais dias da semana você pode estudar.
                </p>
</div>

<div>
<h3 className="text-2xl font-extrabold text-emerald-500">
                    03
                </h3>
<h4 className="font-bold text-sm mt-2">
                    Receba seu plano
                </h4>
<p className="text-[10px] text-slate-500 leading-relaxed mt-3 max-w-sm">
                    A inteligência artificial monta sua grade instantaneamente e envia para seu painel.
                </p>
</div>
</div>
</div>
</section>

<section className="bg-slate-100 py-14">
<div className="max-w-7xl mx-auto px-4 sm:px-7">

<div className="text-center mb-8">
<p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide">
                Depoimentos
            </p>
<h2 className="text-2xl md:text-3xl font-extrabold mt-2">
                Histórias de quem alcançou a aprovação
            </h2>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-5">

<div className="bg-white rounded-xl p-6 shadow-sm">
<p className="text-xs text-slate-500 leading-relaxed">
                    "A plataforma me ajudou a passar na FATEC.
                    Eu trabalhava o dia todo e só tinha 2 horas por noite.
                    A IA distribuiu meus estudos perfeitamente."
                </p>
<div className="mt-5">
<h4 className="text-xs font-bold">
                        Mariana Silva
                    </h4>
<p className="text-[9px] text-emerald-500 font-semibold mt-1">
                        Aprovada em Análise de Sistemas
                    </p>
</div>
</div>

<div className="bg-white rounded-xl p-6 shadow-sm">
<p className="text-xs text-slate-500 leading-relaxed">
                    "O Assistente IA tirou todas as minhas dúvidas
                    de Física e Redação na semana da prova do ENEM.
                    Melhor investimento que fiz."
                </p>
<div className="mt-5">
<h4 className="text-xs font-bold">
                        Pedro Santos
                    </h4>
<p className="text-[9px] text-emerald-500 font-semibold mt-1">
                        Aprovado no ENEM
                    </p>
</div>
</div>
</div>
</div>
</section>

<footer className="bg-[#063b29] text-white">
<div className="max-w-7xl mx-auto px-4 sm:px-7 py-12">
<div className="grid grid-cols-1 md:grid-cols-3 gap-10">

<div>
<h2 className="text-lg font-extrabold">
                    Caraguá Futuro
                </h2>
<p className="text-[10px] text-gray-400 leading-relaxed mt-3 max-w-xs">
                    Ajudando estudantes de Caraguatatuba e região
                    a transformarem rotinas em conquistas acadêmicas.
                </p>
</div>

<div className="md:col-start-2">
<h3 className="text-xs font-bold">
                    Plataforma
                </h3>
<div className="flex flex-col gap-2 mt-3">
<a className="text-[9px] text-gray-400 hover:text-emerald-400" href="/">
                        Início
                    </a>
<a className="text-[9px] text-gray-400 hover:text-emerald-400" href="/planejamento">
                        Planejamento
                    </a>
<a className="text-[9px] text-gray-400 hover:text-emerald-400" href="/progresso">
                        Progresso
                    </a>
</div>
</div>

<div>
<h3 className="text-xs font-bold">
                    Contato
                </h3>
<div className="flex flex-col gap-2 mt-3">
<a className="text-[9px] text-gray-400 hover:text-emerald-400" href="#">
                        Suporte
                    </a>
<a className="text-[9px] text-gray-400 hover:text-emerald-400" href="#">
                        Termos de Uso
                    </a>
<a className="text-[9px] text-gray-400 hover:text-emerald-400" href="#">
                        Privacidade
                    </a>
</div>
</div>
</div>

<div className="border-t border-[#174c3b] mt-8 pt-7 flex flex-col md:flex-row justify-between gap-4">
<p className="text-[9px] text-gray-500">
                © 2026 Caraguá Futuro. Todos os direitos reservados.
            </p>

<div className="flex gap-4">
<a className="text-gray-300 hover:text-emerald-400" href="#">
                    ◎
                </a>
<a className="text-gray-300 hover:text-emerald-400" href="#">
                    f
                </a>
</div>
</div>
</div>
</footer>

    </div>
  );
}

export default Home;
