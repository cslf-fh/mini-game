import Phaser from 'phaser';
import Preset from '../preset';

const WIDTH = Preset.config.width;
const HEIGHT = Preset.config.height;
const FONT_FAMILY = Preset.style.fontFamily;

class Loading extends Phaser.Scene {
  constructor() {
    super({ key: 'Loading' });
    this.SCENE; // 遷移先のシーン
  }

  init(data) {
    if (Object.keys(data).length) {
      this.SCENE = data.scene;
    } else {
      this.SCENE = 'Title';
    }
  }

  preload() {
    this.load.scenePlugin(
      'rexspinnerplugin',
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexspinnerplugin.min.js',
      'rexSpinner',
      'rexSpinner'
    );
  }

  create() {
    /* 初回テキスト描画時にWebフォントのスタイルが当たらなかったのでダミー用のテキスト */
    this.add.text(0, -100, '=>', {
      fontFamily: FONT_FAMILY,
    });

    this.rexSpinner.add.bars({
      x: WIDTH / 2,
      y: HEIGHT / 2,
      width: 64,
      height: 64,
      color: 0xffffff,
    });

    const timer = this.time.addEvent({ delay: 1000 });
    timer.callback = () => {
      this.scene.start(this.SCENE);
    };
  }
}

export default Loading;
