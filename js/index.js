let newUserInputBox = document.getElementById("nickname");
let howtoplaybutton = document.getElementById("howtoplay");
let xbutton = document.getElementById("xbutton");

newUserInputBox.onkeydown = (e) => {
  if (e.key === "Enter") start();
};

function start() {
  if (!newUserInputBox.value) {
    alert("Nickname is required.");
  } else {
    localStorage.setItem("user", newUserInputBox.value);
    maplink();
  }
}

function openhowtoplay() {
  howtoplaybutton.style.display = "flex";
}

function closehowtoplay() {
  howtoplaybutton.style.display = "none";
}

function scoreboardlink() {
  window.location.href = "./html/scorboard.html";
}

function maplink() {
  window.location.href = "./html/topics-map.html";
}
