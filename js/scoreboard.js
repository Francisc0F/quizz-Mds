let users = JSON.parse(localStorage.getItem('users'));
let finalScore = localStorage.getItem('finalScore');
let main = document.querySelector('main');
let container = document.querySelector('.scores');
let message = document.querySelector('.message');
let close = document.querySelector('.icon');
let paragraphs = document.querySelectorAll('.message .content p');
let messageContent = document.getElementById('messageDiv');

// Music
const cheeringsound = document.getElementById('cheering');
const failsound = document.getElementById('fail');

// Animations


close.addEventListener('click', closeMessage);

if (finalScore !== null) {
  container.style.display = 'none';
  playmusic();
  animationMain();
  animationMessage();
  if (finalScore >= 5) {
    paragraphs[0].textContent = `Your score is ${finalScore}/10  👍🏼`;
    paragraphs[0].style.color = 'green';
    paragraphs[1].textContent = `Good Job`;
  } else {
    paragraphs[0].textContent = `Your score is ${finalScore}/10  👎🏼`;
    paragraphs[0].style.color = 'red';
    paragraphs[1].textContent = `Try better`;
  }
  message.style.display = 'flex';
  localStorage.removeItem('finalScore');
} else {
  showScores();
}

function showScores() {
  animationMain();
  if (users) {
    users = users.sort((a, b) => b.score - a.score);
    users.forEach((e) => {
      let userDiv = document.createElement('div');
      container.appendChild(userDiv);

      let name = document.createElement('span');
      name.textContent = e.name;
      userDiv.appendChild(name);

      let score = document.createElement('span');
      score.textContent = e.score;
      userDiv.appendChild(score);
    });
  } else {
    let message = document.createElement('p');
    message.textContent = 'No Players Yet';
    container.textContent = '';
    container.appendChild(message);
  }
  container.style.display = 'block';
}

function closeMessage() {
  message.style.display = 'none';
  showScores();
}

function playmusic() {
  if (finalScore >= 5) {
    cheeringsound.play();
  } else {
    failsound.play();
  }
}

/* Animations */

function animationMessage() {
  messageContent.classList.add("animation");

  setTimeout(() => {
    messageContent.classList.remove("animation");
  }, 800);
}

function animationMain() {
  main.classList.add("animation2");

  setTimeout(() => {
    main.classList.remove("animation2");
  }, 400);
}