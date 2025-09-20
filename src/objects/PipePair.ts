import Phaser from 'phaser';
import { GAP_SIZE, PIPE_SPEED } from '../config';

export class PipePair {
    private scene: Phaser.Scene;
    topPipe: Phaser.Physics.Arcade.Image;
    bottomPipe: Phaser.Physics.Arcade.Image;
    wasPassed = false;

    constructor(scene: Phaser.Scene, x: number, centerY: number) {
        this.scene = scene;
        const halfGap = GAP_SIZE / 2;

        this.topPipe = scene.physics.add.image(x, centerY - halfGap, "pipe").setFlipY(true).setImmovable(true).setOrigin(0.5, 1).setVelocityX(PIPE_SPEED)

        this.bottomPipe = scene.physics.add.image(x, centerY + halfGap, "pipe").setImmovable(true).setOrigin(0.5, 0).setVelocityX(PIPE_SPEED)
    }

    isOffscreen(): boolean {
        return this.bottomPipe.getBounds().right < -60
    }

    resetAt(x: number, centerY: number) {
        const halfGap = GAP_SIZE / 2;
        this.wasPassed = false;

        this.topPipe.setPosition(x, centerY - halfGap);
        this.bottomPipe.setPosition(x, centerY + halfGap);
    }
}