
import { getToken } from "./auth.js";
import { criarPlano } from "./planos.js";

export default function iniciarPlanejamento() {
  const objetivo = document.getElementById("objetivo");
  const modalidade = document.getElementById("modalidade");

  const botoesMaterias = document.querySelectorAll(".materia");
  const botoesDias = document.querySelectorAll(".dia");

  const tempo = document.getElementById("tempo");
  const tempoSelecionado = document.getElementById("tempoSelecionado");
  const dataExame = document.getElementById("dataExame");

  const botaoGerar = document.getElementById("gerarPlano");
  const modal = document.getElementById("modalPlano");
  const resultado = document.getElementById("resultadoPlano");
  const botaoSalvar = document.getElementById("confirmarPlano");

  if (!objetivo || !modalidade || !botaoGerar || !botaoSalvar) {
    console.error("Elementos do planejamento não encontrados.");
    return;
  }

  let materiasSelecionadas = [];
  let diasSelecionados = ["Seg", "Ter", "Qua", "Qui", "Sex"];
  let vestibularesSelecionados = [];

  // Opções disponíveis para cada objetivo.
  const opcoesPorObjetivo = {
    IFSP: [
      {
        id: "integrado",
        nome: "IFSP Integrado ao Ensino Médio"
      },
      {
        id: "concomitante",
        nome: "IFSP Concomitante e Subsequente"
      }
    ],

    ETEC: [
      {
        id: "etec",
        nome: "Vestibulinho ETEC"
      }
    ],

    FATEC: [
      {
        id: "fatec",
        nome: "Vestibular FATEC"
      }
    ],

    "Concurso público": [
      {
        id: "concurso",
        nome: "Concurso público"
      }
    ],

    Vestibular: [
      {
        id: "enem",
        nome: "ENEM"
      },
      {
        id: "outros",
        nome: "Outros vestibulares"
      }
    ]
  };

  // Matérias sugeridas para cada modalidade.
  const materiasPorModalidade = {
    integrado: [
      "Português",
      "Matemática"
    ],

    concomitante: [
      "Português",
      "Matemática"
    ],

    etec: [
      "Português",
      "Matemática",
      "História",
      "Geografia",
      "Biologia",
      "Física",
      "Química"
    ],

    fatec: [
      "Português",
      "Matemática",
      "Física",
      "Química",
      "Biologia",
      "História",
      "Geografia",
      "Redação"
    ],

    concurso: [
      "Português",
      "Matemática",
      "História",
      "Geografia"
    ],

    enem: [
      "Português",
      "Matemática",
      "Física",
      "Química",
      "Biologia",
      "História",
      "Geografia",
      "Redação"
    ],

    outros: [
      "Português",
      "Matemática",
      "Física",
      "Química",
      "Biologia",
      "História",
      "Geografia",
      "Redação"
    ]
  };

  const nomesModalidades = {
    integrado: "IFSP Integrado ao Ensino Médio",
    concomitante: "IFSP Concomitante e Subsequente",
    etec: "Vestibulinho ETEC",
    fatec: "Vestibular FATEC",
    concurso: "Concurso público",
    enem: "ENEM",
    outros: "Outros vestibulares"
  };

  // Atualiza a aparência de uma matéria.
  function atualizarVisualMateria(botao, selecionada) {
    botao.setAttribute("aria-pressed", String(selecionada));

    botao.classList.toggle("bg-emerald-500", selecionada);
    botao.classList.toggle("text-[#063b29]", selecionada);
    botao.classList.toggle("font-semibold", selecionada);

    botao.classList.toggle("bg-slate-50", !selecionada);
    botao.classList.toggle("border", !selecionada);
    botao.classList.toggle("border-slate-200", !selecionada);
    botao.classList.toggle("text-slate-600", !selecionada);
  }

  // Atualiza todas as matérias conforme a modalidade.
  function atualizarMateriasAutomaticamente() {
    const materias = materiasPorModalidade[
      vestibularesSelecionados[0]
    ] || [];

    materiasSelecionadas = [...materias];

    botoesMaterias.forEach(botao => {
      atualizarVisualMateria(
        botao,
        materiasSelecionadas.includes(botao.dataset.materia)
      );
    });

    atualizarIA();
  }

  // CAMPO 1: OBJETIVO.
  // CAMPO 2: OPÇÕES DEPENDENTES DO OBJETIVO.
  objetivo.addEventListener("change", () => {
    const objetivoEscolhido = objetivo.value;
    const opcoes = opcoesPorObjetivo[objetivoEscolhido] || [];

    modalidade.innerHTML = "";

    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = "Selecione uma modalidade";
    opcaoInicial.disabled = true;
    opcaoInicial.selected = true;

    modalidade.appendChild(opcaoInicial);
    modalidade.disabled = opcoes.length === 0;

    opcoes.forEach(opcao => {
      const elemento = document.createElement("option");
      elemento.value = opcao.id;
      elemento.textContent = opcao.nome;
      modalidade.appendChild(elemento);
    });

    vestibularesSelecionados = [];
    materiasSelecionadas = [];

    botoesMaterias.forEach(botao => {
      atualizarVisualMateria(botao, false);
    });

    atualizarIA();
  });

  // QUANDO ESCOLHER A MODALIDADE.
  modalidade.addEventListener("change", () => {
    vestibularesSelecionados = modalidade.value
      ? [modalidade.value]
      : [];

    atualizarMateriasAutomaticamente();
  });

  // PERMITE AJUSTAR AS MATÉRIAS MANUALMENTE.
  botoesMaterias.forEach(botao => {
    botao.addEventListener("click", () => {
      if (vestibularesSelecionados.length === 0) {
        alert("Primeiro escolha seu objetivo e sua modalidade.");
        return;
      }

      const materia = botao.dataset.materia;

      if (materiasSelecionadas.includes(materia)) {
        materiasSelecionadas = materiasSelecionadas.filter(
          item => item !== materia
        );
      } else {
        materiasSelecionadas.push(materia);
      }

      atualizarVisualMateria(
        botao,
        materiasSelecionadas.includes(materia)
      );

      atualizarIA();
    });
  });

  // TEMPO DISPONÍVEL.
  tempo.addEventListener("input", () => {
    const horas = Number(tempo.value);

    tempoSelecionado.textContent =
      `${horas} ${horas === 1 ? "hora" : "horas"} / dia selecionada${horas === 1 ? "" : "s"}`;

    atualizarIA();
  });

  // DIAS DA SEMANA.
  botoesDias.forEach(botao => {
    botao.addEventListener("click", () => {
      const dia = botao.dataset.dia;

      if (diasSelecionados.includes(dia)) {
        if (diasSelecionados.length === 1) {
          alert("Você precisa selecionar pelo menos um dia.");
          return;
        }

        diasSelecionados = diasSelecionados.filter(
          item => item !== dia
        );

        botao.classList.remove("bg-[#063b29]", "text-white");

        botao.classList.add(
          "bg-slate-50",
          "border",
          "border-slate-200",
          "text-slate-600"
        );
      } else {
        diasSelecionados.push(dia);

        botao.classList.remove(
          "bg-slate-50",
          "border",
          "border-slate-200",
          "text-slate-600"
        );

        botao.classList.add("bg-[#063b29]", "text-white");
      }

      botao.setAttribute(
        "aria-pressed",
        String(diasSelecionados.includes(dia))
      );

      atualizarIA();
    });
  });

  // ATUALIZAÇÃO DA ANÁLISE DA IA.
  function atualizarIA() {
    const horas = Number(tempo.value);

    const prioridadeMateria =
      document.getElementById("prioridadeMateria");

    const distribuicao =
      document.getElementById("distribuicao");

    const nivelDificuldade =
      document.getElementById("nivelDificuldade");

    const dicaIA =
      document.getElementById("dicaIA");

    if (materiasSelecionadas.length === 0) {
      prioridadeMateria.textContent =
        "Selecione uma modalidade";
    } else {
      prioridadeMateria.textContent =
        materiasSelecionadas.slice(0, 2).join(" & ") +
        (materiasSelecionadas.length > 2
          ? ` e mais ${materiasSelecionadas.length - 2}`
          : "");
    }

    if (horas <= 2) {
      distribuicao.textContent =
        "Priorizar teoria e exercícios essenciais.";

      nivelDificuldade.textContent =
        "Carga reduzida - focar nos conteúdos mais importantes.";
    } else if (horas <= 4) {
      distribuicao.textContent =
        "3 blocos de teoria e 2 de prática semanais.";

      nivelDificuldade.textContent =
        "Intermediário - equilibrar teoria e exercícios.";
    } else {
      distribuicao.textContent =
        "4 blocos de teoria e 3 de prática semanais.";

      nivelDificuldade.textContent =
        "Avançado - incluir revisões e simulados.";
    }

    if (
      !diasSelecionados.includes("Sáb") &&
      !diasSelecionados.includes("Dom")
    ) {
      dicaIA.textContent =
        "Dica da IA: mantenha o fim de semana livre para descansar e recuperar o conteúdo.";
    } else {
      dicaIA.textContent =
        "Dica da IA: faça revisões leves no fim de semana para reforçar o conteúdo.";
    }
  }

  // ESTRATÉGIA DO PLANO.
  function gerarEstrategia(horas) {
    if (horas <= 2) {
      return `
        Como seu tempo é limitado, o plano vai priorizar
        os assuntos mais importantes das matérias selecionadas,
        evitando sobrecarregar seus estudos.
      `;
    }

    if (horas <= 4) {
      return `
        Seu tempo permite equilibrar teoria, exercícios
        e revisões. A IA vai distribuir as matérias
        durante a semana para manter uma rotina sustentável.
      `;
    }

    return `
      Como você possui bastante tempo disponível,
      o plano poderá incluir teoria, exercícios,
      revisões espaçadas e simulados.
    `;
  }

  // GERAR PLANO.
  botaoGerar.addEventListener("click", () => {
    if (!objetivo.value) {
      alert("Selecione seu objetivo principal.");
      return;
    }

    if (vestibularesSelecionados.length === 0) {
      alert("Selecione uma modalidade.");
      return;
    }

    if (materiasSelecionadas.length === 0) {
      alert("Selecione pelo menos uma matéria.");
      return;
    }

    if (!dataExame.value) {
      alert("Escolha a data estimada do exame.");
      return;
    }

    const horas = Number(tempo.value);
    const modalidadeId = vestibularesSelecionados[0];

    const modalidadeNome =
      nomesModalidades[modalidadeId];

    resultado.innerHTML = `
      <div class="bg-slate-50 rounded-lg p-4">
        <p class="text-[9px] text-slate-400 uppercase font-bold">
          Objetivo
        </p>
        <p class="text-sm font-bold mt-1">
          ${objetivo.value}
        </p>
      </div>

      <div class="bg-slate-50 rounded-lg p-4">
        <p class="text-[9px] text-slate-400 uppercase font-bold">
          Modalidade escolhida
        </p>
        <p class="text-sm font-bold mt-1">
          ${modalidadeNome}
        </p>
      </div>

      <div class="bg-slate-50 rounded-lg p-4">
        <p class="text-[9px] text-slate-400 uppercase font-bold">
          Tempo diário
        </p>
        <p class="text-sm font-bold mt-1">
          ${horas} ${horas === 1 ? "hora" : "horas"} por dia
        </p>
      </div>

      <div class="bg-slate-50 rounded-lg p-4">
        <p class="text-[9px] text-slate-400 uppercase font-bold">
          Dias selecionados
        </p>
        <p class="text-sm font-bold mt-1">
          ${diasSelecionados.join(", ")}
        </p>
      </div>

      <div class="bg-slate-50 rounded-lg p-4">
        <p class="text-[9px] text-slate-400 uppercase font-bold">
          Matérias
        </p>
        <p class="text-sm font-bold mt-1">
          ${materiasSelecionadas.join(", ")}
        </p>
      </div>

      <div class="bg-emerald-50 rounded-lg p-4">
        <p class="text-[9px] text-emerald-600 uppercase font-bold">
          Estratégia da IA
        </p>
        <p class="text-xs text-slate-700 mt-2 leading-relaxed">
          ${gerarEstrategia(horas)}
        </p>
      </div>
    `;

    const mensagem =
      document.getElementById("mensagemPlanoSalvo");

    if (mensagem) mensagem.classList.add("hidden");

    botaoSalvar.disabled = false;
    botaoSalvar.textContent = "Salvar meu plano";
    botaoSalvar.classList.remove("opacity-60");

    const linkCronograma =
      document.getElementById("linkCronograma");

    if (linkCronograma) {
      linkCronograma.classList.add("hidden");
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  });

  // FECHAR MODAL.
  function fecharModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  document
    .getElementById("fecharModal")
    .addEventListener("click", fecharModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      fecharModal();
    }
  });

  // SALVAR PLANO.
  botaoSalvar.addEventListener("click", async evento => {
    const botao = evento.currentTarget;

    if (botao.disabled) return;

    botao.disabled = true;
    botao.textContent = "Salvando...";

    const plano = {
      objetivo: objetivo.value,
      vestibulares: [...vestibularesSelecionados],
      modalidade: vestibularesSelecionados[0],
      materias: [...materiasSelecionadas],
      horas: Number(tempo.value),
      dias: [...diasSelecionados],
      data: dataExame.value,
      planoConfigurado: true
    };

    localStorage.setItem(
      "planoCaraguaFuturo",
      JSON.stringify(plano)
    );

    window.dispatchEvent(new Event("planoAtualizado"));

    const mensagem =
      document.getElementById("mensagemPlanoSalvo");

    let texto =
      "Plano salvo neste navegador. Faça login para salvá-lo na sua conta.";

    if (getToken()) {
      try {
        await criarPlano(plano);

        texto =
          "Plano salvo na sua conta! Consulte também seu cronograma.";
      } catch (erro) {
        texto =
          `Plano salvo neste navegador, mas não foi possível salvar na conta: ${erro.message}`;
      }
    }

    if (mensagem) {
      mensagem.textContent = texto;
      mensagem.classList.remove("hidden");
    }

    botao.textContent = "Plano salvo ✓";
    botao.classList.add("opacity-60");

    const linkCronograma =
      document.getElementById("linkCronograma");

    if (linkCronograma) {
      linkCronograma.classList.remove("hidden");
    }
  });

  atualizarIA();
}
