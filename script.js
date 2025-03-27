// Background Dinâmico
const backgroundContainer = document.getElementById('background-container');
const backgroundImages = [
    'background-quiz/image1.jpg',
    'background-quiz/image2.jpg',
    'background-quiz/image3.jpg'
];

// Pré-carrega e exibe as imagens
backgroundImages.forEach((imgSrc, index) => {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = `Background ${index + 1}`;
    backgroundContainer.appendChild(img);
});

// Troca de imagem a cada 6 segundos
let currentBgIndex = 0;
function changeBackground() {
    const images = document.querySelectorAll('#background-container img');
    images[currentBgIndex].classList.remove('active');
    currentBgIndex = (currentBgIndex + 1) % images.length;
    images[currentBgIndex].classList.add('active');
}

// Inicia o carrossel
document.querySelector('#background-container img').classList.add('active');
setInterval(changeBackground, 6000);

// Perguntas do Quiz
const questions = [
    {
       question: "Qual é a principal causa do aquecimento global?",
options: ["Desmatamento", "Emissão de gases do efeito estufa", "Poluição dos oceanos", "Uso de plásticos", "Energia nuclear"],
answer: 1
},
{
question: "Qual dessas fontes de energia é considerada renovável?",
options: ["Carvão mineral", "Petróleo", "Energia eólica", "Gás natural", "Energia nuclear"],
answer: 2
},

{
question: "Qual é o maior impacto do desmatamento na Amazônia?",
options: ["Aumento do turismo", "Perda de biodiversidade", "Redução da poluição do ar", "Aumento da produção de oxigênio", "Diminuição das chuvas"],
answer: 1
},
{
question: "Qual desses materiais leva mais tempo para se decompor na natureza?",
options: ["Casca de banana", "Papel", "Vidro", "Folhas secas", "Jornal"],
answer: 2
},
{
question: "O que é a 'pegada de carbono'?",
options: ["A quantidade de carbono em florestas", "A emissão de gases poluentes por uma pessoa ou organização", "O nível de CO2 nos oceanos", "A produção de carbono em usinas nucleares", "O consumo de carbono na alimentação"],
answer: 1
},

{
question: "Qual prática ajuda a reduzir o lixo plástico nos oceanos?",
options: ["Aumentar o uso de plástico descartável", "Reciclagem e uso de materiais biodegradáveis", "Queimar plásticos no lixo comum", "Despejar lixo em rios", "Ignorar políticas ambientais"],
answer: 1
},

{
question: "O que é o efeito estufa?",
options: ["Um fenômeno que resfria a Terra", "Um processo natural que mantém o calor na atmosfera", "Uma camada de poluição sobre as cidades", "Um tipo de poluição luminosa", "Um fenômeno que destrói a camada de ozônio"],
answer: 1
},

{
question: "Qual animal é um importante indicador da saúde dos ecossistemas aquáticos?",
options: ["Girafa", "Tubarão", "Abelha", "Sapo", "Elefante"],
answer: 3
},

{
question: "O que significa 'desenvolvimento sustentável'?",
options: ["Crescimento econômico a qualquer custo", "Uso de recursos naturais sem preocupação com o futuro", "Atender às necessidades atuais sem comprometer as gerações futuras", "Expansão urbana descontrolada", "Industrialização acelerada"],
answer: 2
},

{
question: "Qual é a principal consequência do derretimento das calotas polares?",
options: ["Aumento do nível dos oceanos", "Redução da temperatura global", "Aumento da biodiversidade marinha", "Diminuição das chuvas", "Extinção do efeito estufa"],
answer: 0
}    // Adicione mais perguntas aqui...
];

// Variáveis do jogo
let currentQuestion = 0;
let score = 0;
let startTime;
let userTime = [];
let username = "";
let correctAnswersList = []; // Novo array para rastrear acertos

// Elementos de áudio
const clickSound = document.getElementById('click-sound');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

// Event Listeners
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('restart-btn').addEventListener('click', restartGame);

// Funções do jogo
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

    // Verifica se acertou e registra
    const isCorrect = (index === question.answer);
    correctAnswersList[currentQuestion] = isCorrect;

    if (isCorrect) {
        playSound(correctSound);
        options[index].classList.add('correct-answer');
        // Nova fórmula de pontuação:
        const basePoints = 15; // Peso maior para acertos
        const speedBonus = Math.max(0, 5 - (timeSpent / 2)); // Bônus por velocidade (0-5 pontos)
        score += basePoints + speedBonus;
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
    
    const totalCorrect = correctAnswersList.filter(Boolean).length;
    const averageTime = (userTime.reduce((a, b) => a + b, 0) / userTime.length).toFixed(2);
    const totalScore = Math.round(score);

    document.getElementById('score').textContent = 
        `Você acertou ${totalCorrect} de ${questions.length} perguntas. Pontuação: ${totalScore} (Tempo médio: ${averageTime}s)`;

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
            podiumElements[i].score.textContent = `${ranking[i].score} pts`;
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
        li.textContent = `${i + 1}. ${ranking[i].name} - ${ranking[i].score} pts`;
        rankingList.appendChild(li);
    }
}

function restartGame() {
    playSound(clickSound);
    currentQuestion = 0;
    score = 0;
    userTime = [];
    correctAnswersList = []; // Limpa o registro de acertos
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
}
