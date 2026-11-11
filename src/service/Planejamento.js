import { getToken } from "./auth.js";
import { criarPlano } from "./planos.js";

// Roda toda vez que a página é montada (navegação sem recarregar).
export default function iniciarPlanejamento() {

// ==========================================
// PLANEJAMENTO - CARAGUÁ FUTURO
// ==========================================


// ==========================================
// MATÉRIAS
// ==========================================

const botoesMaterias = document.querySelectorAll(".materia");

let materiasSelecionadas = [
    "Matemática",
    "Português",
    "Biologia",
    "História",
    "Redação"
];


botoesMaterias.forEach(botao => {

    botao.addEventListener("click", () => {

        const materia = botao.dataset.materia;

        if (materiasSelecionadas.includes(materia)) {

            materiasSelecionadas =
                materiasSelecionadas.filter(
                    item => item !== materia
                );

            // aparência desativada

            botao.classList.remove(
                "bg-emerald-500",
                "text-[#063b29]",
                "font-semibold"
            );

            botao.classList.add(
                "bg-slate-50",
                "border",
                "border-slate-200",
                "text-slate-600"
            );

        } else {

            materiasSelecionadas.push(materia);

            // aparência ativada

            botao.classList.remove(
                "bg-slate-50",
                "border",
                "border-slate-200",
                "text-slate-600"
            );

            botao.classList.add(
                "bg-emerald-500",
                "text-[#063b29]",
                "font-semibold"
            );

        }


        atualizarIA();

    });

});



// ==========================================
// TEMPO DE ESTUDO
// ==========================================

const tempo = document.getElementById("tempo");

const tempoSelecionado =
    document.getElementById("tempoSelecionado");


tempo.addEventListener("input", () => {

    const horas = tempo.value;

    tempoSelecionado.textContent =
        `${horas} ${horas == 1 ? "hora" : "horas"} / dia selecionada${horas == 1 ? "" : "s"}`;

    atualizarIA();

});



// ==========================================
// DIAS DA SEMANA
// ==========================================

const botoesDias =
    document.querySelectorAll(".dia");


let diasSelecionados = [
    "Seg",
    "Ter",
    "Qua",
    "Qui",
    "Sex"
];


botoesDias.forEach(botao => {

    botao.addEventListener("click", () => {

        const dia = botao.dataset.dia;


        if (diasSelecionados.includes(dia)) {

            // não deixa ficar sem nenhum dia

            if (diasSelecionados.length === 1) {

                alert("Você precisa selecionar pelo menos um dia.");

                return;

            }


            diasSelecionados =
                diasSelecionados.filter(
                    item => item !== dia
                );


            botao.classList.remove(
                "bg-[#063b29]",
                "text-white"
            );

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

            botao.classList.add(
                "bg-[#063b29]",
                "text-white"
            );

        }


        atualizarIA();

    });

});



// ==========================================
// OBJETIVO
// ==========================================

const objetivo =
    document.getElementById("objetivo");


objetivo.addEventListener("change", () => {

    atualizarIA();

});



// ==========================================
// DATA
// ==========================================

const dataExame =
    document.getElementById("dataExame");


dataExame.addEventListener("change", () => {

    atualizarIA();

});



// ==========================================
// IA
// ==========================================

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


    // ----------------------------
    // MATÉRIAS
    // ----------------------------

    if (materiasSelecionadas.length === 0) {

        prioridadeMateria.textContent =
            "Nenhuma matéria selecionada";

    } else if (materiasSelecionadas.length === 1) {

        prioridadeMateria.textContent =
            materiasSelecionadas[0];

    } else {

        prioridadeMateria.textContent =
            materiasSelecionadas.slice(0, 2).join(" & ");

    }


    // ----------------------------
    // DISTRIBUIÇÃO
    // ----------------------------

    if (horas <= 2) {

        distribuicao.textContent =
            "Priorizar teoria e exercícios essenciais.";

    } else if (horas <= 4) {

        distribuicao.textContent =
            "3 blocos de teoria e 2 de prática semanais.";

    } else {

        distribuicao.textContent =
            "4 blocos de teoria e 3 de prática semanais.";

    }


    // ----------------------------
    // DIFICULDADE
    // ----------------------------

    if (horas <= 2) {

        nivelDificuldade.textContent =
            "Carga reduzida - focar nos conteúdos mais importantes.";

    } else if (horas <= 4) {

        nivelDificuldade.textContent =
            "Intermediário - equilibrar teoria e exercícios.";

    } else {

        nivelDificuldade.textContent =
            "Avançado - incluir revisões e simulados.";

    }


    // ----------------------------
    // DICA
    // ----------------------------

    if (!diasSelecionados.includes("Sáb") &&
        !diasSelecionados.includes("Dom")) {

        dicaIA.textContent =
            "Dica da IA: mantenha o fim de semana livre para descansar e recuperar o conteúdo.";

    } else {

        dicaIA.textContent =
            "Dica da IA: faça revisões leves no fim de semana para reforçar o conteúdo.";

    }

}



// ==========================================
// GERAR PLANO
// ==========================================

const botaoGerar =
    document.getElementById("gerarPlano");

const modal =
    document.getElementById("modalPlano");

const resultado =
    document.getElementById("resultadoPlano");


botaoGerar.addEventListener("click", () => {


    // validação

    if (materiasSelecionadas.length === 0) {

        alert("Selecione pelo menos uma matéria.");

        return;

    }


    if (!dataExame.value) {

        alert("Escolha a data estimada do exame.");

        return;

    }


    const horas = Number(tempo.value);

    const objetivoSelecionado =
        objetivo.value;


    // limpa resultado

    resultado.innerHTML = "";


    // informações principais

    resultado.innerHTML += `

        <div class="bg-slate-50 rounded-lg p-4">

            <p class="text-[9px] text-slate-400 uppercase font-bold">
                Objetivo
            </p>

            <p class="text-sm font-bold mt-1">
                ${objetivoSelecionado}
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


    // reseta estado de "plano salvo" de uma geração anterior

    const msgAnterior = document.getElementById("mensagemPlanoSalvo");
    if (msgAnterior) msgAnterior.classList.add("hidden");

    const btnSalvar = document.getElementById("confirmarPlano");
    if (btnSalvar) {
        btnSalvar.disabled = false;
        btnSalvar.textContent = "Salvar meu plano";
        btnSalvar.classList.remove("opacity-60");
    }

    const linkCron = document.getElementById("linkCronograma");
    if (linkCron) linkCron.classList.add("hidden");


    // mostra modal

    modal.classList.remove("hidden");

    modal.classList.add("flex");

});



// ==========================================
// ESTRATÉGIA
// ==========================================

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



// ==========================================
// FECHAR MODAL
// ==========================================

document
    .getElementById("fecharModal")
    .addEventListener("click", () => {

        modal.classList.add("hidden");
        modal.classList.remove("flex");

    });



// ==========================================
// CLICAR FORA DO MODAL
// ==========================================

modal.addEventListener("click", (event) => {

    if (event.target === modal) {

        modal.classList.add("hidden");
        modal.classList.remove("flex");

    }

});



// ==========================================
// SALVAR PLANO
// ==========================================

document
  .getElementById("confirmarPlano")
  .addEventListener("click", async (evento) => {
    const botaoSalvar = evento.currentTarget;
    if (botaoSalvar.disabled) return;

    botaoSalvar.disabled = true;
    botaoSalvar.textContent = "Salvando...";

    const plano = {
      objetivo: objetivo.value,
      materias: [...materiasSelecionadas],
      horas: Number(tempo.value),
      dias: [...diasSelecionados],
      data: dataExame.value
    };

    localStorage.setItem(
      "planoCaraguaFuturo",
      JSON.stringify(plano)
    );

    window.dispatchEvent(new Event("planoAtualizado"));

    const mensagem = document.getElementById("mensagemPlanoSalvo");

    let texto = "Plano salvo neste navegador. Faça login para salvá-lo na sua conta.";

    if (getToken()) {
      try {
        await criarPlano(plano);
        texto = "Plano salvo na sua conta! Veja em Meus Planos ou consulte o cronograma.";
      } catch (erro) {
        texto = `Plano salvo neste navegador, mas não foi possível salvar na conta: ${erro.message}`;
      }
    }

    if (mensagem) {
      mensagem.textContent = texto;
      mensagem.classList.remove("hidden");
    }

    botaoSalvar.textContent = "Plano salvo ✓";
    botaoSalvar.classList.add("opacity-60");

    const linkCronograma = document.getElementById("linkCronograma");
    if (linkCronograma) linkCronograma.classList.remove("hidden");
  });

// ==========================================
// INICIAR IA
// ==========================================

atualizarIA();
}
