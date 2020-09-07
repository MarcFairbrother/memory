import { playBtn } from './elements';
import { newGame, newTurn } from './lib';

function handlePlayClick() {
  newGame();
  newTurn();
}

newGame();
newTurn();

playBtn.addEventListener('click', handlePlayClick);
