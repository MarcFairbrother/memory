import { shuffle, searchForPair, wait } from './utils';
import {
  repositionCards,
  flip,
  flipBackNonMatchingCards,
  displayEndGameModal,
} from './ui';
import {
  computerBeginsRandomTurn,
  computerFlipsMatchingCards,
} from './strategy';
import { cards, humanScoreBoard, compScoreBoard, playBtn } from './elements';
import settings from './settings';

// sets up new game
export function newGame(gameSettings) {
  // 1. set up new play deck
  deal(gameSettings);
  // 2. reset game settings
  gameSettings.isHumanTurn = true;
  gameSettings.selection = [];
  gameSettings.knowledge.discovered = [];
  gameSettings.knowledge.unknowns = gameSettings.playDeck.map((card, i) => i);
  gameSettings.score.human = 0;
  gameSettings.score.computer = 0;
  humanScoreBoard.querySelector('.player__score').innerHTML = 'Score: 0';
  compScoreBoard.querySelector('.player__score').innerHTML = 'Score: 0';
  // 3. disable play button
  playBtn.disabled = true;
  // 4. begin game
  newTurn(gameSettings);
}

// builds a new shuffled deck
function deal(settings) {
  // 1. store data from current deck to reposition cards
  const oldDeck = [...settings.playDeck];
  // 2. create new play deck from source
  settings.playDeck = shuffle([...settings.srcDeck]);
  // 3. flip cards face down then reposition them
  cards.childNodes.forEach((card) => card.classList.remove('flipped'));
  cards.addEventListener(
    'transitionend',
    () => repositionCards(oldDeck, settings.playDeck),
    { once: true }
  );
}

// begins a new human or computer turn, or ends game if all cards have been matched
function newTurn(gameSettings) {
  // 1. reset array of cards for the new turn
  gameSettings.selection = [];
  // 2. check if game should end, or the computer or player should take a new turn
  if (
    gameSettings.score.human + gameSettings.score.computer ===
    gameSettings.playDeck.length / 2
  ) {
    endGame(gameSettings);
  } else if (gameSettings.isHumanTurn) {
    humanTurn(gameSettings);
  } else {
    computerTurn(gameSettings);
  }
}

// ends game
function endGame({ score }) {
  // calculate win, lose or draw from scores
  let status;
  if (score.human > score.computer) {
    status = 'Congrats, you win!';
  } else if (score.computer > score.human) {
    status = 'You lose, better luck next time!';
  } else {
    status = 'Draw!';
  }
  // display status in modal
  displayEndGameModal(status);
}

// human turn is mainly listening for click events on the cards
function humanTurn() {
  cards.addEventListener('click', handleFlipClick);
}

function handleFlipClick(e) {
  if (e.target.name !== 'flip') return;
  flip(e.target.parentElement, settings);
}

// computer turn is hevaily scripted to implement strategy
function computerTurn(gameSettings) {
  // 1. check knowledge for existing pairs
  const match = searchForPair(gameSettings.knowledge.discovered, 'name');
  if (match) {
    // 2. if existing pair is found, flip those cards
    computerFlipsMatchingCards(match, gameSettings);
  } else {
    // 3. if no existing pairs are found, computer takes a random turn
    computerBeginsRandomTurn(gameSettings);
  }
}

// updates knowledge base when new cards are revealed
export function updateKnowledge(flippedCardPosition, gameSettings) {
  // 1. check if the card has already been added to the computer's knowledge
  const isDiscovered = gameSettings.knowledge.discovered.some(
    (card) => card.position === flippedCardPosition
  );
  if (!isDiscovered) {
    // 2. if not, add the card to discovered
    gameSettings.knowledge.discovered.push({
      position: flippedCardPosition,
      name: gameSettings.playDeck[flippedCardPosition].name,
      id: gameSettings.playDeck[flippedCardPosition].id,
    });
    // 3. and remove the card from unknowns
    const i = gameSettings.knowledge.unknowns.indexOf(flippedCardPosition);
    gameSettings.knowledge.unknowns.splice(i, 1);
  }
}

// removes a matching pair of cards from the computer's knowledge base
function removeCardsFromPlay(settings) {
  settings.selection.forEach((card) => {
    const i = settings.knowledge.discovered.findIndex(
      (item) => item.id === card.id
    );
    settings.knowledge.discovered.splice(i, 1);
  });
}

// increments the current player's score by one point
function incrementScore({ isHumanTurn, score }) {
  // 1. set variables depending on who's turn it is
  const playerType = isHumanTurn ? 'human' : 'computer';
  const board = isHumanTurn ? humanScoreBoard : compScoreBoard;
  const scoreEl = board.querySelector('.player__score');
  // 2. increment score in game settings
  score[playerType] += 1;
  // 3. update score UI
  scoreEl.innerHTML = `Score: ${score[playerType]}`;
}

// compares the two cards flipped this turn
export async function compare(gameSettings) {
  // 1. if it's the player's turn remove click event listener while comparing cards
  if (gameSettings.isHumanTurn) {
    cards.removeEventListener('click', handleFlipClick);
  }
  // 2. check if the selected cards match
  if (gameSettings.selection[0].name === gameSettings.selection[1].name) {
    // 3. if cards match, remove them from knowledge as they are no longer in play
    removeCardsFromPlay(gameSettings);
    // 4. and increment the current player's score
    incrementScore(gameSettings);
  } else {
    await wait(1000);
    // 5. if the selected cards don't match, flip them back;
    flipBackNonMatchingCards(gameSettings);
    // 6. switch current player
    gameSettings.isHumanTurn = !gameSettings.isHumanTurn;
  }
  // 7. begin a new turn
  await wait(500);
  newTurn(gameSettings);
}
