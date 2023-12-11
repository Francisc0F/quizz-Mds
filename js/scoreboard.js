import {
    answersCollection, getUser, getChallengeById, getCurrentChallenge, getFromUserAnswersForChallenge
} from "./index.js";

function goStart() {
    window.location.href = "./../index.html";
}

async function loadTable() {

    const current = getCurrentChallenge();

    const user = getUser();


    if (current?.id) {
        const challenge = (await getChallengeById(current?.id))[0];
        if (challenge) {
            console.log('challenge', challenge);
            console.log('stopped', challenge.stopped);
            console.log('show_answers', challenge.show_answers);
        }

        getFromUserAnswersForChallenge(current.id, 300, user).then(answers => {
            console.log('answers', answers);
            var correctCount = 0;
            for (var i = 0; i < answers.length; i++) {
                var isCorrect = answers[i].selectedText === answers[i].correct_answer;
                if (isCorrect) {
                    correctCount++;
                }
            }
            var totalQuestions = answers.length;
            // Display the count in a text
            var countText = "Number of correct answers: " + correctCount;
            var h1Element = document.getElementById("result");
            h1Element.textContent = countText + " out of " + totalQuestions;
            document.body.appendChild(h1Element);
            if (challenge) {
                displayTable(answers, challenge.show_answers)
            } else {
                displayTable(answers)
            }
        })
    } else {
        alert("You do not have a challenge selected please register");
        goStart();
    }
}

function showButton() {
    var button = document.getElementById('myButton');
    button.style.display = 'block';
  }

function displayTable(data, show_answers) {
    if(show_answers==true){
        showButton();
    }
    // Get the element where you want to append the table
    var tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = '';
    // Create a table element
    var table = document.createElement('table');

    // Create a header row
    var headerRow = table.insertRow();
    var columnsToShow = show_answers ? ["question", "correct_answer", "Correct or not"] : ['question'];
    columnsToShow.forEach(function (column) {
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(column));
        headerRow.appendChild(th);
    });

    // Create rows and cells with data
    for (var i = 0; i < data.length; i++) {
        var row = table.insertRow();
        columnsToShow.forEach(function (column) {
            var cell = row.insertCell();
            if (column === "Correct or not") {
                // Compare selectedText with correct_answer
                var isCorrect = data[i].selectedText === data[i].correct_answer;
                cell.className = isCorrect ? "correct" : "incorrect";
                cell.appendChild(document.createTextNode(isCorrect ? "Correct" : "Incorrect"));
            } else {
                cell.appendChild(document.createTextNode(data[i][column]));
            }
        });
    }

    // Append the table to the container
    tableContainer.appendChild(table);
}

(function () {

    let inter = setInterval(loadTable , 1000);

})()
