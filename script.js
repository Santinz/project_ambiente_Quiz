// Background Dinâmico
const backgroundContainer = document.getElementById('background-container');
const backgroundImages = [
    'background-quiz/image1.jpg',
    'background-quiz/image2.jpg',
    'background-quiz/image3.jpg'
    // Adicione mais imagens conforme necessário
];

// Pré-carrega e exibe as imagens
backgroundImages.forEach((imgSrc, index) => {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = `Background ${index + 1}`;
    backgroundContainer.appendChild(img);
});

// Troca de imagem a cada 10s
let currentBgIndex = 0;
function changeBackground() {
    const images = document.querySelectorAll('#background-container img');
    images[currentBgIndex].classList.remove('active');
    
    currentBgIndex = (currentBgIndex + 1) % images.length;
    images[currentBgIndex].classList.add('active');
}

// Inicia o carrossel
document.querySelector('#background-container img').classList.add('active');
setInterval(changeBackground, 6000); // 10 segundos

const questions = [
    {
        question: "Qual é a principal causa do aquecimento global?",
        options: ["Desmatamento", "Emissão de gases do efeito estufa", "Poluição dos oceanos", "Uso de plásticos", "Energia nuclear"],
        answer: 1
    },
    {
        question: "Qual é o maior poluente dos oceanos?",
        options: ["Petróleo", "Plástico", "Metais pesados", "Resíduos industriais", "Esgoto"],
        answer: 1
    }
    // Adicione mais perguntas aqui...
];

let currentQuestion = 0;
let score = 0;
let startTime;
let userTime = [];
let username = "";

// Elementos de áudio
const clickSound = document.getElementById('click-sound');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

// Event Listeners
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('restart-btn').addEventListener('click', restartGame);

function startGame() {
    username = document.getElementById('username').value.trim();
    if (!username) {
        alert("Por favor, insira seu nome.");
        return;
    }
    playSound(clickSound);
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    startTime = new Date();
    loadQuestion();
}

function loadQuestion() {
    document.getElementById('next-btn').style.display = 'none';
    const question = questions[currentQuestion];
    document.getElementById('question').textContent = question.question;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => selectOption(index));
        optionsDiv.appendChild(button);
    });
}

function selectOption(index) {
    const question = questions[currentQuestion];
    const endTime = new Date();
    const timeSpent = (endTime - startTime) / 1000;
    const options = document.querySelectorAll('#options button');

    // Desabilita todos os botões
    options.forEach(btn => btn.disabled = true);

    if (index === question.answer) {
        playSound(correctSound);
        options[index].classList.add('correct-answer');
        score += Math.max(10 - timeSpent, 1); // Pontuação mínima: 1
    } else {
        playSound(wrongSound);
        options[index].classList.add('wrong-answer');
        options[question.answer].classList.add('correct-answer');
    }

    userTime.push(timeSpent);
    
    // Mostra o botão "Próxima" após 1s
    setTimeout(() => {
        document.getElementById('next-btn').style.display = 'block';
    }, 1000);
}

function nextQuestion() {
    playSound(clickSound);
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        startTime = new Date();
        loadQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    
    const totalScore = Math.max(score, 0);
    const correctAnswers = userTime.filter((_, idx) => 
        questions[idx].answer === idx
    ).length;

    document.getElementById('score').textContent = 
        `Você acertou ${correctAnswers} de ${questions.length} perguntas. Pontuação: ${totalScore.toFixed(1)}`;

    saveScore(username, totalScore);
    displayRanking();
}

function saveScore(name, score) {
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push({ name, score });
    ranking.sort((a, b) => b.score - a.score);
    localStorage.setItem('ranking', JSON.stringify(ranking));
}

function displayRanking() {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const podiumElements = [
        { name: document.querySelector('#first-place .ranking-name'), score: document.querySelector('#first-place .ranking-score') },
        { name: document.querySelector('#second-place .ranking-name'), score: document.querySelector('#second-place .ranking-score') },
        { name: document.querySelector('#third-place .ranking-name'), score: document.querySelector('#third-place .ranking-score') }
    ];

    // Preenche o pódio (top 3)
    for (let i = 0; i < 3; i++) {
        if (ranking[i]) {
            podiumElements[i].name.textContent = ranking[i].name;
            podiumElements[i].score.textContent = `${ranking[i].score.toFixed(1)} pts`;
        } else {
            podiumElements[i].name.textContent = "---";
            podiumElements[i].score.textContent = "0 pts";
        }
    }

    // Preenche o ranking (4º ao 10º)
    const rankingList = document.getElementById('ranking');
    rankingList.innerHTML = '';
    
    for (let i = 3; i < Math.min(ranking.length, 10); i++) {
        const li = document.createElement('li');
        li.textContent = `${i + 1}. ${ranking[i].name} - ${ranking[i].score.toFixed(1)} pts`;
        rankingList.appendChild(li);
    }
}

function restartGame() {
    playSound(clickSound);
    currentQuestion = 0;
    score = 0;
    userTime = [];
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
}