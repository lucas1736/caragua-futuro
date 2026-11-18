import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer.jsx';
import Toast from './Toast.jsx';
import { getToken } from '../service/auth.js';
import { criarPlano } from '../service/planos.js';
import { salvarVisitante } from '../service/dadosVisitante.js';
import { criarMeta, listarMetas } from '../service/metas.js';
import { sugestoesDaModalidade, nomeModalidade } from '../service/metasSugeridas.js';
import { obterMateriasModalidade, obterOpcoesModalidade, obterSugestaoPlanejamento, obterDicaDescanso, obterEstrategia, validarPlanoEstudo } from '../utils/planejamento.js';

const MATERIAS = ['Matemática', 'Português', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Redação'];
const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const DIAS_INICIAIS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];

function PlanejamentoReact() {
  const [objetivo, setObjetivo] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [materias, setMaterias] = useState([]);
  const [horas, setHoras] = useState(3);
  const [dias, setDias] = useState(DIAS_INICIAIS);
  const [data, setData] = useState('');
  const [planoPreview, setPlanoPreview] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [planoSalvo, setPlanoSalvo] = useState(false);
  const [aviso, setAviso] = useState({ mensagem: '', tipo: 'sucesso' });
  const [metasCarregando, setMetasCarregando] = useState(false);
  const [mensagemMetas, setMensagemMetas] = useState('');
  const [erroMetas, setErroMetas] = useState(false);

  const opcoes = obterOpcoesModalidade(objetivo);
  const sugestoes = sugestoesDaModalidade(modalidade);
  const sugestao = obterSugestaoPlanejamento(horas, dias);
  const prioridade = materias.length
    ? `${materias.slice(0, 2).join(' & ')}${materias.length > 2 ? ` e mais ${materias.length - 2}` : ''}`
    : 'Selecione uma modalidade';

  const planoAtual = useMemo(() => ({
    objetivo, modalidade, vestibulares: modalidade ? [modalidade] : [],
    materias, horas: Number(horas), dias, data, planoConfigurado: true,
  }), [objetivo, modalidade, materias, horas, dias, data]);

  function alterarObjetivo(valor) {
    setObjetivo(valor);
    setModalidade('');
    setMaterias([]);
    setMensagemMetas('');
  }

  function alterarModalidade(valor) {
    setModalidade(valor);
    setMaterias(obterMateriasModalidade(valor));
    setMensagemMetas('');
  }

  function alternarMateria(materia) {
    if (!modalidade) {
      setAviso({ mensagem: 'Primeiro escolha seu objetivo e sua modalidade.', tipo: 'erro' });
      return;
    }
    setMaterias((atuais) => atuais.includes(materia)
      ? atuais.filter((item) => item !== materia)
      : [...atuais, materia]);
  }

  function alternarDia(dia) {
    if (dias.includes(dia) && dias.length === 1) {
      setAviso({ mensagem: 'Você precisa selecionar pelo menos um dia.', tipo: 'erro' });
      return;
    }
    setDias((atuais) => atuais.includes(dia)
      ? atuais.filter((item) => item !== dia)
      : [...atuais, dia]);
  }

  function gerarPlano(evento) {
    evento.preventDefault();
    const erro = validarPlanoEstudo(planoAtual);
    if (erro) {
      setAviso({ mensagem: erro, tipo: 'erro' });
      return;
    }
    setPlanoPreview(planoAtual);
    setPlanoSalvo(false);
    setModalAberto(true);
    setAviso({ mensagem: '', tipo: 'sucesso' });
  }

  async function salvarPlano() {
    if (salvando || !planoPreview) return;
    setSalvando(true);
    try {
      if (getToken()) {
        await criarPlano(planoPreview);
        setAviso({ mensagem: 'Plano salvo na sua conta! Consulte também seu cronograma.', tipo: 'sucesso' });
      } else {
        salvarVisitante('plano', planoPreview);
        setAviso({ mensagem: 'Plano salvo neste navegador. Faça login para salvá-lo na sua conta.', tipo: 'sucesso' });
      }
      window.dispatchEvent(new Event('planoAtualizado'));
      setPlanoSalvo(true);
    } catch (erro) {
      setAviso({ mensagem: `Não foi possível salvar o plano: ${erro.message}`, tipo: 'erro' });
    } finally {
      setSalvando(false);
    }
  }

  async function adicionarMetas() {
    if (!getToken()) {
      setAviso({ mensagem: 'Faça login para salvar as metas na sua conta.', tipo: 'erro' });
      return;
    }
    if (!sugestoes.length || metasCarregando) return;
    setMetasCarregando(true);
    setMensagemMetas('');
    setErroMetas(false);
    try {
      const existentes = await listarMetas();
      const titulos = new Set(existentes.map((meta) => meta.titulo));
      const novas = sugestoes.filter((item) => !titulos.has(item.titulo));
      for (const item of novas) {
        await criarMeta({ ...item, prazo: data, concluida: false });
      }
      setMensagemMetas(novas.length ? `${novas.length} meta(s) adicionada(s)! Acompanhe na página de Metas.` : 'Essas metas já estão na sua conta.');
    } catch (erro) {
      setErroMetas(true);
      setMensagemMetas(`Não foi possível adicionar as metas: ${erro.message}`);
    } finally {
      setMetasCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-5 md:px-7 py-9">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Monte seu plano de estudos</h2>
          <p className="text-xs text-slate-500 mt-1">Informe suas preferências para gerar uma sugestão automática de grade de estudos, que você pode ajustar.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-5">
            <form onSubmit={gerarPlano} className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <div className="mb-5">
                <label className="block font-bold text-xs mb-2" htmlFor="objetivo">1. Qual é o seu objetivo principal?</label>
                <select className="w-full border border-slate-200 rounded-md px-3 py-3 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400" id="objetivo" value={objetivo} onChange={(evento) => alterarObjetivo(evento.target.value)}>
                  <option value="">Selecione uma opção</option>
                  <option value="IFSP">IFSP</option><option value="ETEC">ETEC</option><option value="Concurso público">Concurso público</option><option value="Vestibular">Vestibular</option>
                </select>
              </div>
              <div className="mb-5">
                <label className="block font-bold text-xs mb-2" htmlFor="modalidade">2. Qual modalidade você pretende prestar?</label>
                <select className="w-full border border-slate-200 rounded-md px-3 py-3 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-slate-100 disabled:text-slate-400" id="modalidade" value={modalidade} disabled={!objetivo} onChange={(evento) => alterarModalidade(evento.target.value)}>
                  <option value="">{objetivo ? 'Selecione uma modalidade' : 'Primeiro selecione seu objetivo'}</option>
                  {opcoes.map((opcao) => <option key={opcao.id} value={opcao.id}>{opcao.nome}</option>)}
                </select>
                <p className="text-[10px] text-slate-500 mt-2">As opções serão exibidas conforme o objetivo escolhido.</p>
              </div>
              <div className="mb-5">
                <h3 className="font-bold text-xs mb-2">3. Matérias para estudar:</h3>
                <p className="text-[10px] text-slate-500 mb-3">As matérias serão selecionadas automaticamente conforme a modalidade escolhida. Você também poderá ajustá-las.</p>
                <div className="flex flex-wrap gap-2">
                  {MATERIAS.map((materia) => {
                    const selecionada = materias.includes(materia);
                    return <button key={materia} type="button" aria-pressed={selecionada} onClick={() => alternarMateria(materia)} className={`text-[10px] px-4 py-2 rounded-full transition ${selecionada ? 'bg-emerald-500 text-[#063b29] font-semibold' : 'bg-slate-50 border border-slate-200 text-slate-600'}`}>{materia}</button>;
                  })}
                </div>
              </div>
              <div className="mb-5">
                <h3 className="font-bold text-xs mb-2">4. Tempo disponível por dia:</h3>
                <div className="flex flex-wrap justify-between gap-2 text-[9px] text-slate-500 mb-2"><span>Mínimo: 1 hora</span><span className="text-emerald-700 font-bold">{horas} {horas === 1 ? 'hora' : 'horas'} / dia selecionada{horas === 1 ? '' : 's'}</span><span>Máximo: 8 horas</span></div>
                <input className="w-full accent-emerald-500 cursor-pointer" id="tempo" max="8" min="1" step="1" type="range" value={horas} onChange={(evento) => setHoras(Number(evento.target.value))} aria-label="Tempo disponível por dia, em horas" />
              </div>
              <div className="mb-5">
                <h3 className="font-bold text-xs mb-3">5. Dias da semana para estudar:</h3>
                <div className="grid grid-cols-7 gap-1">{DIAS.map((dia) => { const selecionado = dias.includes(dia); return <button key={dia} className={`${selecionado ? 'bg-[#063b29] text-white font-bold' : 'bg-slate-50 border border-slate-200 text-slate-600'} text-[9px] py-3 rounded-md`} type="button" aria-pressed={selecionado} onClick={() => alternarDia(dia)}>{dia}</button>; })}</div>
              </div>
              <div className="mb-5">
                <label className="block font-bold text-xs mb-3" htmlFor="dataExame">6. Data estimada do exame:</label>
                <input className="w-full border border-slate-200 rounded-md px-3 py-3 text-xs outline-none focus:ring-2 focus:ring-emerald-400" id="dataExame" type="date" value={data} onChange={(evento) => setData(evento.target.value)} />
              </div>
              <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#063b29] font-bold text-sm sm:text-xs py-3.5 sm:py-3 rounded-md transition" type="submit">✨ Gerar meu plano</button>
            </form>

            {sugestoes.length > 0 && <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-xs mb-1">Metas sugeridas para esta modalidade</h3>
              <p className="text-[10px] text-slate-500 mb-4">Você pode ajustar, marcar como concluída e acompanhar o progresso na página de Metas.</p>
              <div className="space-y-2">{sugestoes.map((item) => <div key={item.titulo} className="border border-slate-200 bg-slate-50 rounded-lg p-3"><p className="text-[11px] font-bold text-slate-700">{item.titulo}</p><div className="flex flex-wrap gap-2 mt-2"><span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{item.materia}</span><span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Prioridade {item.prioridade.toLowerCase()}</span></div></div>)}</div>
              <button className="mt-4 w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-xs py-3 rounded-md transition" type="button" disabled={metasCarregando} onClick={adicionarMetas}>{metasCarregando ? 'Adicionando metas...' : `Adicionar ${sugestoes.length} metas de ${nomeModalidade(modalidade)} à minha conta`}</button>
              {mensagemMetas && <p className={`mt-3 text-[11px] font-semibold ${erroMetas ? 'text-red-600' : 'text-emerald-700'}`} role={erroMetas ? 'alert' : 'status'}>{mensagemMetas}</p>}
            </section>}
          </div>

          <aside className="bg-[#063b29] rounded-xl text-white p-5 h-fit">
            <div className="flex items-center gap-3 pb-4 border-b border-[#174c3b]"><div className="w-8 h-8 bg-[#0d523b] rounded-md flex items-center justify-center"><span className="text-emerald-400">✨</span></div><div><h3 className="font-bold text-xs">Sugestão personalizada</h3><p className="text-[8px] text-emerald-400">BASEADA NAS SUAS ESCOLHAS</p></div></div>
            <div className="mt-5"><h4 className="font-bold text-[10px] mb-3">Prioridades Detectadas:</h4><div className="bg-[#174c3b] rounded-md p-3 mb-2"><p className="text-[10px] text-emerald-400 font-semibold">{prioridade}</p><p className="text-[8px] text-gray-300 mt-1">Matérias relacionadas à prova escolhida</p></div><div className="bg-[#174c3b] rounded-md p-3 mb-2"><p className="text-[10px] text-emerald-400 font-semibold">Sugestão de Distribuição</p><p className="text-[8px] text-gray-300 mt-1">{sugestao.distribuicao}</p></div><div className="bg-[#174c3b] rounded-md p-3"><p className="text-[10px] text-emerald-400 font-semibold">Nível de Dificuldade</p><p className="text-[8px] text-gray-300 mt-1">{sugestao.dificuldade}</p></div><div className="bg-[#0b4a35] rounded-md p-3 mt-4"><div className="flex gap-2"><span className="text-emerald-400">💡</span><p className="text-[8px] text-gray-300 leading-relaxed">{obterDicaDescanso(dias)}</p></div></div></div>
          </aside>
        </div>
      </main>
      <Footer />

      {modalAberto && planoPreview && <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/50 p-3 sm:p-5 overflow-y-auto" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) setModalAberto(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="titulo-plano" className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-4 sm:p-6 my-auto max-h-[92vh] overflow-y-auto">
          <div className="flex justify-between items-center"><h2 id="titulo-plano" className="text-xl font-extrabold">Seu plano de estudos</h2><button className="text-slate-400 hover:text-slate-800 text-xl" type="button" onClick={() => setModalAberto(false)} aria-label="Fechar modal">✕</button></div>
          <p className="text-xs text-slate-500 mt-2">Plano criado com base nas suas preferências.</p>
          <div className="mt-5 space-y-3">{[
            ['Objetivo', planoPreview.objetivo], ['Modalidade escolhida', nomeModalidade(planoPreview.modalidade)], ['Tempo diário', `${planoPreview.horas} ${planoPreview.horas === 1 ? 'hora' : 'horas'} por dia`], ['Dias selecionados', planoPreview.dias.join(', ')], ['Matérias', planoPreview.materias.join(', ')], ['Estratégia sugerida', obterEstrategia(planoPreview.horas)],
          ].map(([rotulo, valor]) => <div key={rotulo} className={`${rotulo === 'Estratégia sugerida' ? 'bg-emerald-50' : 'bg-slate-50'} rounded-lg p-4`}><p className="text-[9px] text-slate-400 uppercase font-bold">{rotulo}</p><p className="text-sm font-bold mt-1 break-words">{valor}</p></div>)}</div>
          <button className="w-full mt-5 bg-emerald-500 hover:bg-emerald-400 disabled:cursor-not-allowed text-[#063b29] font-bold py-3.5 rounded-md text-sm" type="button" disabled={salvando || planoSalvo} onClick={salvarPlano}>{salvando ? 'Salvando...' : planoSalvo ? 'Plano salvo ✓' : 'Salvar meu plano'}</button>
          {planoSalvo && aviso.mensagem && <p className="mt-3 text-center text-sm text-emerald-700 font-semibold" role="status">{aviso.mensagem}</p>}
          {planoSalvo && <Link to="/cronograma" onClick={() => setModalAberto(false)} className="block mt-3 w-full text-center border border-emerald-500 text-emerald-700 hover:bg-emerald-50 font-bold py-3 rounded-md text-xs">Ver meu cronograma</Link>}
        </section>
      </div>}
      <Toast mensagem={modalAberto ? '' : aviso.mensagem} tipo={aviso.tipo} aoFechar={() => setAviso({ mensagem: '', tipo: 'sucesso' })} />
    </div>
  );
}

export default PlanejamentoReact;
