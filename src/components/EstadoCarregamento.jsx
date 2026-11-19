function EstadoCarregamento({ mensagem = 'Carregando...' }) {
  return (
    <main className="min-h-[40vh] flex items-center justify-center p-6" role="status" aria-live="polite">
      <p className="text-base text-slate-700">{mensagem}</p>
    </main>
  );
}

export default EstadoCarregamento;
