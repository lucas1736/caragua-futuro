import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import { getUsuario } from '../service/auth.js';
import {
  listarPlanos,
  criarPlano,
  atualizarPlano,
  excluirPlano,
} from '../service/planos.js';

const OBJETIVOS = ['Vestibular', 'ENEM', 'FATEC', 'IFSP', 'Concurso'];
const MATERIAS = [
  'Matemática', 'Português', 'Física', 'Química',
  'Biologia', 'História', 'Geografia', 'Redação',
];
const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

const formVazio = {
  objetivo: 'ENEM',
  materias: ['Matemática', 'Português'],
  horas: 3,
  dias: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
  data: '',
};

function formatarData(data) {
  if (!data) return 'Sem data definida';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function alternar(lista, item) {
  return lista.includes(item) ? lista.filter((i) => i !== item) : [...lista, item];
}

function MeusPlanos() {
  const navigate = useNavigate();
  const usuario = getUsuario();

  const [planos, setPlanos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  // formulário (criar / editar)
  const [formAberto, setFormAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formVazio);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');

  useEffect(() => {
    if (!usuario) {
      setCarregando(false);
      return;
    }
    listarPlanos()
      .then(setPlanos)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function abrirCriar() {
    setEditandoId(null);
    setForm(formVazio);
    setErroForm('');
    setFormAberto(true);
  }

  function abrirEditar(plano) {
    setEditandoId(plano.id);
    setForm({
      objetivo: plano.objetivo,
      materias: plano.materias,
      horas: plano.horas,
      dias: plano.dias,
      data: plano.data,
    });
    setErroForm('');
    setFormAberto(true);
  }

  async function salvar(event) {
    event.preventDefault();
    setErroForm('');

    if (form.materias.length === 0) return setErroForm('Selecione pelo menos uma matéria.');
    if (form.dias.length === 0) return setErroForm('Selecione pelo menos um dia.');

    setSalvando(true);
    try {
      if (editandoId) {
        const atualizado = await atualizarPlano(editandoId, form);
        setPlanos((lista) => lista.map((p) => (p.id === editandoId ? atualizado : p)));
        setAviso('Plano atualizado!');
      } else {
        const novo = await criarPlano(form);
        setPlanos((lista) => [novo, ...lista]);
        setAviso('Plano criado!');
      }
      setFormAberto(false);
    } catch (e) {
      setErroForm(e.message);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(plano) {
    if (!confirm(`Excluir o plano "${plano.objetivo}"?`)) return;
    try {
      await excluirPlano(plano.id);
      setPlanos((lista) => lista.filter((p) => p.id !== plano.id));
      setAviso('Plano excluído.');
    } catch (e) {
      setErro(e.message);
    }
  }

  function usarNoCronograma(plano) {
    localStorage.setItem(
      'planoCaraguaFuturo',
      JSON.stringify({
        objetivo: plano.objetivo,
        materias: plano.materias,
        horas: plano.horas,
        dias: plano.dias,
        data: plano.data,
      })
    );
    navigate('/cronograma');
  }

  const chip = (ativo) =>
    `text-[11px] px-3 py-1.5 rounded-full border transition ${
      ativo
        ? 'bg-emerald-500 border-emerald-500 text-[#063b29] font-semibold'
        : 'bg-slate-50 border-slate-200 text-slate-600'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      <main className="flex-1 max-w-4xl w-full mx-auto px-5 md:px-7 py-9">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Meus Planos</h2>
            <p className="text-xs text-slate-500 mt-1">
              Planos de estudo salvos na sua conta.
            </p>
          </div>

          {usuario && (
            <button
              type="button"
              onClick={abrirCriar}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
            >
              + Novo plano
            </button>
          )}
        </div>

        {!usuario && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-slate-600 mb-4">
              Entre na sua conta para ver e gerenciar seus planos.
            </p>
            <Link
              to="/login"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-lg"
            >
              Ir para o login
            </Link>
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

        {usuario && !carregando && planos.length === 0 && !erro && (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500 text-sm">
            Você ainda não tem planos. Clique em <strong>+ Novo plano</strong> ou
            monte um na página de{' '}
            <a href="/planejamento" className="text-emerald-600 font-semibold">
              Planejamento
            </a>
            .
          </div>
        )}

        <div className="space-y-4">
          {planos.map((plano) => (
            <article
              key={plano.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{plano.objetivo}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {plano.horas} {plano.horas === 1 ? 'hora' : 'horas'}/dia ·{' '}
                    {plano.dias.join(', ')} · Prova: {formatarData(plano.data)}
                  </p>
                </div>

                <div className="flex gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => usarNoCronograma(plano)}
                    className="px-3 py-2 rounded-md bg-[#063b29] text-white hover:bg-[#0a5a3f]"
                  >
                    Usar no cronograma
                  </button>
                  <button
                    type="button"
                    onClick={() => abrirEditar(plano)}
                    className="px-3 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => excluir(plano)}
                    className="px-3 py-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {plano.materias.map((m) => (
                  <span
                    key={m}
                    className="text-[11px] px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>

      {formAberto && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={salvar}
            className="bg-white w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto space-y-5"
          >
            <h3 className="text-xl font-bold text-slate-900">
              {editandoId ? 'Editar plano' : 'Novo plano'}
            </h3>

            <div>
              <label className="block text-sm font-medium mb-2">Objetivo</label>
              <select
                value={form.objetivo}
                onChange={(e) => setForm({ ...form, objetivo: e.target.value })}
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {OBJETIVOS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Matérias</p>
              <div className="flex flex-wrap gap-2">
                {MATERIAS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={chip(form.materias.includes(m))}
                    onClick={() => setForm({ ...form, materias: alternar(form.materias, m) })}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Horas por dia: {form.horas}
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={form.horas}
                onChange={(e) => setForm({ ...form, horas: Number(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Dias da semana</p>
              <div className="flex flex-wrap gap-2">
                {DIAS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={chip(form.dias.includes(d))}
                    onClick={() => setForm({ ...form, dias: alternar(form.dias, d) })}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data da prova</label>
              <input
                type="date"
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

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
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-semibold"
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

export default MeusPlanos;
