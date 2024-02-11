import { Champion } from "../shared/types";

const champions: Record<string, Champion> = {
  'Rat': {
    id: '',
    name: 'Rat',
    spriteSheet: 'Toad_16x16.png',
    stats: {
      Health: 40,
      Damage: 5,
      AttackSpeed: 0.5,
      Armor: 0,
    }, 
    earnedStats: {
      Health: 2,
    },
  },
  'Bat': {
    id: '',
    name: 'Bat',
    spriteSheet: 'Shadow_16x16.png',
    stats: {
      Health: 30,
      Damage: 3,
      AttackSpeed: 1,
      Armor: 0,
    },
    earnedStats: {
      Damage: 1,
    }
  },
  'Spider': {
    id: '',
    name: 'Spider',
    spriteSheet: 'Spider_16x16.png',
    stats: {
      Health: 25,
      Damage: 2,
      AttackSpeed: 2,
    },
    earnedStats: {
      AttackSpeed: 0.05,
    }
  },
  'Skeleton': {
    id: '',
    name: 'Skeleton',
    spriteSheet: '',
    stats: {
      Health: 50,
      Damage: 5,
      AttackSpeed: 0.75,
      Armor: 4,
    },
    earnedStats: {
      Armor: 0.25,
      Damage: -1,
    }
  },
  'Ghost': {
    id: '',
    name: 'Ghost',
    spriteSheet: 'Ghost_16x16.png',
    stats: {
      Health: 80,
      Damage: 2,
      AttackSpeed: 2,
      LifeSteal: 0.5,
    },
    earnedStats: {
      LifeSteal: 0.05,
      Health: -5,
    }
  },
  'Python': {
    id: '',
    name: 'Giant Python',
    spriteSheet: '',
    stats: {
      Health: 60,
      Damage: 1,
      AttackSpeed: 0.5,
      Poison: 2.5,
    },
    earnedStats: {
      Poison: 0.25,
      Damage: -0.75,
    }
  },
  'Beast': {
    id: '',
    name: 'Beast',
    spriteSheet: 'Creature_16x16.png',
    stats: {
      Health: 100,
      Damage: 15,
      AttackSpeed: 0.25,
      Armor: 5,
      StunChance: 50,
    },
    earnedStats: {
      StunChance: 10,
      AttackSpeed: -0.05,
    }
  },
};

Object.keys(champions)
  .forEach((c) => {
    const champ = champions[c];
    champ.id = c;
  });

export default champions;
