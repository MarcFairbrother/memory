import { randomWait } from './utils';
import { flip } from './lib';

function computerFlip(position, gameSettings) {
  const target = document.querySelector(`[data-position="${position}"]`);
  flip(target, gameSettings);
}

// flips the two cards passed in the cards array
export async function computerFlipsMatchingCards(cards, settings) {
  // 1. wait a random amount of time and flip first card
  await randomWait(400, 800);
  computerFlip(cards[0].position, settings);
  // 2. wait a random amount of time and flip second card
  await randomWait(400, 800);
  computerFlip(cards[1].position, settings);
}

// flips a random card from the array of remaining unknown cards
function computerFlipsRandomUnknownCard(settings) {
  const unknownCards = settings.knowledge.unknowns;
  const target = unknownCards[Math.floor(Math.random() * unknownCards.length)];
  computerFlip(target, settings);
}

// filters previously known cards array for card matching latest discovered card
function checkForMatchingCard(previousknowledge, { discovered }) {
  const latestDiscovered = discovered[discovered.length - 1].name;
  return previousknowledge.filter((card) => card.name === latestDiscovered);
}

// completes computer turn depending on if there's a match for the first randomly flipped card
function computerCompletesTurn(matchingCard, settings) {
  if (matchingCard.length === 0) {
    // 1. if no matching card exists, wait then flip a random card from the unknowns
    computerFlipsRandomUnknownCard(settings);
  } else {
    // 2. if a matching card exists, flip that card
    computerFlip(matchingCard[0].position, settings);
  }
}

// flips a random card then checks if computer has a matching card in memory and acts accordingly
export async function computerBeginsRandomTurn(settings) {
  // 1. store current discovered cards
  const previousKnowledge = [...settings.knowledge.discovered];
  // 2. wait then flip a random card from the unknowns
  await randomWait(400, 800);
  computerFlipsRandomUnknownCard(settings);
  // 3. check for a matching card in previous knowledge
  const matchingCard = checkForMatchingCard(
    previousKnowledge,
    settings.knowledge
  );
  // 4. wait then complete turn
  await randomWait(400, 800);
  computerCompletesTurn(matchingCard, settings);
}
