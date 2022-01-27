import Phaser from 'phaser';
import preset from './preset';
import Title from './scenes/title';
import Play from './scenes/play';
import Result from './scenes/result';

const config = { ...preset.config, scene: [Title, Play, Result] };

const game = new Phaser.Game(config);

export default game;
