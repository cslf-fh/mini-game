import Phaser from 'phaser';

const preset = {
  config: {
    type: Phaser.AUTO,
    parent: 'app',
    width: 400,
    height: 600,
    maxWidth: 400,
    maxHeight: 600,
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        //debug: true,
        gravity: { y: 200 },
      },
    },
  },
  style: {
    fontFamily: `'DotGothic16', sans-serif`,
  },
};

export default preset;
