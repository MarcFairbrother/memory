import { playBtn } from './elements';
import { newGame } from './lib';

function handlePlayClick() {
  newGame();
}

newGame();

playBtn.addEventListener('click', handlePlayClick);
