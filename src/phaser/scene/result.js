import Phaser from 'phaser';
import Preset from '../preset';

class Result extends Phaser.Scene {
  constructor() {
    super({ key: 'Result' });
  }

  preload() {}

  create() {
    const change = this.add
      .text(400, 300, 'changeC', { fontFamily: Preset.style.fontFamily })
      .setFontSize(30)
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
