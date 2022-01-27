import Phaser from 'phaser';
import Preset from '../preset';

class Title extends Phaser.Scene {
  constructor() {
    super({ key: 'Title' });
  }

  preload() {
    /*
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.src);
    });
    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
    */

    this.load.image('test', './assets/images/test.png');
  }

  create() {
    this.add.image(Preset.config.width / 2, Preset.config.height / 2, 'test');
    const change = this.add
      .text(Preset.config.width / 2, Preset.config.height / 2, 'title', {
        fontFamily: Preset.style.fontFamily,
        fontSize: 50,
      })
      .setOrigin(0.5)
      .setInteractive();
    change.on(
      'pointerdown',
      () => {
        this.scene.start('Play');
      },
      this
    );
  }
}

export default Title;
