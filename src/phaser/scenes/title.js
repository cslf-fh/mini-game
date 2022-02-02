import Phaser from 'phaser';
import Preset from '../preset';
import Player from '../splites/player';

const WIDTH = Preset.config.width;
const HEIGHT = Preset.config.height;
const FONT_FAMILY = Preset.style.fontFamily;

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
    this.load.spritesheet('player', './assets/images/spritesheets/player.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    const chara = new Player(
      this,
      WIDTH / 2,
      HEIGHT / 2,
      'player',
      'default',
      2
    );
    chara.body.setVelocityX(100).setBounceX(1).setCollideWorldBounds(true); // 画面内を自動で横反復移動

    this.add
      .text(WIDTH / 2, HEIGHT / 2 - 150, 'SCORE >= 300', {
        fontFamily: FONT_FAMILY,
        fontSize: 60,
      })
      .setOrigin(0.5);
    const toStart = this.add
      .text(WIDTH / 2, HEIGHT / 2 + 150, 'TOUCH TO START', {
        fontFamily: FONT_FAMILY,
        fontSize: 24,
      })
      .setOrigin(0.5);
    this.tweens.add({
      targets: toStart,
      alpha: 0,
      duration: 500,
      delay: 500,
      yoyo: true,
      loop: -1,
    });
    /* 画面押下でシーン変更 */
    this.input.on('pointerdown', () => {
      this.scene.start('Play');
    });
  }
}

export default Title;
