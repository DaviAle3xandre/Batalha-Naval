// Variáveis globais
let board = [];
const gridSize = 6;
let totalShips = 0; // Quantidade de navios (determinado pela dificuldade)
let hits = 0;
let misses = 0;
let ships = [];
let score = 0; // Sistema de pontuação
let lives = 10; // Vidas do jogador
let gameOver = false; // Flag para controlar o estado do jogo

// Sons
let currentSound = null; // Variável para armazenar o som atualmente em reprodução

const soundTiroAgua = new Audio('assets/som_tiro_mar.mp3'); // Som ao errar (acertar a água)
const soundTiroBarco = new Audio('assets/som_tiro_barco.mp3'); // Som ao acertar um navio
const soundFundo = new Audio('assets/som_fundo.mp3'); // Som de fundo

// Função para parar o som atual e iniciar o novo som com limitação de 3 segundos
function playSound(sound) {
    if (currentSound) {
        currentSound.pause(); // Pausa o som anterior
        currentSound.currentTime = 0; // Reseta o som anterior para o início
    }

    currentSound = sound; // Define o som atual
    currentSound.play(); // Toca o novo som

    // Limita a duração do som para 3 segundos
    setTimeout(() => {
        if (currentSound === sound) {
            currentSound.pause();
            currentSound.currentTime = 0;
        }
    }, 3000);
}

// Função para criar o tabuleiro (matriz 6x6)
function createBoard() {
    board = Array(gridSize).fill().map(() => Array(gridSize).fill(0)); // 0 = água
}

// Função para posicionar os navios aleatoriamente
function placeShips(difficulty) {
    ships = [];
    totalShips = difficulty === 'fácil' ? 3 : difficulty === 'médio' ? 5 : 7;

    let shipsPlaced = 0;
    
    while (shipsPlaced < totalShips) {
        let row = Math.floor(Math.random() * gridSize);
        let col = Math.floor(Math.random() * gridSize);

        // Verifica se a célula está livre (0 = água)
        if (board[row][col] === 0) {
            board[row][col] = 1; // 1 = navio
            ships.push({row, col});
            shipsPlaced++;
        }
    }
}

// Função de ataque (atirar)
function atirar(row, col, card) {
    if (gameOver) return; // Impede ações se o jogo acabou

    if (board[row][col] === 1) {
        // Acertou um navio
        hits++;
        board[row][col] = 2; // 2 = navio atingido
        card.querySelector('img').src = 'imagens/navio_atingido.png'; // Mudar imagem para "navio em chamas"
        score += 10; // Adiciona pontos por acerto
        updateScore(); // Atualiza o score
        customAlert('Você acertou um navio! Pontos: ' + score);
        playSound(soundTiroBarco); // Toca o som de navio atingido
    } else if (board[row][col] === 0) {
        // Errou, acertou água
        misses++;
        board[row][col] = 3; // 3 = tiro na água
        card.querySelector('img').src = 'imagens/agua_atingida.png'; // Mudar imagem para "água"
        lives--; // Reduz uma vida
        updateLives(); // Atualiza as vidas

        if (lives > 0) {
            customAlert('Você errou! Vidas restantes: ' + lives);
        } else {
            gameOver = true; // Marca como game over
            customAlert('Você perdeu todas as vidas! Game Over!');
        }

        playSound(soundTiroAgua); // Toca o som de água atingida
    }

    // Verifica se todos os navios foram atingidos
    if (hits === totalShips) {
        gameOver = true; // Marca como game over
        customAlert('Você venceu! Todos os navios foram destruídos!');
    }
}

// Função para atualizar o score
function updateScore() {
    document.getElementById('score').textContent = 'Score: ' + score;
}

// Função para atualizar as vidas
function updateLives() {
    document.getElementById('lives').textContent = 'Vidas: ' + lives;
}

// Evento de clique na imagem do gato
document.querySelector('.container-chest').addEventListener('click', () => {
    // Toca o som de fundo em loop após o clique na imagem do gato
    soundFundo.loop = true;
    soundFundo.play().catch(error => {
        console.error('Erro ao tentar reproduzir o som de fundo:', error);
    });

});

// Inicialização do jogo
document.getElementById('inicio').addEventListener('click', () => {
    const difficulty = document.querySelector('.pirate-button.active').textContent.toLowerCase();
    createBoard();
    placeShips(difficulty);
    hits = 0;
    misses = 0;
    score = 0; // Reseta o score
    lives = 10; // Reseta as vidas
    gameOver = false; // Reseta o estado de game over
    updateScore(); // Atualiza o score na tela
    updateLives(); // Atualiza as vidas na tela
    customAlert('Jogo iniciado! Boa sorte! Dificuldade: ' + difficulty);

    // Reseta as imagens do tabuleiro para o estado inicial
    document.querySelectorAll('.card').forEach(card => {
        card.querySelector('img').src = 'imagens/mar.png'; // Mudar de volta para a imagem de mar
    });
});

// Adiciona a classe 'active' ao botão de dificuldade selecionado
document.querySelectorAll('.pirate-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.pirate-button.active')?.classList.remove('active');
        button.classList.add('active');
        customAlert('Dificuldade selecionada: ' + button.textContent);
    });
});

// Adiciona evento de clique nas células do tabuleiro
document.querySelectorAll('.card').forEach((card, index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    card.addEventListener('click', () => {
        atirar(row, col, card);
    });
});

// Função para exibir um alerta personalizado
function customAlert(message) {
    // Remove alertas antigos
    document.querySelectorAll('.custom-alert').forEach(alert => {
        alert.classList.add('fade-out');
        setTimeout(() => {
            alert.remove();
        }, 300);
    });

    let div = document.createElement("div");
    div.classList.add("custom-alert");

    let close = document.createElement("a");
    close.textContent = "[Fechar]";
    close.classList.add("close");
    close.addEventListener("click", () => {
        div.classList.add("fade-out");
        setTimeout(() => {
            document.body.removeChild(div);
        }, 300); 
    });

    div.appendChild(close);
    div.appendChild(document.createTextNode(message));
    document.body.appendChild(div);

    setTimeout(() => {
        div.classList.add("fade-in");
    }, 10);

    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        div.classList.add("fade-out");
        setTimeout(() => {
            document.body.removeChild(div);
        }, 300);
    }, 5000);
}

// Função para reiniciar o jogo
function resetGame() {
    score = 0;
    lives = 10;
    updateScore();
    updateLives();
    gameOver = false; // Reseta o estado de game over
}

// Exibir score e vidas no início
document.body.insertAdjacentHTML('afterbegin', `
    <div id="score" style="position: absolute; top: 10px; left: 10px; color: white; font-family: Pirata, Arial, Helvetica, sans-serif; font-size: 50px;">Score: ${score}</div>
    <div id="lives" style="position: absolute; top: 10px; right: 10px; color: white; font-family: Pirata, Arial, Helvetica, sans-serif; font-size: 50px;">Vidas: ${lives}</div>
`);
