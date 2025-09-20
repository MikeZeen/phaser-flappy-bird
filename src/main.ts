import Phaser from 'phaser'
import './style.css'
import { GAME_WIDTH, GAME_HEIGHT } from './config'
import { GameScene } from './scenes/GameScene'

new Phaser.Game({
  type: Phaser.WEBGL,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#71c5cf',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }
    }
  },
  scene: [GameScene]
})
