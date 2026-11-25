import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import { getUsuario } from '../service/auth.js';
import { listarPlanos } from '../service/planos.js';
import { NOMES_MODALIDADES, nomeModalidade } from '../../shared/metasSugeridas.js';
import {
  listarMetas,
  obterModalidadePreferida,
  sincronizarMetasSugeridas,
  criarMeta,
  atualizarMeta,
  excluirMeta,
} from '../service/metas.js';

const MATERIAS = [
  'Matemática',
  'Português',
  'Física',
  'Química',
  'Biologia',
  'História',
  'Geografia',
  'Redação',
  'Geral',
];
const PRIORIDADES = ['Baixa', 'Média', 'Alta'];
const FILTROS = ['Todas', 'Pendentes', 'Concluídas'];

const formVazio = {
  titulo: '',
  materia: 'Matemática',
  descricao: '',
  prioridade: 'Média',
  prazo: '',
  concluida: false,
};

const corPrioridade = {
  Alta: 'bg-red-50 text-red-600 border-red-100',
  Média: 'bg-amber-50 text-amber-700 border-amber-100',
  Baixa: 'bg-slate-100 text-slate-600 border-slate-200',
};

function formatarData(data) {
  if (!data) return 'Sem prazo';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function atrasada(meta) {
  if (!meta.prazo || meta.concluida) return false;
  const hoje = new Date().toISOString().slice(0, 10);
  return meta.prazo < hoje;
}

function Metas() {
  const usuario = getUsuario();
  const usuarioId = usuario?.id ?? null;

  const [metas, setMetas] = useState([]);
  const [modalidade, setModalidade] = useState('');
  const [sincronizandoSugestoes, setSincronizandoSugestoes] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [filtro, setFiltro] = useState('Todas');

  // formulário (criar / editar)
  const [formAberto, setFormAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formVazio);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');

  useEffect(() => {
    let ativo = true;
    if (!usuarioId) {
      setCarregando(false);
      return () => {
        ativo = false;
      };
    }

    Promise.all([listarMetas(), listarPlanos(), obterModalidadePreferida()])
      .then(async ([lista, planos, modalidadePreferida]) => {
        if (!ativo) return;
        setMetas(lista);
        const plano = planos.find((item) => item.ativo) || planos[0];
        const modalidadeInicial = modalidadePreferida || plano?.modalidade || '';
        setModalidade(modalidadeInicial);
        if (modalidadeInicial) {
          setSincronizandoSugestoes(true);
          const sugeridas = await sincronizarMetasSugeridas(modalidadeInicial);
          if (ativo) {
            const porId = new Map([...lista, ...sugeridas].map((meta) => [meta.id, meta]));
            setMetas([...porId.values()]);
          }
        }
      })
      .catch((e) => {
        if (ativo) setErro(e.message);
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
          setSincronizandoSugestoes(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [usuarioId]);

  async function selecionarModalidade(valor) {
    setModalidade(valor);
    setErro('');
    if (!valor || !usuario) return;
    setSincronizandoSugestoes(true);
    try {
      const sugeridas = await sincronizarMetasSugeridas(valor);
      setMetas((atuais) => {
        const porId = new Map([...atuais, ...sugeridas].map((meta) => [meta.id, meta]));
        return [...porId.values()];
      });
    } catch (e) {
      setErro(e.message);
    } finally {
      setSincronizandoSugestoes(false);
    }
  }

  function abrirCriar() {
    setEditandoId(null);
    setForm(formVazio);
    setErroForm('');
    setFormAberto(true);
  }

  function abrirEditar(meta) {
    setEditandoId(meta.id);
    setForm({
      titulo: meta.titulo,
      materia: meta.materia,
      descricao: meta.descricao,
      prioridade: meta.prioridade,
      prazo: meta.prazo,
      concluida: meta.concluida,
    });
    setErroForm('');
    setFormAberto(true);
  }

  async function salvar(event) {
    event.preventDefault();
    setErroForm('');

    if (!form.titulo.trim()) return setErroForm('Informe um título para a meta.');

    setSalvando(true);
    try {
      if (editandoId) {
        const atualizada = await atualizarMeta(editandoId, form);
        setMetas((lista) => lista.map((m) => (m.id === editandoId ? atualizada : m)));
        setAviso('Meta atualizada!');
      } else {
        const nova = await criarMeta(form);
        setMetas((lista) => [nova, ...lista]);
        setAviso('Meta criada!');
      }
      setFormAberto(false);
    } catch (e) {
      setErroForm(e.message);
    } finally {
      setSalvando(false);
    }
  }

  async function alternarConclusao(meta) {
    setErro('');
    try {
      const atualizada = await atualizarMeta(meta.id, {
        ...meta,
        concluida: !meta.concluida,
      });
      setMetas((lista) => lista.map((m) => (m.id === meta.id ? atualizada : m)));
    } catch (e) {
      setErro(e.message);
    }
  }

  async function excluir(meta) {
    if (!confirm(`Excluir a meta "${meta.titulo}"?`)) return;
    try {
      await excluirMeta(meta.id);
      setMetas((lista) => lista.filter((m) => m.id !== meta.id));
      setAviso('Meta excluída.');
    } catch (e) {
      setErro(e.message);
    }
  }

  const metasDaModalidade = metas.filter((meta) => meta.modalidade === modalidade);
  const metasConcluidasDaModalidade = metasDaModalidade.filter((meta) => meta.concluida).length;

  const metasDaPreparacao = modalidade
    ? metas.filter((meta) => !meta.modalidade || meta.modalidade === modalidade)
    : metas;
  const total = metasDaPreparacao.length;
  const feitas = metasDaPreparacao.filter((meta) => meta.concluida).length;
  const percentual = total === 0 ? 0 : Math.round((feitas / total) * 100);

  const visiveis = metasDaPreparacao.filter((meta) => {
    if (filtro === 'Pendentes') return !meta.concluida;
    if (filtro === 'Concluídas') return meta.concluida;
    return true;
  });

  const inputClasse =
    'w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-4xl w-full mx-auto px-5 md:px-7 py-9">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Metas de Estudo</h2>
            <p className="text-xs text-slate-500 mt-1">
              Defina objetivos menores e acompanhe o que já foi concluído.
            </p>
          </div>

          {usuario && (
            <button
              type="button"
              onClick={abrirCriar}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
            >
              + Nova meta
            </button>
          )}
        </div>

        {!usuario && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-slate-600 mb-4">
              Entre na sua conta para ver e gerenciar suas metas.
            </p>
            <Link
              to="/login"
              className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-2.5 rounded-lg"
            >
              Ir para o login
            </Link>
          </div>
        )}

        {usuario && (
          <section className="bg-[#063b29] text-white rounded-xl p-5 mb-5 shadow-sm">
            <label
              htmlFor="modalidade-metas"
              className="block text-xs text-emerald-300 font-bold uppercase tracking-wide"
            >
              Sua preparação
            </label>
            <select
              id="modalidade-metas"
              value={modalidade}
              onChange={(evento) => selecionarModalidade(evento.target.value)}
              className="mt-2 w-full sm:max-w-lg rounded-lg bg-white text-slate-900 p-3 text-sm"
            >
              <option value="">Escolha sua modalidade para gerar metas</option>
              {Object.entries(NOMES_MODALIDADES).map(([id, nome]) => (
                <option key={id} value={id}>
                  {nome}
                </option>
              ))}
            </select>
            {modalidade && (
              <div className="mt-3" aria-live="polite">
                <h3 className="font-bold text-sm">Metas de {nomeModalidade(modalidade)}</h3>
                <p className="text-xs text-gray-300 mt-1">
                  {sincronizandoSugestoes
                    ? 'Sincronizando metas da modalidade...'
                    : `${metasConcluidasDaModalidade} de ${metasDaModalidade.length} metas concluídas. As metas geradas ficam salvas na sua conta.`}
                </p>
              </div>
            )}
          </section>
        )}

        {usuario && total > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold text-slate-800">
                {feitas} de {total} metas concluídas
              </span>
              <span className="text-emerald-600 font-bold">{percentual}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${percentual}%` }}
              />
            </div>
          </div>
        )}

        {usuario && total > 0 && (
          <div className="flex gap-2 mb-5">
            {FILTROS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFiltro(f)}
                className={`text-xs px-4 py-2 rounded-full border transition ${
                  filtro === f
                    ? 'bg-[#063b29] border-[#063b29] text-white font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {aviso && (
          <p className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            {aviso}
          </p>
        )}
        {erro && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {erro}
          </p>
        )}

        {usuario && carregando && <p className="text-slate-500 text-sm">Carregando...</p>}

        {usuario && !carregando && total === 0 && !erro && (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500 text-sm">
            Você ainda não tem metas. Clique em <strong>+ Nova meta</strong> para criar a primeira.
          </div>
        )}

        {usuario && total > 0 && visiveis.length === 0 && (
          <p className="text-sm text-slate-500">Nenhuma meta neste filtro.</p>
        )}

        <div className="space-y-3">
          {visiveis.map((meta) => (
            <article
              key={meta.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex items-start gap-4 w-full min-w-0">
                  <input
                    type="checkbox"
                    checked={meta.concluida}
                    onChange={() => alternarConclusao(meta)}
                    aria-label={`Marcar "${meta.titulo}" como concluída`}
                    className="mt-1 w-5 h-5 accent-emerald-500 cursor-pointer shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-bold text-base break-words ${
                        meta.concluida ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {meta.titulo}
                    </h3>
                    {meta.descricao && (
                      <p className="text-xs text-slate-500 mt-1 break-words">{meta.descricao}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {meta.materia}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full border ${corPrioridade[meta.prioridade]}`}
                      >
                        Prioridade {meta.prioridade.toLowerCase()}
                      </span>
                      <span
                        className={`text-xs ${
                          atrasada(meta) ? 'text-red-600 font-semibold' : 'text-slate-500'
                        }`}
                      >
                        {atrasada(meta) ? 'Atrasada · ' : 'Prazo: '}
                        {formatarData(meta.prazo)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col gap-2 text-xs font-semibold pl-9 sm:pl-0">
                  <button
                    type="button"
                    onClick={() => abrirEditar(meta)}
                    className="px-3 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => excluir(meta)}
                    className="px-3 py-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {formAberto && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) setFormAberto(false);
          }}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-form-meta"
            onSubmit={salvar}
            className="bg-white w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto space-y-5"
          >
            <h3 id="titulo-form-meta" className="text-xl font-bold text-slate-900">
              {editandoId ? 'Editar meta' : 'Nova meta'}
            </h3>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="meta-titulo">
                Título
              </label>
              <input
                id="meta-titulo"
                type="text"
                maxLength={120}
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ex.: Resolver 20 exercícios de funções"
                className={inputClasse}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="meta-materia">
                  Matéria
                </label>
                <select
                  id="meta-materia"
                  value={form.materia}
                  onChange={(e) => setForm({ ...form, materia: e.target.value })}
                  className={inputClasse}
                >
                  {MATERIAS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="meta-prioridade">
                  Prioridade
                </label>
                <select
                  id="meta-prioridade"
                  value={form.prioridade}
                  onChange={(e) => setForm({ ...form, prioridade: e.target.value })}
                  className={inputClasse}
                >
                  {PRIORIDADES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="meta-prazo">
                Prazo
              </label>
              <input
                id="meta-prazo"
                type="date"
                value={form.prazo}
                onChange={(e) => setForm({ ...form, prazo: e.target.value })}
                className={inputClasse}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="meta-descricao">
                Descrição (opcional)
              </label>
              <textarea
                id="meta-descricao"
                rows={3}
                maxLength={500}
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                className={inputClasse}
              />
            </div>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.concluida}
                onChange={(e) => setForm({ ...form, concluida: e.target.checked })}
                className="w-5 h-5 accent-emerald-500"
              />
              Meta já concluída
            </label>

            {erroForm && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {erroForm}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormAberto(false)}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-sm font-semibold"
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Metas;
