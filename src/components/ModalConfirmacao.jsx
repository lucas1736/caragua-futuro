function ModalConfirmacao({ aberto, titulo, mensagem, confirmarTexto = 'Confirmar', cancelarTexto = 'Cancelar', aoConfirmar, aoCancelar }) {
  if (!aberto) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) aoCancelar(); }} onKeyDown={(evento) => { if (evento.key === 'Escape') aoCancelar(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="titulo-confirmacao" aria-describedby="mensagem-confirmacao" className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 id="titulo-confirmacao" className="text-lg font-bold text-slate-900">{titulo}</h2>
        <p id="mensagem-confirmacao" className="mt-3 text-sm leading-relaxed text-slate-600">{mensagem}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={aoCancelar} className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700">{cancelarTexto}</button>
          <button type="button" onClick={aoConfirmar} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">{confirmarTexto}</button>
        </div>
      </section>
    </div>
  );
}

export default ModalConfirmacao;
