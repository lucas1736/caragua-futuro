import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Toast from './Toast.jsx';
import Footer from './Footer.jsx';
import ModalConfirmacao from './ModalConfirmacao.jsx';
import { getToken, getUsuario } from '../service/auth.js';
import { obterPlanoAtivo } from '../service/planos.js';
import { lerVisitante, salvarVisitante } from '../service/dadosVisitante.js';
import { gerarGradeCronograma, coresCronograma, obterCorMateria, podeAdicionarSessao } from '../utils/cronograma.js';

function chaveSessoes() {
  const usuario = getUsuario();
  return usuario?.id ? `caragua_cronograma_usuario_${usuario.id}` : 'caragua_visitante_cronograma';
}

function lerSessoes() {
  try {
    const chave = chaveSessoes();
    const valor = localStorage.getItem(chave);
    if (valor !== null) {
      const sessoesSalvas = JSON.parse(valor);
      return Array.isArray(sessoesSalvas) ? sessoesSalvas : null;
    }
    if (!getToken()) {
      const legado = localStorage.getItem('cronogramaCaraguaFuturo');
      if (legado !== null) {
        const sessoesLegadas = JSON.parse(legado);
        if (Array.isArray(sessoesLegadas)) {
          salvarVisitante('cronograma', sessoesLegadas);
          localStorage.removeItem('cronogramaCaraguaFuturo');
          return sessoesLegadas;
        }
      }
      const sessoesVisitante = lerVisitante('cronograma', null);
      return Array.isArray(sessoesVisitante) ? sessoesVisitante : null;
    }
    return null;
  } catch {
    return null;
  }
}

function salvarSessoes(sessoes) {
  localStorage.setItem(chaveSessoes(), JSON.stringify(sessoes));
}

function CronogramaReact() {
  const [plano, setPlano] = useState(null);
  const [sessoes, setSessoes] = useState(() => lerSessoes());
  const [carregando, setCarregando] = useState(true);
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [materia, setMateria] = useState('Matemática');
  const [dia, setDia] = useState('0');
  const [horario, setHorario] = useState('08:00');
  const [confirmacao, setConfirmacao] = useState(null);
  const [pomodoroAtivo, setPomodoroAtivo] = useState(false);
  const [segundos, setSegundos] = useState(25 * 60);
  const [mostrarPomodoro, setMostrarPomodoro] = useState(false);
  const [toast, setToast] = useState({ mensagem: '', tipo: 'sucesso' });

  useEffect(() => {
    let ativo = true;
    async function carregarPlano() {
      setCarregando(true);
      try {
        const dados = getToken() ? await obterPlanoAtivo() : lerVisitante('plano');
        if (ativo) setPlano(dados);
      } catch (erro) {
        if (ativo) setToast({ mensagem: erro.message, tipo: 'erro' });
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregarPlano();
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!pomodoroAtivo) return undefined;
    const intervalo = window.setInterval(() => {
      setSegundos((atual) => {
        if (atual <= 1) {
          window.clearInterval(intervalo);
          setPomodoroAtivo(false);
          setToast({ mensagem: 'Pomodoro concluído! Faça uma pausa de 5 minutos.', tipo: 'sucesso' });
          return 25 * 60;
        }
        return atual - 1;
      });
    }, 1000);
    return () => window.clearInterval(intervalo);
  }, [pomodoroAtivo]);

  const grade = useMemo(() => gerarGradeCronograma(plano, sessoes), [plano, sessoes]);

  function obterSessoesAtuais() {
    if (sessoes !== null) return sessoes;
    return gerarGradeCronograma(plano, null).flatMap((linha) => linha.dias
      .filter((celula) => celula.estudo)
      .map((celula) => celula.estudo));
  }

  function atualizarSessoes(proxima) {
    const atualizadas = typeof proxima === 'function' ? proxima(obterSessoesAtuais()) : proxima;
    setSessoes(atualizadas);
    salvarSessoes(atualizadas);
  }

  function adicionarSessao(evento) {
    evento.preventDefault();
    const nova = { dia: Number(dia), horario, materia: materia.trim(), tipo: 'Teoria', duracao: '1h 30m', cor: obterCorMateria(materia), origem: 'personalizada' };
    const base = obterSessoesAtuais();
    if (!materia.trim() || !podeAdicionarSessao(base, nova)) {
      setToast({ mensagem: 'Esse horário já possui um estudo.', tipo: 'erro' });
      return;
    }
    atualizarSessoes([...base, nova]);
    setModalAdicionar(false);
    setToast({ mensagem: 'Estudo adicionado ao cronograma.', tipo: 'sucesso' });
  }

  function excluirSessao(estudo) {
    setConfirmacao({
      titulo: 'Remover estudo?',
      mensagem: `Deseja remover ${estudo.materia} do cronograma?`,
      confirmarTexto: 'Remover',
      aoConfirmar: () => {
        atualizarSessoes(obterSessoesAtuais().filter((item) => !(Number(item.dia) === Number(estudo.dia) && item.horario === estudo.horario && item.materia === estudo.materia)));
        setConfirmacao(null);
      },
    });
  }

  function concluirSessao(estudo) {
    setConfirmacao({
      titulo: 'Concluir estudo?',
      mensagem: `Marcar ${estudo.materia} como estudado?`,
      confirmarTexto: 'Marcar como concluído',
      aoConfirmar: () => {
        const atividades = lerVisitante('atividades', []);
        salvarVisitante('atividades', [{ nome: `${estudo.materia} estudado`, tempo: estudo.duracao, data: new Date().toLocaleDateString('pt-BR') }, ...atividades].slice(0, 10));
        setConfirmacao(null);
        setToast({ mensagem: `${estudo.materia} marcado como concluído!`, tipo: 'sucesso' });
      },
    });
  }

  async function compartilhar() {
    const dados = { title: 'Meu Cronograma - Caraguá Futuro', text: 'Confira meu cronograma semanal de estudos!', url: window.location.href };
    try {
      if (navigator.share) await navigator.share(dados);
      else {
        await navigator.clipboard.writeText(window.location.href);
        setToast({ mensagem: 'Link copiado para a área de transferência!', tipo: 'sucesso' });
      }
    } catch {
      // Cancelamento do compartilhamento pelo usuário não exige aviso.
    }
  }

  const tempoFormatado = `${String(Math.floor(segundos / 60)).padStart(2, '0')}:${String(segundos % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
          <div><p className="text-sm font-bold text-emerald-700 uppercase tracking-wide">Organização dos estudos</p><h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-2">Seu Cronograma Semanal</h2><p className="text-base text-slate-500 mt-2">Organize seus estudos com base no plano que você salvou.</p></div>
          <div className="flex flex-wrap gap-3"><Link to="/planejamento" className="bg-white border border-slate-200 px-5 py-3 rounded-lg text-sm font-semibold hover:bg-slate-100 transition">✏️ Ajustar plano</Link><button type="button" onClick={() => setModalAdicionar(true)} className="bg-emerald-700 text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-emerald-800">Adicionar estudo</button><button type="button" onClick={() => window.print()} className="bg-white border border-slate-200 px-5 py-3 rounded-lg text-sm font-semibold hover:bg-slate-100">Exportar / imprimir</button><button type="button" onClick={compartilhar} className="bg-white border border-slate-200 px-5 py-3 rounded-lg text-sm font-semibold hover:bg-slate-100">Compartilhar</button></div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl px-5 py-4 mb-6 shadow-sm"><p className="font-bold text-sm text-slate-700 mb-3">Legenda de matérias</p><div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-600"><span>🟠 Matemática</span><span>🟢 Ciências da Natureza</span><span>🔵 Linguagens</span><span>🟣 Ciências Humanas</span></div></section>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6">
          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"><div className="overflow-x-auto"><div className="min-w-[760px]">
            <div className="grid grid-cols-[90px_repeat(7,minmax(0,1fr))] bg-[#063b29] text-white"><div className="p-4 text-sm font-semibold">Horário</div>{['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((nome) => <div key={nome} className="text-center py-4 px-2 text-sm font-bold">{nome}</div>)}</div>
            {carregando ? <p className="p-8 text-center text-sm text-slate-600" role="status">Carregando cronograma...</p> : !plano && !sessoes ? <div className="p-10 text-center"><p className="text-lg font-bold text-slate-700">Você ainda não salvou um plano.</p><p className="text-base text-slate-500 mt-2">Acesse Planejamento para criar o seu cronograma.</p><Link to="/planejamento" className="inline-block mt-5 bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-800">Criar meu plano</Link></div> : <div>{grade.map((linha) => <div key={linha.horario} className="grid grid-cols-[90px_repeat(7,minmax(0,1fr))]"><div className="border-r border-b border-slate-200 bg-slate-50 p-3 text-center text-sm font-bold text-slate-500">{linha.horario}</div>{linha.dias.map((celula) => <div key={celula.indice} className="min-h-28 border-r border-b border-slate-200 p-2">{celula.estudo && <article className={`rounded-lg border p-2 ${coresCronograma[celula.estudo.cor] || coresCronograma.green}`}><p className="text-xs font-bold break-words">{celula.estudo.materia}</p><p className="mt-1 text-xs opacity-80">{celula.estudo.tipo}</p><div className="mt-2 flex items-center justify-between gap-1"><span className="text-xs">{celula.estudo.duracao}</span><button type="button" aria-label={`Marcar ${celula.estudo.materia} como concluído`} onClick={() => concluirSessao(celula.estudo)} className="text-xs font-bold hover:underline">Concluir</button><button type="button" aria-label={`Remover ${celula.estudo.materia}`} onClick={() => excluirSessao(celula.estudo)} className="text-base font-bold text-red-600 hover:text-red-800">×</button></div></article>}</div>)}</div>)}</div>}
          </div></div></section>

          <aside className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"><h3 className="font-bold text-lg text-slate-800 mb-4">Resumo do plano</h3>{plano ? <div className="space-y-4 text-sm text-slate-600"><p><strong className="text-slate-800">Objetivo:</strong> {plano.objetivo || 'Não informado'}</p><p><strong className="text-slate-800">Horas por dia:</strong> {plano.horas ?? 0}h</p><p><strong className="text-slate-800">Matérias:</strong> {plano.materias?.length || 0}</p><p><strong className="text-slate-800">Dias selecionados:</strong> {plano.dias?.length || 0}</p>{plano.data && <p><strong className="text-slate-800">Data da prova:</strong> {plano.data.split('-').reverse().join('/')}</p>}</div> : <p className="text-sm text-slate-500">Seu resumo aparecerá depois que você salvar o planejamento.</p>}</div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"><h3 className="font-bold text-lg text-slate-800 mb-4">Matérias selecionadas</h3>{plano?.materias?.length ? <div className="flex flex-wrap gap-2">{plano.materias.map((item) => <span key={item} className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg px-3 py-2 text-sm">{item}</span>)}</div> : <p className="text-sm text-slate-500">Nenhuma matéria salva ainda.</p>}</div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"><h3 className="font-bold text-lg text-slate-800 mb-3">Pomodoro</h3>{mostrarPomodoro && <p className="mb-3 text-3xl font-bold text-emerald-800" role="timer">{tempoFormatado}</p>}<button type="button" onClick={() => { setMostrarPomodoro(true); setPomodoroAtivo((ativo) => !ativo); }} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">{pomodoroAtivo ? 'Pausar Pomodoro' : mostrarPomodoro && segundos < 25 * 60 ? 'Continuar Pomodoro' : 'Iniciar Pomodoro'}</button></div>
          </aside>
        </div>
      </main>
      <Footer />

      {modalAdicionar && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) setModalAdicionar(false); }}><section role="dialog" aria-modal="true" aria-labelledby="titulo-adicionar" className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"><h2 id="titulo-adicionar" className="text-lg font-bold">Adicionar estudo</h2><form onSubmit={adicionarSessao} className="mt-4 space-y-4"><label htmlFor="materia-sessao" className="block text-sm font-semibold">Matéria<input id="materia-sessao" className="mt-1 w-full rounded border p-2" value={materia} onChange={(evento) => setMateria(evento.target.value)} maxLength={80} required /></label><label htmlFor="dia-sessao" className="block text-sm font-semibold">Dia<select id="dia-sessao" className="mt-1 w-full rounded border p-2" value={dia} onChange={(evento) => setDia(evento.target.value)}>{['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((nome, indice) => <option key={nome} value={indice}>{nome}</option>)}</select></label><label htmlFor="horario-sessao" className="block text-sm font-semibold">Horário<select id="horario-sessao" className="mt-1 w-full rounded border p-2" value={horario} onChange={(evento) => setHorario(evento.target.value)}>{['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map((item) => <option key={item}>{item}</option>)}</select></label><div className="flex justify-end gap-3"><button type="button" onClick={() => setModalAdicionar(false)} className="rounded-lg border px-4 py-2 text-sm">Cancelar</button><button type="submit" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Adicionar</button></div></form></section></div>}
      <ModalConfirmacao aberto={Boolean(confirmacao)} titulo={confirmacao?.titulo} mensagem={confirmacao?.mensagem} confirmarTexto={confirmacao?.confirmarTexto} aoCancelar={() => setConfirmacao(null)} aoConfirmar={confirmacao?.aoConfirmar || (() => {})} />
      <Toast mensagem={toast.mensagem} tipo={toast.tipo} aoFechar={() => setToast({ mensagem: '', tipo: 'sucesso' })} />
    </div>
  );
}

export default CronogramaReact;
