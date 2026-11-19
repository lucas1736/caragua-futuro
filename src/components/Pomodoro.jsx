import { useEffect, useState } from 'react';

// Pomodoro reutilizável: fica ativo apenas enquanto o simulado
// estiver sendo feito (não aparece na página de cronograma).
function Pomodoro({ compacto = false }) {
  const [modo, setModo] = useState('foco');
  const [segundos, setSegundos] = useState(25 * 60);
  const [executando, setExecutando] = useState(false);
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    if (!executando) return;

    if (segundos === 0) {
      setExecutando(false);

      if (modo === 'foco') {
        setModo('pausa');
        setSegundos(5 * 60);
        setAviso('Parabéns! Você concluiu 25 minutos de estudo. Hora de descansar!');
      } else {
        setModo('foco');
        setSegundos(25 * 60);
        setAviso('Pausa concluída! Você já pode começar outra sessão de estudos.');
      }

      return;
    }

    const intervalo = setTimeout(() => {
      setSegundos((atual) => atual - 1);
    }, 1000);

    return () => clearTimeout(intervalo);
  }, [executando, segundos, modo]);

  function iniciarPausar() {
    setAviso('');
    setExecutando((atual) => !atual);
  }

  function reiniciar() {
    setExecutando(false);
    setModo('foco');
    setSegundos(25 * 60);
    setAviso('');
  }

  const minutos = String(Math.floor(segundos / 60)).padStart(2, '0');
  const restante = String(segundos % 60).padStart(2, '0');

  if (compacto) {
    return (
      <div className="bg-[#063b29] text-white rounded-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="leading-tight">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-300">
              Pomodoro · {modo === 'foco' ? 'Foco' : 'Pausa'}
            </p>
            <p className="text-xl font-extrabold tabular-nums">
              {minutos}:{restante}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={iniciarPausar}
              className="bg-emerald-500 hover:bg-emerald-400 text-[#063b29] font-bold text-xs px-3 py-2 rounded-md transition"
            >
              {executando ? 'Pausar' : 'Iniciar'}
            </button>

            <button
              type="button"
              onClick={reiniciar}
              className="bg-white/10 hover:bg-white/20 font-semibold text-xs px-3 py-2 rounded-md transition"
            >
              Zerar
            </button>
          </div>
        </div>

        {aviso && (
          <p className="text-xs text-emerald-200 mt-2 leading-snug">
            {aviso}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#063b29] text-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-emerald-300 text-sm font-bold uppercase tracking-wide">
            Temporizador
          </p>
          <h3 className="font-bold text-xl mt-1">Pomodoro</h3>
        </div>
        <span className="text-3xl">⏱️</span>
      </div>

      <div className="text-center py-6">
        <p className="text-sm text-emerald-200 mb-2">
          {modo === 'foco' ? 'Tempo de concentração' : 'Hora de descansar'}
        </p>
        <p className="text-6xl font-extrabold tabular-nums tracking-wider">
          {minutos}:{restante}
        </p>
        <p className="text-sm text-gray-300 mt-3">
          {modo === 'foco' ? '25 minutos de foco' : '5 minutos de pausa'}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={iniciarPausar}
          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-[#063b29] font-bold py-3 rounded-lg transition"
        >
          {executando ? 'Pausar' : 'Iniciar'}
        </button>

        <button
          type="button"
          onClick={reiniciar}
          className="bg-white/10 hover:bg-white/20 px-5 py-3 rounded-lg font-semibold transition"
        >
          Reiniciar
        </button>
      </div>

      {aviso && (
        <p className="text-sm text-emerald-200 text-center mt-4 leading-relaxed">
          {aviso}
        </p>
      )}
    </div>
  );
}

export default Pomodoro;
