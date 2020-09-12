import srcDeck from './deck';

const settings = {
  isHumanTurn: true,
  srcDeck: [...srcDeck],
  playDeck: [],
  selection: [],
  knowledge: {
    discovered: [],
    unknowns: [],
  },
  score: {
    human: 0,
    computer: 0,
  },
};

export default settings;
