function Toast({ mensagem, tipo = 'sucesso', aoFechar }) {
  if (!mensagem) return null;
  const estilos =
    tipo === 'erro'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-800';
  return (
    <div
      className={`fixed bottom-4 right-4 z-[110] flex max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg ${estilos}`}
      role={tipo === 'erro' ? 'alert' : 'status'}
    >
      <p className="text-sm font-medium">{mensagem}</p>
      <button
        type="button"
        onClick={aoFechar}
        className="ml-auto font-bold"
        aria-label="Fechar aviso"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
