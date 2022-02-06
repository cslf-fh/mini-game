import Phaser from 'phaser';
import Preset from '../preset';
import Player from '../splites/player';
import { functions } from '@/plugins/firebase';
import { httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
if (process.env.NODE_ENV === 'development') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

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
    const text = (this.SCORE = '000000');
    if (Object.keys(data).length) {
      const val = String(data.score);
      this.SCORE = text.slice(0, text.length - val.length) + val;
    }
  }

  preload() {
    this.load.image('twitter', './assets/images/twitter.png');
    this.load.scenePlugin(
      'rexuiplugin',
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      'rexUI',
      'rexUI'
    );
    this.load.scenePlugin(
      'rexspinnerplugin',
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexspinnerplugin.min.js',
      'rexSpinner',
      'rexSpinner'
    );
    this.load.audio('result', './assets/bgm/result.mp3');
    this.load.audio('start', './assets/bgm/start.mp3');
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

    this.sound.play('result', { rate: 0.5 });

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
        this.sound.play('start');
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
      () => {
        /* モーダルとローディングスピナの描画 */
        const modal = this.add.rectangle(
          WIDTH / 2,
          HEIGHT / 2,
          WIDTH,
          HEIGHT,
          0x000000,
          0.5
        );
        modal.setDepth(1).setInteractive(); // インタラクティブにして他のボタンを操作不可に
        const spinner = this.rexSpinner.add.bars({
          x: WIDTH / 2,
          y: HEIGHT / 2,
          width: 64,
          height: 64,
          color: 0xffffff,
        });
        spinner.setDepth(1);
        this.renderer.snapshot(async (image) => {
          const img = image.src.replace(/^data:image\/png;base64,/, ''); // base64の整形
          let imageUrl = ''; // シェア画像のURL
          const postImage = httpsCallable(functions, 'postImage'); // 画像を投稿する関数
          /* 画像を投稿 */
          await postImage({ image: img })
            .then(async (res) => {
              imageUrl = await res.data; // 投稿した画像のURLを取得
            })
            .catch(() => {}); // 投稿に失敗しても処理続行
          const baseUrl = 'https://twitter.com/intent/tweet?'; // ツイッターのシェアURL
          const text = `スコアは${this.SCORE}点でした。`; // シェアツイートのテキスト
          const pageUrl = 'https://score-300.web.app/';
          const shareUrl = `${baseUrl}text=${text}&url=${imageUrl}%20${pageUrl}`; // 最終的なシェアURL
          window.open(shareUrl); // ツイート画面を開く
          /* モーダルとスピナを削除 */
          modal.destroy();
          spinner.destroy();
        });
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
