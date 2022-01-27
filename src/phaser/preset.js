import Phaser from 'phaser';

const preset = {
  config: {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    maxWidth: 400,
    maxHeight: 600,
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.ENVELOP,
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: true,
        gravity: { y: 200 },
      },
    },
  },
  style: {
    fontFamily: `'Noto Sans JP', sans-serif`,
  },
};

export default preset;
