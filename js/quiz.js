import {answersCollection, getUser} from "./index.js";
import {
    addDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


window.onload = () => {
    var questions = JSON.parse(localStorage.getItem('questions'));

    var answersElems = document.querySelectorAll(".answers .answer");
    var nextElem = document.querySelector(".next");
    var questionsCountElem = document.querySelector("#questions-count");

    let currentUser = "";
    let currentIndex = 0;
    let correctAnswers = 0;

    let questionElem = document.querySelector(".title-text");
    const answerTextElems = document.querySelectorAll(".answers .answer .answer-text");


    if (questions.length > 0) {
        questions = shuffleArray(questions);
        nextQuestion();
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

    nextElem.onclick = async () => {
        if (await checkAnswer(currentIndex)) {
            correctAnswers = correctAnswers + 1;
        }
        currentIndex++;
        nextQuestion();
    };


    function nextQuestion() {
        animation();

        if (currentIndex >= questions.length) {
            storeResults();
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

        if (answersElems) {
            answerTextElems[0].innerHTML = question.answer_1;
            answerTextElems[1].innerHTML = question.answer_2;
            answerTextElems[2].innerHTML = question.answer_3;
            answerTextElems[3].innerHTML = question.answer_4;
        }
        document.querySelectorAll(".answer").forEach((answerElem) => answerElem.classList.remove("checked"));
    }

    async function checkAnswer(index) {
        let question = questions[index];
        let checkedAnswerElem = document.querySelector(".answer.checked .answer-text");
        const answerText = checkedAnswerElem.textContent;
        if(question.question){
            const answer = {
                question: question.question,
                user: getUser(),
                timestamp: new Date().toISOString(),
                selectedIndex: checkedAnswerElem.dataset.index,
                selectedText: answerText,
                correct_answer: question.correct_answer,
                new_challenge_key: question.new_challenge_key
            };
            console.log('answer', answer);
            await addDoc(answersCollection, answer)
                .then((docRef) => {
                    console.log("Answer submitted successfully with ID: ", docRef.id);
                })
                .catch((error) => {
                    console.error("Error adding challenge: ", error);
                });
        }

        if (checkedAnswerElem) {
            let dataIndex = checkedAnswerElem.dataset.index;
            return dataIndex == question.correct_answer;
        }
    }

    function storeResults() {
        let users = [];
        if (localStorage.getItem("users")) {
            users = JSON.parse(localStorage.getItem("users"));
        }
        users.push({name: currentUser, score: correctAnswers});
        localStorage.setItem("users", JSON.stringify(users));
    }

    function animation() {
        questionElem.classList.add("animation");
        document.querySelectorAll(".answer-text").forEach((elem) => elem.classList.add("animation"));

        setTimeout(() => {
            questionElem.classList.remove("animation");
            answerTextElems.forEach((elem) => elem.classList.remove("animation"));
        }, 800);
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
};
