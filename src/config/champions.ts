import { Champion } from "../shared/types";

const champions: Record<string, Champion> = {
  'rat': {
    id: '',
    name: 'Rat',
    stats: {
      health: 5,
      damage: 1,
      attackSpeed: 1,
    }, 
    earnedStats: {
      damage: 0.1,
    },
  },
  'bat': {
    id: '',
    name: 'Bat',
    stats: {
      health: 6,
      damage: 0.5,
      attackSpeed: 1,
    },
    earnedStats: {
      health: 0.5,
    }
  },
  'spider': {
    id: '',
    name: 'Spider',
    stats: {
      health: 4,
      damage: 0.5,
      attackSpeed: 2,
    },
    earnedStats: {
      attackSpeed: 0.05,
    }
  },
};

Object.keys(champions)
  .forEach((c) => {
    const champ = champions[c];
    champ.id = c;
  });

export default champions;