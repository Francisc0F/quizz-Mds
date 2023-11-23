const answersElems = document.querySelectorAll(".answers .answer");
const nextElem = document.querySelector(".next");
const questionsCountElem = document.querySelector("#questions-count");
let timerElem = document.querySelector(".timer");
const QUESTION_TIME = 20000;

let currentUser = "";
let questions = [];
let currentIndex = 0;
let correctAnswers = 0;
let counter = QUESTION_TIME;

// I need them to be global variables for the animation to work.

let questionImageElem = document.querySelector(".image img");
let questionElem = document.querySelector(".title-text");
const answerTextElems = document.querySelectorAll(".answers .answer .answer-text");

// Music
const backgroundMusicElem = document.getElementById("music");

fetchQuestions();
startmusic();

window.onload = () => {
  if (questions.length > 0) {
    questions = shuffleArray(questions);
    nextQuestion();
    coundDown();
    if (localStorage.getItem("user")) {
      currentUser = localStorage.getItem("user");
      document.querySelector(".nickname").innerHTML = `NickName: <span>${currentUser}</span>`;
    }

    answersElems.forEach((answerElem) => {
      answerElem.onclick = () => {
        answersElems.forEach((ele) => ele.classList.remove("checked"));
        answerElem.classList.add("checked");
        nextElem.removeAttribute("disabled");
      };
    });
  }
};

nextElem.onclick = () => {
  if (checkAnswer(currentIndex)) {
    correctAnswers = correctAnswers + 1;
  }
  currentIndex++;
  counter = QUESTION_TIME;
  nextQuestion();
};

function fetchQuestions() {
  questions = [
    {
      "id": 1,
      "question": "O que é teste no contexto de projetos ágeis?",
      "answer_1": "Teste é apenas uma tarefa opcional no final do desenvolvimento.",
      "answer_2": "Teste é o processo de encontrar bugs no código.",
      "answer_3": "Teste envolve a verificação contínua da qualidade do software durante todo o ciclo de vida do desenvolvimento.",
      "answer_4": "Teste é exclusivamente responsabilidade do cliente.",
      "correct_answer": 3,
      "image_url": "https://i.ibb.co/J2QLz5m/1.png"
    },
    {
      "id": 2,
      "question": "Quais são os benefícios do teste contínuo em projetos ágeis?",
      "answer_1": "Teste contínuo aumenta a carga de trabalho da equipe de desenvolvimento.",
      "answer_2": "Teste contínuo reduz a visibilidade do progresso do projeto.",
      "answer_3": "Teste contínuo identifica problemas mais cedo no ciclo de vida do desenvolvimento.",
      "answer_4": "Teste contínuo atrasa o processo de entrega do software.",
      "correct_answer": 3,
      "image_url": "https://i.ibb.co/J2QLz5m/2.png"
    },
    {
      "id": 3,
      "question": "Como o teste contínuo difere dos métodos tradicionais de teste?",
      "answer_1": "Teste contínuo ocorre apenas no final do desenvolvimento.",
      "answer_2": "Teste contínuo é uma abordagem manual, enquanto métodos tradicionais são automatizados.",
      "answer_3": "Teste contínuo é integrado ao processo de desenvolvimento e é realizado automaticamente.",
      "answer_4": "Teste contínuo não é relevante em projetos ágeis.",
      "correct_answer": 3,
      "image_url": "https://i.ibb.co/J2QLz5m/3.png"
    },
    {
      "id": 4,
      "question": "Quais são os princípios fundamentais da integração contínua?",
      "answer_1": "Integração contínua envolve a atualização do código apenas uma vez por semana.",
      "answer_2": "Integração contínua requer testes manuais extensivos.",
      "answer_3": "Integração contínua envolve a integração frequente de alterações no código e a execução automática de testes.",
      "answer_4": "Integração contínua é desnecessária em projetos ágeis.",
      "correct_answer": 3,
      "image_url": "https://i.ibb.co/J2QLz5m/4.png"
    },
    {
      "id": 5,
      "question": "Como a integração contínua contribui para a entrega contínua em projetos ágeis?",
      "answer_1": "Integração contínua atrasa o processo de entrega.",
      "answer_2": "Integração contínua reduz a automação de testes.",
      "answer_3": "Integração contínua garante que o código esteja sempre em um estado funcional e pronto para ser entregue.",
      "answer_4": "Integração contínua é útil apenas no final do ciclo de desenvolvimento.",
      "correct_answer": 3,
      "image_url": "https://i.ibb.co/J2QLz5m/5.png"
    }
  ];  
}

function nextQuestion() {
  animation();

  if (currentIndex >= questions.length) {
    storeResults();
    stopmusic();
    localStorage.setItem("finalScore", correctAnswers);

    location.href = "scorboard.html";
  } else {
    previewQuestionHTML(currentIndex);

    const answerCountElem = document.querySelector("#answers-count");
    questionsCountElem.innerHTML = questions.length;
    answerCountElem.innerHTML = currentIndex + 1;
    nextElem.setAttribute("disabled", "disabled");
  }
}

function previewQuestionHTML(index) {
  // Animated variables need to be declared globally to be used in my animations function.

  let question = questions[index];
  questionElem.innerHTML = question.question;
  questionImageElem.src = question.image_url;

  if (answersElems) {
    answerTextElems[0].innerHTML = question.answer_1;
    answerTextElems[1].innerHTML = question.answer_2;
    answerTextElems[2].innerHTML = question.answer_3;
    answerTextElems[3].innerHTML = question.answer_4;
  }
  document.querySelectorAll(".answer").forEach((answerElem) => answerElem.classList.remove("checked"));
}

function checkAnswer(index) {
  let question = questions[index];
  let checkedAnswerElem = document.querySelector(".answer.checked .answer-text");
  if (checkedAnswerElem) {
    let dataIndex = checkedAnswerElem.dataset.index;
    return dataIndex == question.correct_answer;
  }
}

function coundDown() {
  setInterval(() => {
    if (counter < 0) {
      if (checkAnswer(currentIndex)) {
        correctAnswers = correctAnswers + 1;
      }
      currentIndex++;
      nextQuestion(currentIndex);
      counter = QUESTION_TIME;
    }
    timerElem.innerHTML = counter / 1000;
    counter -= 1000;
  }, 1000);
}

function storeResults() {
  let users = [];
  if (localStorage.getItem("users")) {
    users = JSON.parse(localStorage.getItem("users"));
  }
  users.push({ name: currentUser, score: correctAnswers });
  localStorage.setItem("users", JSON.stringify(users));
}

function animation() {
  questionImageElem.classList.add("animation");
  questionElem.classList.add("animation");
  document.querySelectorAll(".answer-text").forEach((elem) => elem.classList.add("animation"));

  setTimeout(() => {
    questionImageElem.classList.remove("animation");
    questionElem.classList.remove("animation");
    answerTextElems.forEach((elem) => elem.classList.remove("animation"));
  }, 800);
}

function startmusic() {
  backgroundMusicElem.play();
}

function stopmusic() {
  backgroundMusicElem.pause();
  backgroundMusicElem.currentTime = 0;
}

function shuffleArray(arr) {
  let newArr = [];
  while (true) {
    let rand = Math.floor(Math.random() * arr.length);
    if (!newArr.includes(arr[rand])) {
      newArr.push(arr[rand]);
    }

    if (newArr.length == arr.length) {
      return newArr;
    }
  }
}
