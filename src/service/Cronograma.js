// =====================================================
// CARAGUÁ FUTURO
// CRONOGRAMA SEMANAL
// =====================================================


// =====================================================
// CONFIGURAÇÃO
// =====================================================

const dias = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo"
];


const horarios = [
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00"
];



// =====================================================
// ESTUDOS INICIAIS
// =====================================================

const estudosPadrao = [

    {
        dia: 0,
        horario: "08:00",
        materia: "Matemática",
        tipo: "Teoria",
        duracao: "1h 30m",
        cor: "orange"
    },

    {
        dia: 1,
        horario: "10:00",
        materia: "Português",
        tipo: "Gramática",
        duracao: "1h 30m",
        cor: "blue"
    },

    {
        dia: 2,
        horario: "08:00",
        materia: "Matemática",
        tipo: "Teoria",
        duracao: "1h 30m",
        cor: "orange"
    },

    {
        dia: 3,
        horario: "10:00",
        materia: "Física",
        tipo: "Teoria",
        duracao: "1h 30m",
        cor: "green"
    },

    {
        dia: 4,
        horario: "08:00",
        materia: "Biologia",
        tipo: "Teoria",
        duracao: "1h 30m",
        cor: "green"
    },

    {
        dia: 0,
        horario: "14:00",
        materia: "Redação",
        tipo: "Prática",
        duracao: "2h",
        cor: "blue"
    },

    {
        dia: 2,
        horario: "14:00",
        materia: "História",
        tipo: "Teoria",
        duracao: "2h",
        cor: "purple"
    },

    {
        dia: 1,
        horario: "16:00",
        materia: "Química",
        tipo: "Revisão",
        duracao: "1h",
        cor: "green"
    },

    {
        dia: 3,
        horario: "16:00",
        materia: "Geografia",
        tipo: "Teoria",
        duracao: "1h 30m",
        cor: "purple"
    },

    {
        dia: 4,
        horario: "14:00",
        materia: "Física",
        tipo: "Exercícios",
        duracao: "2h",
        cor: "green"
    }

];



// =====================================================
// CARREGAR ESTUDOS
// =====================================================

let estudos =
    JSON.parse(
        localStorage.getItem(
            "cronogramaCaraguaFuturo"
        )
    ) || estudosPadrao;



// =====================================================
// CORES
// =====================================================

const cores = {

    orange: {
        fundo: "bg-orange-50",
        borda: "border-orange-100",
        texto: "text-orange-600"
    },

    blue: {
        fundo: "bg-blue-50",
        borda: "border-blue-100",
        texto: "text-blue-600"
    },

    green: {
        fundo: "bg-emerald-50",
        borda: "border-emerald-100",
        texto: "text-emerald-600"
    },

    purple: {
        fundo: "bg-purple-50",
        borda: "border-purple-100",
        texto: "text-purple-600"
    }

};



// =====================================================
// DESENHAR CRONOGRAMA
// =====================================================

function criarCronograma() {

    const grade =
        document.getElementById(
            "gradeCronograma"
        );


    grade.innerHTML = "";


    horarios.forEach(horario => {


        const linha =
            document.createElement("div");


        linha.className =
            "grid grid-cols-[55px_repeat(7,1fr)] " +
            "min-h-[72px] border-t border-slate-100";


        // HORÁRIO

        const horarioDiv =
            document.createElement("div");


        horarioDiv.className =
            "text-[8px] text-slate-500 " +
            "p-2 border-r border-slate-100";


        horarioDiv.textContent =
            horario;


        linha.appendChild(
            horarioDiv
        );



        // DIAS

        for (
            let dia = 0;
            dia < 7;
            dia++
        ) {

            const celula =
                document.createElement("div");


            celula.className =
                "border-r border-slate-100 " +
                "p-1 relative";


            const estudo =
                estudos.find(item =>
                    item.dia === dia &&
                    item.horario === horario
                );


            if (estudo) {

                criarCardEstudo(
                    celula,
                    estudo
                );

            }


            linha.appendChild(
                celula
            );

        }


        grade.appendChild(
            linha
        );

    });

}



// =====================================================
// CRIAR CARD DE ESTUDO
// =====================================================

function criarCardEstudo(
    celula,
    estudo
) {

    const card =
        document.createElement("div");


    const cor =
        cores[estudo.cor] ||
        cores.green;


    card.className =
        `${cor.fundo}
         ${cor.borda}
         border
         rounded-md
         p-2
         h-full
         cursor-pointer
         hover:shadow-md
         transition`;


    card.innerHTML = `

        <p class="
            text-[8px]
            font-bold
            ${cor.texto}
        ">
            ${estudo.materia}
        </p>


        <p class="
            text-[7px]
            text-slate-500
            mt-1
        ">
            ${estudo.tipo}
        </p>


        <div class="
            flex
            justify-between
            items-center
            mt-2
        ">

            <span class="
                text-[7px]
                text-slate-400
            ">
                ${estudo.duracao}
            </span>

            <button
                class="excluirEstudo
                       text-[8px]
                       text-red-400
                       hover:text-red-600">

                ×

            </button>

        </div>
    `;


    // EXCLUIR

    card.querySelector(
        ".excluirEstudo"
    ).addEventListener(
        "click",
        event => {

            event.stopPropagation();

            removerEstudo(estudo);

        }
    );


    // CLICAR NO ESTUDO

    card.addEventListener(
        "click",
        () => {

            marcarEstudoConcluido(
                estudo
            );

        }
    );


    celula.appendChild(
        card
    );

}



// =====================================================
// REMOVER ESTUDO
// =====================================================

function removerEstudo(
    estudo
) {

    estudos =
        estudos.filter(
            item =>
                !(
                    item.dia === estudo.dia &&
                    item.horario === estudo.horario &&
                    item.materia === estudo.materia
                )
        );


    salvarCronograma();

    criarCronograma();

}



// =====================================================
// CONCLUIR ESTUDO
// =====================================================

function marcarEstudoConcluido(
    estudo
) {

    const confirmar =
        confirm(
            `Marcar ${estudo.materia} como estudado?`
        );


    if (!confirmar) {
        return;
    }


    let atividades =
        JSON.parse(
            localStorage.getItem(
                "atividadesCaraguaFuturo"
            )
        ) || [];


    atividades.unshift({

        nome:
            `${estudo.materia} estudado`,

        tempo:
            estudo.duracao,

        data:
            new Date().toLocaleDateString(
                "pt-BR"
            )

    });


    atividades =
        atividades.slice(
            0,
            10
        );


    localStorage.setItem(
        "atividadesCaraguaFuturo",
        JSON.stringify(
            atividades
        )
    );


    alert(
        `${estudo.materia} marcado como concluído!`
    );

}



// =====================================================
// SALVAR
// =====================================================

function salvarCronograma() {

    localStorage.setItem(
        "cronogramaCaraguaFuturo",
        JSON.stringify(
            estudos
        )
    );

}



// =====================================================
// MODAL
// =====================================================

const modal =
    document.getElementById(
        "modalAjustar"
    );


document.getElementById(
    "btnAjustar"
).addEventListener(
    "click",
    () => {

        modal.classList.remove(
            "hidden"
        );

        modal.classList.add(
            "flex"
        );

    }
);



document.getElementById(
    "btnFecharModal"
).addEventListener(
    "click",
    fecharModal
);



function fecharModal() {

    modal.classList.add(
        "hidden"
    );

    modal.classList.remove(
        "flex"
    );

}



// =====================================================
// ADICIONAR ESTUDO
// =====================================================

document.getElementById(
    "btnAdicionar"
).addEventListener(
    "click",
    () => {


        const materia =
            document.getElementById(
                "novaMateria"
            ).value;


        const dia =
            Number(
                document.getElementById(
                    "novoDia"
                ).value
            );


        const horario =
            document.getElementById(
                "novoHorario"
            ).value;



        // VERIFICAR SE JÁ EXISTE

        const ocupado =
            estudos.some(
                item =>
                    item.dia === dia &&
                    item.horario === horario
            );


        if (ocupado) {

            alert(
                "Esse horário já possui um estudo."
            );

            return;

        }



        // DEFINIR COR

        let cor = "green";


        if (
            materia === "Matemática"
        ) {

            cor = "orange";

        }

        else if (
            materia === "Português"
        ) {

            cor = "blue";

        }

        else if (
            materia === "História" ||
            materia === "Geografia"
        ) {

            cor = "purple";

        }



        estudos.push({

            dia,
            horario,
            materia,
            tipo: "Teoria",
            duracao: "1h 30m",
            cor

        });


        salvarCronograma();

        criarCronograma();

        fecharModal();

    }
);



// =====================================================
// PRIORIDADES
// =====================================================

const prioridades =
    document.querySelectorAll(
        ".prioridade"
    );


prioridades.forEach(
    checkbox => {

        checkbox.addEventListener(
            "change",
            atualizarPrioridades
        );

    }
);



function atualizarPrioridades() {

    const total =
        prioridades.length;


    const concluidas =
        [...prioridades]
            .filter(
                checkbox =>
                    checkbox.checked
            )
            .length;


    const restantes =
        total - concluidas;


    document.getElementById(
        "contadorAlertas"
    ).textContent =
        `${restantes} Ativos`;

}



// =====================================================
// EXPORTAR PDF
// =====================================================

document.getElementById(
    "btnExportar"
).addEventListener(
    "click",
    () => {

        window.print();

    }
);



// =====================================================
// COMPARTILHAR
// =====================================================

document.getElementById(
    "btnCompartilhar"
).addEventListener(
    "click",
    async () => {


        const dados = {

            title:
                "Meu Cronograma - Caraguá Futuro",

            text:
                "Confira meu cronograma semanal de estudos!",

            url:
                window.location.href

        };


        try {

            if (
                navigator.share
            ) {

                await navigator.share(
                    dados
                );

            }

            else {

                await navigator.clipboard.writeText(
                    window.location.href
                );


                alert(
                    "Link copiado para a área de transferência!"
                );

            }

        }

        catch (erro) {

            console.log(
                "Compartilhamento cancelado."
            );

        }

    }
);



// =====================================================
// POMODORO
// =====================================================

let tempo =
    25 * 60;

let intervalo =
    null;


const btnPomodoro =
    document.getElementById(
        "btnPomodoro"
    );


const timer =
    document.getElementById(
        "timerPomodoro"
    );



btnPomodoro.addEventListener(
    "click",
    () => {


        if (intervalo) {

            clearInterval(
                intervalo
            );

            intervalo = null;

            btnPomodoro.textContent =
                "Continuar Pomodoro";

            return;

        }


        timer.classList.remove(
            "hidden"
        );


        btnPomodoro.textContent =
            "Pausar Pomodoro";


        intervalo =
            setInterval(
                () => {

                    tempo--;


                    atualizarTimer();


                    if (
                        tempo <= 0
                    ) {

                        clearInterval(
                            intervalo
                        );

                        intervalo = null;

                        alert(
                            "Pomodoro concluído! Faça uma pausa de 5 minutos."
                        );

                        tempo =
                            25 * 60;

                        atualizarTimer();

                        btnPomodoro.textContent =
                            "Iniciar Pomodoro";

                    }

                },
                1000
            );

    }
);



// =====================================================
// ATUALIZAR TIMER
// =====================================================

function atualizarTimer() {

    const minutos =
        Math.floor(
            tempo / 60
        );


    const segundos =
        tempo % 60;


    timer.textContent =
        `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;

}




    }
);



// =====================================================
// INICIALIZAR
// =====================================================

criarCronograma();

salvarCronograma();