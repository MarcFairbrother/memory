import srcDeck from './deck';
import { shuffle, searchForPair, wait } from './utils';
import {
  cards,
  humanScoreBoard,
  compScoreBoard,
  playBtn,
  endgameModal,
  endgameStatus,
} from './elements';

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

function newTurn() {
  if (isHumanTurn) {
    humanTurn();
  } else {
    computerTurn();
  }
}

async function endGame() {
  let status;
  if (score.human > score.computer) {
    status = 'Congrats, you win!';
  } else if (score.computer > score.human) {
    status = 'You lose, better luck next time!';
  } else {
    status = 'Draw!';
  }
  endgameStatus.innerHTML = status;
  endgameModal.classList.add('endgame--visible');
  playBtn.disabled = false;
  await wait(1500);
  endgameModal.classList.remove('endgame--visible');
}

function deal() {
  // 1. create new play deck from source
  playDeck = shuffle([...srcDeck]);
  // 2. build HTML for play deck
  const cardsHTML = [];
  playDeck.forEach((card, i) => {
    cardsHTML.push(
      `<li 
        class="card"
        data-position="${i}" 
        data-id="${card.id}">
        <button class="card__verso" type="button" name="flip"></button>
        <span class="card__recto"></span>
      </li>`
    );
  });
  cards.innerHTML = cardsHTML.join('');
}

export function presentCards() {
  // 1. create new play deck from source
  playDeck = shuffle([...srcDeck]);
  // 2. build HTML to present the cards face up
  const cardsHTML = [];
  playDeck.forEach((card, i) => {
    cardsHTML.push(
      `<li 
        class="card flipped"
        data-position="${i}" 
        data-id="${card.id}">
        <button class="card__verso" type="button" name="flip"></button>
        <span class="card__recto" style="--img: var(${card.illustration});"></span>
      </li>`
    );
  });
  cards.innerHTML = cardsHTML.join('');
}

export function newGame() {
  // 1. set up new play deck
  deal();
  // 2. reset game settings
  isHumanTurn = true;
  currentTurn = [];
  knowledge.discovered = [];
  knowledge.unknowns = playDeck.map((card, i) => i);
  score.human = 0;
  humanScoreBoard.querySelector('.player__score').innerHTML = 'Score: 0';
  score.computer = 0;
  compScoreBoard.querySelector('.player__score').innerHTML = 'Score: 0';
  // 3. disable play button
  playBtn.disabled = true;
  // 4. begin game
  newTurn();
}

async function compare() {
  let playerType;
  let board;
  // 1. set variables depending on who's turn it is
  if (isHumanTurn) {
    playerType = 'human';
    board = humanScoreBoard;
    // 2. remove click event listener while comparing cards
    cards.removeEventListener('click', handleFlipClick);
  } else {
    playerType = 'computer';
    board = compScoreBoard;
  }
  if (currentTurn[0].name === currentTurn[1].name) {
    // 3. if cards match, remove them from knowledge as they are no longer in play
    currentTurn.forEach((card) => {
      const i = knowledge.discovered.findIndex((item) => item.id === card.id);
      knowledge.discovered.splice(i, 1);
    });
    // 4. and increment the current player's score
    score[playerType] += 1;
    board.querySelector(
      '.player__score'
    ).innerHTML = `Score: ${score[playerType]}`;
    // 5. check if game should be ended
    if (score.human + score.computer === playDeck.length / 2) {
      endGame();
    }
  } else {
    await wait(1000);
    // 6. if the cards don't match, flip them back
    currentTurn.forEach((card) => {
      const targetEl = cards.querySelector(
        `.card__recto[data-id="${card.id}"]`
      );
      targetEl.innerHTML = '';
      targetEl.removeAttribute('data-id');
      targetEl.removeAttribute('style');
      targetEl.parentElement.classList.remove('flipped');
    });
    // 7. switch current player
    isHumanTurn = !isHumanTurn;
  }
  // 8. empty currentTurn array for next turn
  currentTurn = [];
  // 9. if the game is not over, begin a new turn
  if (score.human + score.computer !== playDeck.length / 2) {
    await wait(500);
    newTurn();
  }
}

function updateKnowledge(flippedCardPosition) {
  // 1. check if the card has already been added to the computer's knowledge
  const isDiscovered = knowledge.discovered.some(
    (card) => card.position === flippedCardPosition
  );
  if (!isDiscovered) {
    // 2. if not, add the card to discovered
    knowledge.discovered.push({
      position: flippedCardPosition,
      name: playDeck[flippedCardPosition].name,
      id: playDeck[flippedCardPosition].id,
    });
    // 3. and remove the card from unknowns
    const i = knowledge.unknowns.indexOf(flippedCardPosition);
    knowledge.unknowns.splice(i, 1);
  }
}

async function flip(parent) {
  const parentPosition = parseInt(parent.dataset.position);
  // 1. update knowledge with new data
  updateKnowledge(parentPosition);
  // 2. update UI to show flipped card
  parent.classList.add('flipped');
  const recto = parent.querySelector('.card__recto');
  recto.innerHTML = playDeck[parentPosition].name;
  recto.setAttribute(
    'style',
    `--img: var(${playDeck[parentPosition].illustration});`
  );
  recto.setAttribute('data-id', playDeck[parentPosition].id);
  // 3. add data of latest flipped card to currentTurn array
  currentTurn.push(playDeck[parentPosition]);
  // 4. if currentTurn holds two items, compare them
  if (currentTurn.length === 2) {
    compare();
  }
}

// human turn is mainly listening for click events on the cards

function handleFlipClick(e) {
  if (e.target.name !== 'flip') return;
  flip(e.target.parentElement);
}

function humanTurn() {
  cards.addEventListener('click', handleFlipClick);
}

// computer turn is hevaily scripted to implement strategy

function computerFlip(position) {
  const target = document.querySelector(`[data-position="${position}"]`);
  flip(target);
}

async function computerTurn() {
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
    const previousKnowledge = [...knowledge.discovered];
    // 4. flip a random card from the unknowns
    let position =
      knowledge.unknowns[Math.floor(Math.random() * knowledge.unknowns.length)];
    await wait(Math.ceil(Math.random() * 250) + 300);
    computerFlip(position);
    // 5. check for a matching card in previous knowledge
    const matchingCard = previousKnowledge.filter(
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
