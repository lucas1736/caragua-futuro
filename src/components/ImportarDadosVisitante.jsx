import { useEffect, useState } from 'react';
import { importarDadosVisitante } from '../service/progresso.js';
import {
  coletarDadosVisitante,
  existemDadosVisitante,
  limparDadosVisitante,
} from '../service/dadosVisitante.js';
import { concluirImportacao, importacaoPendente } from '../service/auth.js';

function ImportarDadosVisitante() {
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    function verificar() {
      setAberto(importacaoPendente() && existemDadosVisitante());
    }
    verificar();
    window.addEventListener('caragua-auth-mudou', verificar);
    return () => window.removeEventListener('caragua-auth-mudou', verificar);
  }, []);

  function ignorar() {
    limparDadosVisitante();
    concluirImportacao();
    setAberto(false);
  }

  async function importar() {
    setCarregando(true);
    setErro('');
    try {
      await importarDadosVisitante(coletarDadosVisitante());
      limparDadosVisitante();
      concluirImportacao();
      setAberto(false);
      window.dispatchEvent(new Event('caragua-dados-atualizados'));
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setCarregando(false);
    }
  }

  if (!aberto) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-importacao"
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id="titulo-importacao" className="text-xl font-bold text-slate-900">
          Importar seus dados deste navegador?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Encontramos dados de visitante neste navegador. Você pode importar o plano, os registros
          de horas e o histórico de simulados para sua conta. Os dados locais serão removidos após
          uma importação concluída. Se você optar por não importar, esses dados de visitante serão
          descartados para evitar que outra pessoa que use este navegador os importe para a própria
          conta.
        </p>
        {erro && (
          <p className="mt-3 text-sm text-red-700" role="alert">
            {erro}
          </p>
        )}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={ignorar}
            className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Descartar dados de visitante
          </button>
          <button
            type="button"
            disabled={carregando}
            onClick={importar}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {carregando ? 'Importando...' : 'Importar para minha conta'}
          </button>
        </div>
      </section>
    </div>
  );
}

export default ImportarDadosVisitante;
