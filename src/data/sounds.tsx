// Soundboard sounds, ignore these
export interface Sound {
  name: string;
  imgUrl: string;
  imgUrlLight?: string;
  soundUrl: string;
}

export const sounds: Sound[] = [
  {
    name: 'gojo',
    imgUrl: '/sounds/icons/gojo.svg',
    soundUrl: '/sounds/gojo.ogg',
  },
  {
    name: 'among us',
    imgUrl: '/sounds/icons/amongus.svg',
    soundUrl: '/sounds/amongus.ogg',
  },
  {
    name: 'fortnite',
    imgUrl: '/sounds/icons/fortnite.svg',
    soundUrl: '/sounds/fortnite.ogg',
  },
  {
    name: 'one piece',
    imgUrl: '/sounds/icons/onepiece.webp',
    soundUrl: '/sounds/one piece.ogg',
  },
  {
    name: 'tuntuntunsahur',
    imgUrl: '/sounds/icons/tuntuntunsahur.webp',
    soundUrl: '/sounds/tuntuntunsahur.ogg',
  },
];
