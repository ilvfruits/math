let questions = [];
let currentIndex = 0;

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const explanationEl = document.getElementById("explanation");
const nextBtn = document.getElementById("nextBtn");

// Get ?set=grade3
const params = new URLSearchParams(window.location.search);
const setName = params.get("set");

fetch(`data/${setName}.json`)
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion();
  })
  .catch(() => {
    questionEl.textContent = "❌ Question set not found.";
  });

function showQuestion() {
  const q = questions[currentIndex];
  questionEl.textContent = `Q${currentIndex + 1}. ${q.question}`;

  choicesEl.innerHTML = "";
  explanationEl.classList.add("hidden");
  nextBtn.classList.add("hidden");
  fillArea.classList.add("hidden");

  if (q.type === "mc") {
    showMultipleChoice(q);
  } else if (q.type === "fill") {
    showFillIn(q);
  }
}

const fillArea = document.getElementById("fillArea");
const fillInput = document.getElementById("fillInput");
const submitFill = document.getElementById("submitFill");

function showMultipleChoice(q) {
  q.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => selectMCAnswer(btn, index, q);
    choicesEl.appendChild(btn);
  });
}

function selectMCAnswer(button, index, q) {
  const buttons = choicesEl.querySelectorAll("button");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctIndex) btn.classList.add("correct");
    if (i === index && i !== q.correctIndex) btn.classList.add("wrong");
  });

  showExplanation(q);
}

function showFillIn(q) {
  fillArea.classList.remove("hidden");
  fillInput.value = "";
  fillInput.disabled = false;
  submitFill.disabled = false;

  submitFill.onclick = () => {
    const userAnswer = fillInput.value.trim().toLowerCase();
    const correctAnswer = q.answer.trim().toLowerCase();

    fillInput.disabled = true;
    submitFill.disabled = true;

    if (userAnswer === correctAnswer) {
      fillInput.style.borderColor = "#22c55e";
    } else {
      fillInput.style.borderColor = "#ef4444";
    }

    showExplanation(q);
  };
}

function showExplanation(q) {
  explanationEl.textContent = q.explanation;
  explanationEl.classList.remove("hidden");
  nextBtn.classList.remove("hidden");
}

function selectAnswer(button, index) {
  const q = questions[currentIndex];
  const buttons = choicesEl.querySelectorAll("button");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctIndex) btn.classList.add("correct");
    if (i === index && i !== q.correctIndex) btn.classList.add("wrong");
  });

  explanationEl.textContent = q.explanation;
  explanationEl.classList.remove("hidden");
  nextBtn.classList.remove("hidden");
}

nextBtn.onclick = () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    questionEl.textContent = "🎉 Quiz completed!";
    choicesEl.innerHTML = "";
    explanationEl.classList.add("hidden");
    nextBtn.classList.add("hidden");
  }
};

function goHome() {
  window.location.href = "index.html";
}

