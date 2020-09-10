import { playBtn } from './elements';
import { newGame, presentCards } from './lib';

function handlePlayClick() {
  newGame();
}

presentCards();

playBtn.addEventListener('click', handlePlayClick);
