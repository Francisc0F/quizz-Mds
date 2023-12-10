import {
    addDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import {challengesCollection, questionsCollection, getChallenges, updateChallenge, deleteChallenge} from "./index.js";


window.onload = () => {
    setChallengeText();

    let interval = setInterval(updateTable, 2000);
}


let list = [];

function updateTable() {
    getChallenges(10).then(challenges => {
        list = challenges;
        createTableRows(challenges)
    });
}


const createTableRows = (challenges) => {
    const tableBody = document.getElementById('challenge-list'); // Replace with your actual table body ID

    // Clear existing rows
    tableBody.innerHTML = '';

    // Create new rows
    challenges.forEach((challenge, index) => {
        const row = document.createElement('tr');

        // Assuming each challenge has properties like 'name', 'description', etc.
        // Adjust this part based on your challenge structure
        row.innerHTML = `
      <td>${challenge.title}</td>
      <td>${challenge.timestamp}</td>
      <td >
      
      <div class="d-flex">
          ${!challenge.stopped ? `<button class="btn btn-stop" onclick="stopChallenge(${index}, this.parentNode.parentNode)">Stop Challenge</button>` : ''}
              ${!challenge.show_results ? `<button class="btn btn-results" onclick="showResults(${index}, this.parentNode.parentNode)">Show Results</button>` : ''}
            <button class="btn btn-delete" onclick="onDeleteChallenge(${index})">Delete Challenge</button>
            </div>
        <!-- Add more buttons or customize as needed -->
      </td>
    `;
        tableBody.appendChild(row);
    });
}
function onDeleteChallenge(index) {
    let challenge = list[index];
    list.splice(index, 1);
    createTableRows(list);
    deleteChallenge(challenge.id, challenge).then(() => {
    }, err => {
        console.log('could not delete');
    })
}




function stopChallenge(index, row) {
    let challenge = list[index];
    challenge.stopped = true;
    updateChallenge(challenge.id, challenge).then(r => {
        row.classList.add('stopped');
    }, err => {
        console.log('could not update');
    })
}

function showResults(index, row) {
    let challenge = list[index];
    challenge.show_results = true;
    updateChallenge(challenge.id, challenge).then(r => {
        row.classList.add('show-results');
    }, err => {
        console.log('could not update');
    })
}

function addQuestionToChallenge(title, id) {
    // Push a new challenge to the "challenges" node

    var challengeText = document.getElementById('challengeText').value;
    // Parse the JSON string into an array of questions
    console.log('challengeText', challengeText);
    var questionsArray = JSON.parse(challengeText);

    // Loop through the array and push each question to the "questions" node
    questionsArray.forEach(function (question) {
        addDoc(questionsCollection, {
            question: question.question,
            answer_1: question.answer_1,
            answer_2: question.answer_2,
            answer_3: question.answer_3,
            answer_4: question.answer_4,
            correct_answer: question.correct_answer,
            new_challenge_key: id
        })
            .then((docRef) => {
                console.log("Question submitted successfully with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding challenge: ", error);
            });
    });
}

export function startChallenge() {
    // Get values from the form
    var title = document.getElementById('title').value;


    // Create a data object for the challenge
    const challengeData = {
        title: title,
        timestamp: new Date().toISOString()
    };

    addDoc(challengesCollection, challengeData)
        .then((docRef) => {
            console.log("Challenge submitted successfully with ID: ", docRef.id);
            addQuestionToChallenge(title, docRef.id);
        })
        .catch((error) => {
            console.error("Error adding challenge: ", error);
        });
    // Create a reference to the "challenges" node in the database

    // Add any additional logic you want to perform after creating the challenge
}

function setChallengeText() {
    const initialQuestions = [
        {
            "id": 1,
            "question": "Qual é o objetivo do Lean Systems Engineering?",
            "answer_1": " Maximizar o desperdício",
            "answer_2": " Minimizar o desperdício",
            "answer_3": " Aumentar a complexidade",
            "answer_4": " Ignorar a eficiência",
            "correct_answer": " Minimizar o desperdício"
        },
        {
            "id": 2,
            "question": "Qual é uma das principais ferramentas usadas no Lean Systems Engineering?",
            "answer_1": " Análise SWOT",
            "answer_2": " Kanban",
            "answer_3": " Six Sigma",
            "answer_4": " Análise de mercado",
            "correct_answer": " Kanban"
        },
        {
            "id": 3,
            "question": "O que significa \"Kaizen\" no contexto do Lean Systems Engineering?",
            "answer_1": " Melhoria contínua",
            "answer_2": " Manutenção do status quo",
            "answer_3": " Inovação radical",
            "answer_4": " Padronização de processos",
            "correct_answer": " Melhoria contínua"
        },
        {
            "id": 4,
            "question": "Qual é a abordagem central do Lean Systems Engineering em relação aos processos?",
            "answer_1": " Aumentar a complexidade",
            "answer_2": " Reduzir a eficiência",
            "answer_3": " Eliminar o desperdício",
            "answer_4": " Aumentar a burocracia",
            "correct_answer": " Eliminar o desperdício"
        },
        {
            "id": 5,
            "question": "Quais são os princípios fundamentais do Lean Systems Engineering?",
            "answer_1": " Previsibilidade e desperdício",
            "answer_2": " Flexibilidade e padronização",
            "answer_3": " Eficiência e complexidade",
            "answer_4": " Valor e desperdício",
            "correct_answer": " Valor e desperdício"
        },
        {
            "id": 6,
            "question": "Qual é o papel do \"Kanban\" no Lean Systems Engineering?",
            "answer_1": " Limitar o trabalho em progresso",
            "answer_2": " Aumentar a sobrecarga",
            "answer_3": " Ignorar os gargalos",
            "answer_4": " Aumentar a complexidade",
            "correct_answer": " Limitar o trabalho em progresso"
        },
        {
            "id": 7,
            "question": "O que significa \"Muda\" no contexto do Lean Systems Engineering?",
            "answer_1": " Desperdício",
            "answer_2": " Eficiência",
            "answer_3": " Inovação",
            "answer_4": " Burocracia",
            "correct_answer": " Desperdício"
        },
        {
            "id": 8,
            "question": "Qual é o objetivo do \"Andon\" no Lean Systems Engineering?",
            "answer_1": " Ocultar problemas",
            "answer_2": " Sinalizar problemas imediatamente",
            "answer_3": " Aumentar a burocracia",
            "answer_4": " Ignorar problemas",
            "correct_answer": " Sinalizar problemas imediatamente"
        },
        {
            "id": 9,
            "question": "Como o Lean Systems Engineering aborda a melhoria contínua?",
            "answer_1": " Como um evento pontual",
            "answer_2": " Como um processo contínuo",
            "answer_3": " Ignorando a necessidade de melhoria",
            "answer_4": " Focando apenas em inovação radical",
            "correct_answer": " Como um processo contínuo"
        },
        {
            "id": 10,
            "question": "Qual é o papel do \"Gemba\" no Lean Systems Engineering?",
            "answer_1": " Focar apenas em análises teóricas",
            "answer_2": " Ir ao local de trabalho para entender os processos",
            "answer_3": " Ignorar a realidade do trabalho",
            "answer_4": " Centralizar as decisões na gestão",
            "correct_answer": " Ir ao local de trabalho para entender os processos"
        },
        {
            "id": 11,
            "question": "O que significa \"Heijunka\" no contexto do Lean Systems Engineering?",
            "answer_1": " Produção irregular",
            "answer_2": " Produção padronizada",
            "answer_3": " Aumento do estoque",
            "answer_4": " Ignorar a demanda do cliente",
            "correct_answer": " Produção padronizada"
        },
        {
            "id": 12,
            "question": "Qual é a atitude do Lean Systems Engineering em relação ao estoque?",
            "answer_1": " Aumentar o estoque para garantir disponibilidade imediata",
            "answer_2": " Minimizar o estoque para expor problemas",
            "answer_3": " Ignorar o impacto do estoque nos processos",
            "answer_4": " Aumentar o estoque para reduzir a variabilidade",
            "correct_answer": " Minimizar o estoque para expor problemas"
        },
        {
            "id": 13,
            "question": "Como o Lean Systems Engineering aborda a variabilidade nos processos?",
            "answer_1": " Aumentando a variabilidade para permitir mais opções",
            "answer_2": " Minimizando a variabilidade para aumentar a previsibilidade",
            "answer_3": " Ignorando a variabilidade",
            "answer_4": " Focando apenas na eficiência",
            "correct_answer": " Minimizando a variabilidade para aumentar a previsibilidade"
        },
        {
            "id": 14,
            "question": "Qual é o objetivo do \"5S\" no Lean Systems Engineering?",
            "answer_1": " Aumentar a bagunça e a desorganização",
            "answer_2": " Padronizar o local de trabalho",
            "answer_3": " Ignorar a importância do ambiente de trabalho",
            "answer_4": " Aumentar a complexidade do ambiente de trabalho",
            "correct_answer": " Padronizar o local de trabalho"
        },
        {
            "id": 15,
            "question": "Como o Lean Systems Engineering aborda a gestão de qualidade?",
            "answer_1": " Como uma responsabilidade exclusiva do departamento de qualidade",
            "answer_2": " Como uma responsabilidade de todos os envolvidos no processo",
            "answer_3": " Ignorando a importância da qualidade",
            "answer_4": " Focando apenas na produtividade",
            "correct_answer": " Como uma responsabilidade de todos os envolvidos no processo"
        }
    ];
    var textarea = document.getElementById("challengeText");
    // Stringify the JSON array and set it as the initial value
    textarea.value = JSON.stringify(initialQuestions, null, 2);
}

window.startChallenge = startChallenge;
window.stopChallenge = stopChallenge;
window.showResults = showResults;
window.onDeleteChallenge = onDeleteChallenge;