import Phaser from 'phaser';
import Preset from '../preset';

class Result extends Phaser.Scene {
  constructor() {
    super({ key: 'Result' });
  }

  preload() {}

  create() {
    const change = this.add
      .text(Preset.config.width / 2, Preset.config.height / 2, 'result', {
        fontFamily: Preset.style.fontFamily,
        fontSize: 50,
      })
      .setOrigin(0.5)
      .setInteractive();
    change.on(
      'pointerdown',
      () => {
        this.scene.start('Title');
      },
      this
    );
  }
}

export default Result;
