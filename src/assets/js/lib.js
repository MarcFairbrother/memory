import srcDeck from './deck';
import { shuffle, searchForPair, wait } from './utils';
import { cards, humanScoreBoard, compScoreBoard } from './elements';

let isHumanTurn = true;
let playDeck;
let currentTurn = [];
const knowledge = {
  discovered: [],
  unknowns: [],
};
const score = {
  human: 0,
  computer: 0,
};

function endGame() {
  if (score.human > score.computer) {
    alert('You win!');
  } else if (score.computer > score.human) {
    alert('Computer wins!');
  } else {
    alert('Draw!');
  }
}

async function compare() {
  let playerType;
  let board;
  // remove event listener while comparing cards
  if (isHumanTurn) {
    playerType = 'human';
    board = humanScoreBoard;
    cards.removeEventListener('click', handleFlipClick);
  } else {
    playerType = 'computer';
    board = compScoreBoard;
  }
  if (currentTurn[0].name === currentTurn[1].name) {
    // remove cards from knowledge as they are no longer in play
    currentTurn.forEach((card) => {
      const i = knowledge.discovered.findIndex((item) => item.id === card.id);
      knowledge.discovered.splice(i, 1);
    });
    // increment score
    score[playerType] += 1;
    board.querySelector(
      '.player__score'
    ).innerHTML = `Score: ${score[playerType]}`;
    // check if game should be ended
    if (score.human + score.computer === playDeck.length / 2) {
      endGame();
    }
  } else {
    await wait(1000);
    // flip cards back
    currentTurn.forEach((card) => {
      const targetEl = cards.querySelector(
        `.card__recto[data-id="${card.id}"]`
      );
      targetEl.innerHTML = '';
      targetEl.removeAttribute('data-id');
      targetEl.parentElement.classList.remove('flipped');
    });
    // change player
    isHumanTurn = !isHumanTurn;
  }
  currentTurn = [];
  if (score.human + score.computer !== playDeck.length / 2) {
    await wait(500);
    newTurn();
  }
}

function updateKnowledge(flippedCardPosition) {
  // check if the card has already been added to the computer's knowledge
  const isDiscovered = knowledge.discovered.some(
    (card) => card.position === flippedCardPosition
  );
  // if not, add to discovered and remove from unknowns
  if (!isDiscovered) {
    knowledge.discovered.push({
      position: flippedCardPosition,
      name: playDeck[flippedCardPosition].name,
      id: playDeck[flippedCardPosition].id,
    });
    const i = knowledge.unknowns.indexOf(flippedCardPosition);
    knowledge.unknowns.splice(i, 1);
  }
}

async function flip(parent) {
  const parentPosition = parseInt(parent.dataset.position);
  updateKnowledge(parentPosition);
  parent.classList.add('flipped');
  const recto = parent.querySelector('.card__recto');
  recto.innerHTML = playDeck[parentPosition].name;
  recto.setAttribute('data-id', playDeck[parentPosition].id);
  currentTurn.push(playDeck[parentPosition]);
  if (currentTurn.length === 2) {
    compare();
  }
}

function handleFlipClick(e) {
  if (e.target.name !== 'flip') return;
  flip(e.target.parentElement);
}

function humanTurn() {
  cards.addEventListener('click', handleFlipClick);
}

function computerFlip(position) {
  const target = document.querySelector(`[data-position="${position}"]`);
  flip(target);
}

async function computerTurn() {
  console.log('computer turn');
  // 1. check knowledge for existing pairs
  const match = searchForPair(knowledge.discovered, 'name');
  if (match) {
    // 2. if existing pair is found, flip those cards
    await wait(Math.ceil(Math.random() * 250) + 300);
    computerFlip(match[0].position);
    await wait(Math.ceil(Math.random() * 250) + 300);
    computerFlip(match[1].position);
  } else {
    // 3. if no existing pairs are found, store current discovered cards
    const currentDiscovered = [...knowledge.discovered];
    // 4. flip a random card from the unknowns
    let position =
      knowledge.unknowns[Math.floor(Math.random() * knowledge.unknowns.length)];
    await wait(Math.ceil(Math.random() * 250) + 300);
    computerFlip(position);
    // 5. check for a matching card in knowledge
    const matchingCard = currentDiscovered.filter(
      (card) =>
        card.name === knowledge.discovered[knowledge.discovered.length - 1].name
    );
    if (matchingCard.length === 0) {
      // 6. if no matching card exists, flip a random card from the unknowns
      position =
        knowledge.unknowns[
          Math.floor(Math.random() * knowledge.unknowns.length)
        ];
      await wait(Math.ceil(Math.random() * 250) + 300);
      computerFlip(position);
    } else {
      // 7. if a matching card exists, flip that card
      await wait(Math.ceil(Math.random() * 250) + 300);
      computerFlip(matchingCard[0].position);
    }
  }
}

export function newTurn() {
  if (isHumanTurn) {
    humanTurn();
  } else {
    computerTurn();
  }
}

function deal() {
  playDeck = shuffle([...srcDeck]);
  const cardsHTML = [];
  playDeck.forEach((card, i) => {
    cardsHTML.push(
      `<li 
        class="card"
        data-position="${i}" 
        data-id="${card.id}">
        <button class="card__verso" type="button" name="flip">${card.name}</button>
        <span class="card__recto"></span>
      </li>`
    );
  });
  cards.innerHTML = cardsHTML.join('');
}

export function newGame() {
  deal();
  // reset game settings
  isHumanTurn = true;
  currentTurn = [];
  knowledge.discovered = [];
  knowledge.unknowns = playDeck.map((card, i) => i);
  score.human = 0;
  humanScoreBoard.querySelector('.player__score').innerHTML = 'Score: 0';
  score.computer = 0;
  compScoreBoard.querySelector('.player__score').innerHTML = 'Score: 0';
}
