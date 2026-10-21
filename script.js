
const questions = [
  {
    category: "Science",
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: 1
  },
  {
    category: "General Knowledge",
    question: "What is the capital of Japan?",
    options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
    answer: 2
  },
  {
    category: "Mathematics",
    question: "What is 12 × 8?",
    options: ["84", "96", "88", "108"],
    answer: 1
  },
  {
    category: "Programming",
    question: "Which language is used to add interactivity to web pages?",
    options: ["HTML", "CSS", "JavaScript", "SQL"],
    answer: 2
  },
  {
    category: "Science",
    question: "Which gas do plants absorb during photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Hydrogen", "Carbon dioxide"],
    answer: 3
  },
  {
    category: "Geography",
    question: "Which is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
    answer: 2
  },
  {
    category: "Computers",
    question: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Personal Unit",
      "Central Program Utility",
      "Control Processing User"
    ],
    answer: 0
  },
  {
    category: "Mathematics",
    question: "What is the square root of 144?",
    options: ["10", "11", "12", "14"],
    answer: 2
  },
  {
    category: "General Knowledge",
    question: "How many days are there in a leap year?",
    options: ["364", "365", "366", "367"],
    answer: 2
  },
  {
    category: "Science",
    question: "Which part of the human body pumps blood?",
    options: ["Lungs", "Brain", "Liver", "Heart"],
    answer: 3
  }
];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");

const questionCount = document.getElementById("question-count");
const timerElement = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const categoryElement = document.getElementById("category");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options");
const feedbackElement = document.getElementById("feedback");

const resultIcon = document.getElementById("result-icon");
const resultTitle = document.getElementById("result-title");
const resultMessage = document.getElementById("result-message");
const finalScore = document.getElementById("final-score");
const accuracyElement = document.getElementById("accuracy");

const TIME_PER_QUESTION = 15;

let currentQuestion = 0;
let score = 0;
let timeLeft = TIME_PER_QUESTION;
let timerId = null;
let answered = false;

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function startQuiz() {
  stopTimer();

  currentQuestion = 0;
  score = 0;
  answered = false;

  startScreen.hidden = true;
  resultScreen.hidden = true;
  quizScreen.hidden = false;

  showQuestion();
}

function showQuestion() {
  stopTimer();
  answered = false;
  timeLeft = TIME_PER_QUESTION;

  const current = questions[currentQuestion];

  questionCount.textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  progressBar.style.width =
    `${(currentQuestion / questions.length) * 100}%`;

  categoryElement.textContent = current.category;
  questionText.textContent = current.question;

  optionsContainer.replaceChildren();
  feedbackElement.textContent = "";
  feedbackElement.className = "feedback";

  nextButton.disabled = true;
  nextButton.textContent =
    currentQuestion === questions.length - 1
      ? "See Results →"
      : "Next Question →";

  current.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";

    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = String.fromCharCode(65 + index);

    const text = document.createElement("span");
    text.textContent = option;

    button.append(letter, text);
    button.addEventListener("click", () => selectAnswer(index));

    optionsContainer.appendChild(button);
  });

  updateTimerDisplay();
  timerId = setInterval(tickTimer, 1000);
}

function updateTimerDisplay() {
  timerElement.textContent = `${timeLeft}s`;
  timerElement.classList.toggle("warning", timeLeft <= 5);
}

function tickTimer() {
  timeLeft--;
  updateTimerDisplay();

  if (timeLeft <= 0) {
    stopTimer();
    revealAnswer(null);
  }
}

function selectAnswer(selectedIndex) {
  if (answered) return;

  stopTimer();
  revealAnswer(selectedIndex);
}

function revealAnswer(selectedIndex) {
  if (answered) return;

  answered = true;

  const current = questions[currentQuestion];
  const buttons = optionsContainer.querySelectorAll(".option-btn");
  const isCorrect = selectedIndex === current.answer;

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === current.answer) {
      button.classList.add("correct");
    } else if (index === selectedIndex) {
      button.classList.add("wrong");
    }
  });

  if (isCorrect) {
    score++;
    feedbackElement.textContent = "✓ Correct answer! Well done.";
    feedbackElement.className = "feedback success";
  } else if (selectedIndex === null) {
    feedbackElement.textContent =
      `⏰ Time is up! Correct answer: ${current.options[current.answer]}`;
    feedbackElement.className = "feedback error";
  } else {
    feedbackElement.textContent =
      `✗ Incorrect. Correct answer: ${current.options[current.answer]}`;
    feedbackElement.className = "feedback error";
  }

  progressBar.style.width =
    `${((currentQuestion + 1) / questions.length) * 100}%`;

  nextButton.disabled = false;
}

function goToNextQuestion() {
  if (!answered) return;

  currentQuestion++;

  if (currentQuestion >= questions.length) {
    showResults();
  } else {
    showQuestion();
  }
}

function showResults() {
  stopTimer();
  quizScreen.hidden = true;
  resultScreen.hidden = false;

  const percentage = Math.round((score / questions.length) * 100);

  finalScore.textContent = `${score}/${questions.length}`;
  accuracyElement.textContent = `Accuracy: ${percentage}%`;

  if (percentage >= 80) {
    resultIcon.textContent = "🏆";
    resultTitle.textContent = "Excellent Work!";
    resultMessage.textContent = "Amazing! You have a great knowledge base.";
  } else if (percentage >= 50) {
    resultIcon.textContent = "🎉";
    resultTitle.textContent = "Good Job!";
    resultMessage.textContent = "Nice effort! Keep learning and try again.";
  } else {
    resultIcon.textContent = "💪";
    resultTitle.textContent = "Keep Practising!";
    resultMessage.textContent = "Every attempt helps you learn something new.";
  }
}

startButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", goToNextQuestion);
restartButton.addEventListener("click", startQuiz);
