import { playBtn } from './elements';
import { newGame, presentCards } from './lib';
import settings from './settings';

function handlePlayClick() {
  newGame(settings);
}

presentCards(settings);

playBtn.addEventListener('click', handlePlayClick);
