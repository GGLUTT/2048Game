'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const button = document.querySelector('.start');
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

let previousState = [];
let previousScore = 0;

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';

    // Анімація зникнення повідомлень
    messageStart.style.animation = 'fadeOut 0.3s ease-out';

    setTimeout(() => {
      messageStart.classList.add('hidden');
      messageStart.style.animation = '';
    }, 300);

    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  } else if (button.classList.contains('restart')) {
    game.restart();
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';

    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  previousState = game.getState().map(row => [...row]);
  previousScore = game.getScore();
  setGameField();
  setGameScore();
});

document.addEventListener('keyup', (e) => {
  const oldState = game.getState().map(row => [...row]);
  const oldScore = game.getScore();

  switch (e.key) {
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    default:
      return; // Вихід, якщо натиснута не стрілка
  }

  // Перевірка чи змінився стан
  const newState = game.getState();
  const stateChanged = !arraysEqual(oldState, newState);

  if (stateChanged) {
    animateMove(oldState, newState);

    // Анімація оновлення рахунку
    if (game.getScore() > oldScore) {
      animateScoreUpdate();
    }

    setTimeout(() => {
      setGameField();
      setMessages();
    }, 150);
  }

  setGameScore();
});

function arraysEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function animateMove(oldState, newState) {
  // Додаємо клас анімації для нових плиток
  setTimeout(() => {
    const cells = document.querySelectorAll('.field-cell');

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const index = r * 4 + c;
        const cell = cells[index];

        // Якщо з'явилася нова плитка
        if (oldState[r][c] === 0 && newState[r][c] !== 0) {
          cell.classList.add('new-tile');

          setTimeout(() => {
            cell.classList.remove('new-tile');
          }, 400);
        }
      }
    }
  }, 100);
}

function animateScoreUpdate() {
  gameScore.classList.add('score-animation');

  setTimeout(() => {
    gameScore.classList.remove('score-animation');
  }, 300);
}

function setGameField() {
  gameField.innerHTML = '';
  const currState = game.getState();

  for (let r = 0; r < 4; r++) {
    const tr = document.createElement('tr');

    tr.classList.add('field-row');

    for (let c = 0; c < 4; c++) {
      const td = document.createElement('td');
      const value = currState[r][c];

      td.textContent = value !== 0 ? value : '';
      td.classList.add('field-cell');

      if (value !== 0) {
        td.classList.add(`field-cell--${value}`);
      }

      tr.appendChild(td);
    }

    gameField.appendChild(tr);
  }
}

function setGameScore() {
  gameScore.textContent = game.getScore();
}

function setMessages() {
  if (game.getStatus() === Game.STATUS.win) {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === Game.STATUS.lose) {
    messageLose.classList.remove('hidden');
  }
}

// Додаємо CSS анімацію fadeOut
const style = document.createElement('style');

style.textContent = `
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }
`;
document.head.appendChild(style);

// Ініціалізація
setGameField();
setGameScore();
setMessages();
