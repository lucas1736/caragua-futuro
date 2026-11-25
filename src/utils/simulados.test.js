import { describe, expect, it } from 'vitest';
import { calcularResultado, embaralharQuestoes } from './simulados.js';

describe('funções dos simulados', () => {
  it('embaralha questões e alternativas sem perder o gabarito', () => {
    const questoes = Array.from({ length: 8 }, (_, indice) => ({
      id: indice,
      materia: 'Matemática',
      alternativas: ['A', 'B', 'C', 'D', 'E'],
      correta: indice % 5,
    }));
    let semente = 0;
    const aleatorio = () => ((semente++ * 17 + 31) % 101) / 101;

    const embaralhadas = embaralharQuestoes(questoes, aleatorio);

    expect(embaralhadas.map(({ id }) => id).sort((a, b) => a - b)).toEqual(
      questoes.map(({ id }) => id),
    );
    for (const questao of embaralhadas) {
      expect(questao.alternativas).toHaveLength(5);
      expect(new Set(questao.alternativas).size).toBe(5);
      expect(questao.alternativas[questao.correta]).toBe('ABCDE'[questao.id % 5]);
    }
  });

  it('calcula acertos e desempenho agregado por matéria', () => {
    const questoes = [
      { materia: 'Matemática', correta: 1 },
      { materia: 'Matemática', correta: 0 },
      { materia: 'Português', correta: 2 },
    ];

    expect(calcularResultado(questoes, [1, 1, 0])).toEqual({
      acertos: 1,
      total: 3,
      desempenhoMaterias: [
        { materia: 'Matemática', acertos: 1, total: 2 },
        { materia: 'Português', acertos: 0, total: 1 },
      ],
    });
  });
});
