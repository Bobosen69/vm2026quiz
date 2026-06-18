const quizOpenTime = new Date("2025-01-01T00:00:00+02:00").getTime();

setInterval(() => {
  const now = new Date().getTime();
  const distance = quizOpenTime - now;

  if (distance <= 0) {
    document.getElementById("countdownBox").style.display = "none";
    document.getElementById("passwordArea").style.display = "block";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById("countdown").innerHTML =
    `${days} dagar<br>${hours} timmar<br>${minutes} minuter<br>${seconds} sekunder`;
}, 1000);

     function checkPassword() {
  const password = document.getElementById("passwordInput").value;

  if (password === "sverige2026") {

    const fanfare = document.getElementById("fanfareSound");
    fanfare.play();

    const duration = 4000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 80,
        origin: { x: 0 }
      });

      confetti({
        particleCount: 4,
        angle: 120,
        spread: 80,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("quizContent").style.display = "block";

  } else {
    document.getElementById("error").textContent = "Fel lösenord!";
  }
}
const FORM_ENDPOINT = "https://formspree.io/f/xpqeojor";

const questions = [
  { question: "Skriv efternamnen på spelarna på bilden.", image: "Bergvall Isak Stroud.jpg", type: "text", answer: "Bergvall Isak Stroud" },
  { question: "Skriv efternamnen på spelarna på bilden.", image: "Lagerbielke Ayari Nilsson Lindelöf.jpg", type: "text", answer: "Lagerbielke Ayari Nilsson Lindelöf" },
  { question: "Skriv efternamnen på spelarna på bilden.", image: "Gyökeres Johansson Elanga.jpg", type: "text", answer: "Gyökeres Johansson Elanga" },
  { question: "Skriv efternamnen på spelarna på bilden.", image: "Widell Zetterström Gudmundsson Nygren.jpg", type: "text", answer: "Widell Zetterström Gudmundsson Nygren" },
  { question: "Skriv efternamnen på spelarna på bilden.", image: "Nordfeldt Svensson Starfelt.jpg", type: "text", answer: "Nordfeldt Svensson Starfelt" },
  { question: "Vem är kommentatorn förnamn och efternamn?", audio: "Arne Hegerfors.mp3", type: "text", answer: "Arne Hegerfors" },
  { question: "Vilken nationalsång spelas?", audio: "Argentina(1).mp3", type: "text", answer: "Argentina" },
  { question: "Vem är spelaren förnamn och efternamn?", audio: "Andreas Granqvist.mp3", type: "text", answer: "Andreas Granqvist" },
  { question: "Vilket land vann VM 2022?", options: ["Frankrike", "Argentina", "Brasilien", "Tyskland"], answer: "Argentina" },
  { question: "Hur många lag deltar i VM 2026?", options: ["32", "40", "48", "64"], answer: "48" },
  { question: "Vilka tre länder arrangerar VM 2026?", options: ["USA, Kanada och Mexiko", "Brasilien, Argentina och Chile", "Spanien, Portugal och Marocko", "England, Skottland och Wales"], answer: "USA, Kanada och Mexiko" },
  { question: "I vilket land spelades VM 2022?", options: ["Qatar", "Ryssland", "Brasilien", "USA"], answer: "Qatar" },
  { question: "Vilket land har vunnit flest VM-titlar?", options: ["Tyskland", "Argentina", "Italien", "Brasilien"], answer: "Brasilien" },
  { question: "Vilket land vann det första fotbolls-VM år 1930?", options: ["Argentina", "Uruguay", "Brasilien", "Italien"], answer: "Uruguay" },
  { question: "Hur många matcher spelas i VM 2026?", options: ["64", "80", "96", "104"], answer: "104" }
];

let currentQuestion = 0;
let score = 0;
let answered = false;
let playerName = "";
let answerLog = [];

const startBox = document.getElementById("startBox");
const quizBox = document.getElementById("quizBox");
const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");
const progressEl = document.getElementById("progress");
const questionImage = document.getElementById("questionImage");
const questionAudio = document.getElementById("questionAudio");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

startBtn.onclick = () => {
  playerName = playerNameInput.value.trim();
  if (playerName === "") {
    alert("Skriv ditt namn först.");
    return;
  }
  startBox.style.display = "none";
  quizBox.style.display = "block";
  showQuestion();
};

function normalizeAnswer(text) {
  return text.trim().toLowerCase()
    .replaceAll("+", " ")
    .replaceAll(",", " ")
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function showQuestion() {
  answered = false;
  feedbackEl.textContent = "";
  scoreEl.textContent = "";

  const q = questions[currentQuestion];
  progressEl.textContent = `Fråga ${currentQuestion + 1} av ${questions.length}`;
  questionEl.textContent = q.question;
  answersEl.innerHTML = "";

  if (q.image) {
    questionImage.src = q.image;
    questionImage.style.display = "block";
  } else {
    questionImage.style.display = "none";
  }

  if (q.audio) {
    questionAudio.src = q.audio;
    questionAudio.style.display = "block";
    questionAudio.currentTime = 0;
  } else {
    questionAudio.pause();
    questionAudio.removeAttribute("src");
    questionAudio.style.display = "none";
  }

  if (q.type === "text") showTextQuestion();
  else showMultipleChoiceQuestion(q);
}

function showMultipleChoiceQuestion(q) {
  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => checkMultipleChoiceAnswer(option);
    answersEl.appendChild(btn);
  });
}

function showTextQuestion() {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Skriv ditt svar här";

  const btn = document.createElement("button");
  btn.textContent = "Kontrollera";
  btn.onclick = () => checkTextAnswer(input.value);

  answersEl.appendChild(input);
  answersEl.appendChild(btn);
  input.focus();

  input.addEventListener("keydown", event => {
    if (event.key === "Enter") checkTextAnswer(input.value);
  });
}

function checkMultipleChoiceAnswer(selected) {
  if (answered) return;
  answered = true;

  const q = questions[currentQuestion];
  const isCorrect = selected === q.answer;
  if (isCorrect) score++;

  answerLog.push({
    fragaNummer: currentQuestion + 1,
    fraga: q.question,
    deltagarensSvar: selected,
    rattSvar: q.answer,
    resultat: isCorrect ? "Rätt" : "Fel"
  });

  feedbackEl.textContent = "Svar registrerat.";
  nextQuestion();
}

function checkTextAnswer(userAnswer) {
  if (answered) return;
  answered = true;

  const q = questions[currentQuestion];
  const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(q.answer);
  if (isCorrect) score++;

  answerLog.push({
    fragaNummer: currentQuestion + 1,
    fraga: q.question,
    deltagarensSvar: userAnswer,
    rattSvar: q.answer,
    resultat: isCorrect ? "Rätt" : "Fel"
  });

  feedbackEl.textContent = "Svar registrerat.";
  nextQuestion();
}

function nextQuestion() {
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) showQuestion();
    else showResult();
  }, 900);
}

function showResult() {
  progressEl.textContent = "";
  questionImage.style.display = "none";
  questionAudio.pause();
  questionAudio.style.display = "none";
  questionEl.textContent = "";

  answersEl.innerHTML = `
  <img src="vm-pokal.png" class="thank-you-image" alt="VM-pokal">
  <h2>Tack ${playerName} för din medverkan!</h2>
  <p>Resultatet har registrerats.</p>
`;

  feedbackEl.textContent = "";
  scoreEl.textContent = "";
  restartBtn.style.display = "none";

  sendResultByEmail();
}

function sendResultByEmail() {
  const svarSomText = answerLog.map(item =>
    `Fråga ${item.fragaNummer}: ${item.fraga}\n` +
    `Deltagarens svar: ${item.deltagarensSvar}\n` +
    `Rätt svar: ${item.rattSvar}\n` +
    `Resultat: ${item.resultat}`
  ).join("\n\n");

  fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      namn: playerName,
      poang: `${score} av ${questions.length}`,
      procent: `${Math.round((score / questions.length) * 100)}%`,
      datum: new Date().toLocaleString("sv-SE"),
      quiz: "VM 2026 Quiz",
      svar: svarSomText
    })
  }).catch(() => {
    console.log("Resultatet kunde inte skickas.");
  });
}

restartBtn.onclick = () => {
  currentQuestion = 0;
  score = 0;
  answerLog = [];
  restartBtn.style.display = "none";
  startBox.style.display = "block";
  quizBox.style.display = "none";
  playerNameInput.value = "";
  playerNameInput.focus();
};
