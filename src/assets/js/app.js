import { playBtn } from './elements';
import { newGame } from './lib';
import { presentCards } from './ui';
import settings from './settings';

function handlePlayClick() {
  newGame(settings);
}

presentCards(settings);

playBtn.addEventListener('click', handlePlayClick);
