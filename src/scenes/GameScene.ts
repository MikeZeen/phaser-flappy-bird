import Phaser from "phaser";
import { BIRD_VELOCITY, GAME_HEIGHT, GAME_WIDTH, GRAVITY_Y, INTERVAL } from "../config";
import { PipePair } from "../objects/PipePair";

const birdPng = new URL('../assets/bird.png', import.meta.url).href;
const pipePng = new URL('../assets/pipe.png', import.meta.url).href;

export class GameScene extends Phaser.Scene {
    private bird!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    private running = false;
    private pipes: PipePair[] = [];
    private spawnTimer?: Phaser.Time.TimerEvent;
    private score = 0;
    private scoreText!: Phaser.GameObjects.Text;

    constructor() {
        super('game');
    }

    preload() {
        this.load.image('bird', birdPng)
        this.load.image('pipe', pipePng)
    }
    create() {
        this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT)
        this.physics.world.gravity.y = 0

        this.bird = this.physics.add.image(GAME_WIDTH * 0.3, GAME_HEIGHT / 2, "bird")
            .setCollideWorldBounds(true)
            .setGravityY(GRAVITY_Y)

        this.input.keyboard?.on('keydown-SPACE', () => this.flapBird())

        this.score = 0;
        this.scoreText = this.add.text(GAME_WIDTH / 2, 40, "0", {
            fontFamily: "monospace", fontSize: "28px"
        }).setOrigin(0.5).setDepth(50);

        this.running = false;
        this.startScreen()


    }
    update(
    ) {
        if (!this.running) return;

        for (const pipe of this.pipes) {
            const px = pipe.bottomPipe.x;
            if (!pipe.wasPassed && px < this.bird.x) {
                pipe.wasPassed = true;
                this.score++;
                this.scoreText.setText(String(this.score))
            }
        }

        if (this.bird.y <= 0 || this.bird.y >= GAME_HEIGHT) this.gameOver();
    }

    private flapBird() {
        if (!this.running) return;
        this.bird.setVelocityY(BIRD_VELOCITY);
        this.tweens.add({
            targets: this.bird,
            angle: -20,
            duration: 100,
            onComplete: () => {
                this.tweens.add({
                    targets: this.bird,
                    angle: 30,
                    duration: 300
                })
            }
        })
    }

    private startScreen() {
        const hint = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.4, "Press SPACE to Start!", {
            fontFamily: "monospace", fontSize: "20px"
        }).setOrigin(0.5)

        const startHandler = () => {
            if (this.running) return;
            hint.destroy();
            this.startGame();
        }

        this.input.keyboard?.once("keydown-SPACE", startHandler)
    }

    private startGame() {
        this.running = true;
        this.spawnPipePair();
        this.spawnTimer = this.time.addEvent({
            delay: INTERVAL,
            loop: true,
            callback: () => this.spawnPipePair(),
            callbackScope: this
        })
    }

    private spawnPipePair() {
        const margin = 40;
        const centerY = Phaser.Math.Between(margin + 50, GAME_HEIGHT - margin - 50);
        const x = GAME_WIDTH + 40;

        const free = this.pipes.find(pipe => pipe.isOffscreen());
        if (free) {
            free.resetAt(x, centerY);
        } else {
            const pair = new PipePair(this, x, centerY);
            this.pipes.push(pair);
            this.physics.add.collider(this.bird, [pair.topPipe, pair.bottomPipe], () => this.gameOver());
        }
    }

    private gameOver() {
        if (!this.running) return;
        this.running = false;
        this.spawnTimer?.remove(false);

        this.pipes.forEach(pipe => {
            (pipe.topPipe.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
            (pipe.bottomPipe.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
        });

        const overText = this.add.text(
            GAME_WIDTH / 2,
            GAME_HEIGHT * 0.4,
            `Score: ${this.score} \n SPACE to try again`,
            { fontFamily: "monospace", fontSize: "20px", align: "center" }
        ).setOrigin(0.5);

        this.input.keyboard?.once("keydown-SPACE", () => this.scene.restart());
    }
}