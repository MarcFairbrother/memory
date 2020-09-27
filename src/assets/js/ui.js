import { updateKnowledge, compare } from './lib';
import { shuffle, wait } from './utils';
import { cards, playBtn, endgameModal, endgameStatus } from './elements';

// on page load, display the shuffled cards face up
export function presentCards(gameSettings) {
  // 1. create new play deck from source
  gameSettings.playDeck = shuffle([...gameSettings.srcDeck]);
  // 2. build HTML to present the cards face up
  const cardsHTML = [];
  gameSettings.playDeck.forEach((card, i) => {
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
  // 3. insert HTML into DOM
  cards.innerHTML = cardsHTML.join('');
}

// calculates new position for each card and animates card to new position
export async function repositionCards(previous, next) {
  previous.forEach((card, i) => {
    const nextIndex = next.findIndex((newCard) => newCard.id === card.id);
    // 1. select on page elements corresponding to previous and next position
    const current = cards.querySelector(`[data-position="${i}"]`);
    const target = cards.querySelector(`[data-position="${nextIndex}"]`);
    // 2. calculate x and y offset between previous and next positions
    const x = (current.offsetLeft - target.offsetLeft) * -1;
    const y = (current.offsetTop - target.offsetTop) * -1;
    // 3. translate each card to new position
    current.setAttribute('style', `transform: translate(${x}px, ${y}px);`);
  });
  // 4. once cards are in their new position update DOM
  await wait(500);
  insertCards(next);
}

// inserts new card deck into the DOM
function insertCards(deck) {
  // 1. build HTML to present the cards face down
  const cardsHTML = [];
  deck.forEach((card, i) => {
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
  // 2. insert HTML into DOM
  cards.innerHTML = cardsHTML.join('');
}

export async function displayEndGameModal(endGameStatus) {
  endgameStatus.innerHTML = endGameStatus;
  endgameModal.classList.add('endgame--visible');
  playBtn.disabled = false;
  await wait(1500);
  // hide modal
  endgameModal.classList.remove('endgame--visible');
}

// reveals flipped card
export async function flip(parent, gameSettings) {
  const parentPosition = parseInt(parent.dataset.position);
  // 1. update knowledge with new data
  updateKnowledge(parentPosition, gameSettings);
  // 2. update UI to show flipped card
  parent.classList.add('flipped');
  const recto = parent.querySelector('.card__recto');
  recto.innerHTML = gameSettings.playDeck[parentPosition].name;
  recto.setAttribute(
    'style',
    `--img: var(${gameSettings.playDeck[parentPosition].illustration});`
  );
  recto.setAttribute('data-id', gameSettings.playDeck[parentPosition].id);
  // 3. add data of latest flipped card to selection array
  gameSettings.selection.push(gameSettings.playDeck[parentPosition]);
  // 4. if selection holds two items, compare them
  if (gameSettings.selection.length === 2) {
    compare(gameSettings);
  }
}

// flips cards back down and removes all information
export function flipBack(target) {
  target.innerHTML = '';
  target.removeAttribute('data-id');
  target.removeAttribute('style');
  target.parentElement.classList.remove('flipped');
}
