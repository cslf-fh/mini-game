import Phaser from 'phaser';
import Preset from '../preset';

class Play extends Phaser.Scene {
  constructor() {
    super({ key: 'Play' });
  }

  preload() {}

  create() {
    const change = this.add
      .text(400, 300, 'changeB', { fontFamily: Preset.style.fontFamily })
      .setFontSize(30)
      .setInteractive();
    change.on(
      'pointerdown',
      () => {
        this.scene.start('Result');
      },
      this
    );
  }
}

export default Play;
