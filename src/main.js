import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import FeedAnimalsScene from './scenes/FeedAnimalsScene.js';
import ColorTrainScene from './scenes/ColorTrainScene.js';
import BearSortScene from './scenes/BearSortScene.js';
import MemoryScene from './scenes/MemoryScene.js';
import PuzzleScene from './scenes/PuzzleScene.js';
import OddOutScene from './scenes/OddOutScene.js';
import GardenerScene from './scenes/GardenerScene.js';
import ParentDashboardScene from './scenes/ParentDashboardScene.js';

const isLandscape = window.innerWidth > window.innerHeight;
const W = isLandscape ? Math.min(window.innerWidth, 1280) : Math.min(window.innerHeight * 1.33, 1280);
const H = isLandscape ? Math.min(window.innerHeight, 800) : Math.min(window.innerWidth * 0.75, 800);

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: W,
  height: H,
  backgroundColor: '#E8F4F8',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    activePointers: 3,
  },
  scene: [BootScene, MenuScene, FeedAnimalsScene, ColorTrainScene, BearSortScene, MemoryScene, PuzzleScene, OddOutScene, GardenerScene, ParentDashboardScene],
  render: {
    pixelArt: false,
    antialias: true,
  },
};

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
  const newIsLandscape = window.innerWidth > window.innerHeight;
  const newW = newIsLandscape ? Math.min(window.innerWidth, 1280) : Math.min(window.innerHeight * 1.33, 1280);
  const newH = newIsLandscape ? Math.min(window.innerHeight, 800) : Math.min(window.innerWidth * 0.75, 800);
  game.scale.resize(newW, newH);
});
