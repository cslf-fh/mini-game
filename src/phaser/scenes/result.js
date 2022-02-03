import Phaser from 'phaser';
import Preset from '../preset';
import Player from '../splites/player';

const WIDTH = Preset.config.width;
const HEIGHT = Preset.config.height;
const FONT_FAMILY = Preset.style.fontFamily;
/* シェアボタンのプロパティ */
const SHARE_BUTTON = {
  color: 0x1da1f2,
  round: [0, 0, 0, 0, 10],
  text: {
    value: 'SHARE',
    size: 24,
    align: 'center',
  },
  space: {
    left: 16,
    right: 16,
    top: 0,
    bottom: 0,
    icon: 16,
  },
};

class Result extends Phaser.Scene {
  constructor() {
    super({ key: 'Result' });
    this.SCORE; // スコア
  }

  init(data) {
    //this.SCORE = data.score; // ゲーム画面からスコアを受け取る
    this.SCORE = 10000;
    console.log(data);
  }

  preload() {
    this.load.image('twitter', './assets/images/twitter.png');
    this.load.scenePlugin(
      'rexuiplugin',
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      'rexUI',
      'rexUI'
    );
  }

  create() {
    const chara = new Player(
      this,
      WIDTH / 2,
      HEIGHT / 2,
      'player',
      'damaged',
      2
    );
    /* ドラッグ移動の設定 */
    chara
      .setInteractive({ draggable: true })
      .on('drag', (pointer, dragX, dragY) => {
        chara.setPosition(dragX, dragY);
      });

    this.add
      .text(WIDTH / 2, HEIGHT / 2 - 200, 'GAME OVER', {
        fontFamily: FONT_FAMILY,
        fontSize: 60,
      })
      .setOrigin(0.5);
    this.add
      .text(WIDTH / 2, HEIGHT / 2 - 100, `YOUR SCORE : ${this.SCORE}`, {
        fontFamily: FONT_FAMILY,
        fontSize: 36,
      })
      .setOrigin(0.5);
    const toTop = this.add
      .text(WIDTH / 2 - WIDTH / 4, HEIGHT / 2 + 100, 'TO TOP', {
        fontFamily: FONT_FAMILY,
        fontSize: 24,
      })
      .setOrigin(0.5)
      .setInteractive();
    const retry = this.add
      .text(WIDTH / 2 + WIDTH / 4, HEIGHT / 2 + 100, 'RETRY', {
        fontFamily: FONT_FAMILY,
        fontSize: 24,
      })
      .setOrigin(0.5)
      .setInteractive();

    toTop.on(
      'pointerdown',
      () => {
        this.scene.start('Title');
      },
      this
    );
    retry.on(
      'pointerdown',
      () => {
        this.scene.start('Play');
      },
      this
    );

    /* シェアボタンの追加 */
    const shareButton = this.rexUI.add
      .buttons({
        x: WIDTH / 2,
        y: HEIGHT / 2 + 200,
        buttons: [this.createShareButton(this, SHARE_BUTTON.text.value)],
      })
      .layout();
    /* ボタン押下時の処理 */
    shareButton.on(
      'button.click',
      (button) => {
        console.log(`Click button-${button.text}`);
      },
      this
    );
  }

  createShareButton(scene, text) {
    return scene.rexUI.add.label({
      background: scene.rexUI.add.roundRectangle(
        ...SHARE_BUTTON.round,
        SHARE_BUTTON.color
      ),
      text: scene.add.text(0, 0, text, {
        fontFamily: FONT_FAMILY,
        fontSize: SHARE_BUTTON.text.size,
      }),
      icon: scene.make.image({
        x: 0,
        y: 0,
        key: 'twitter',
        scale: 0.1,
      }),
      align: SHARE_BUTTON.text.align,
      space: { ...SHARE_BUTTON.space },
    });
  }
}

export default Result;
