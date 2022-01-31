import Phaser from 'phaser';

class Star extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, scale) {
    super(scene, x, y, texture);

    scene.add.existing(this);

    this.setScale(scale);
  }
}
export default Star;
