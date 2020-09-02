import deck from './deck';
import { shuffle } from './utils';

const shuffledDeck = shuffle(deck);

console.table({ deck, shuffledDeck });
