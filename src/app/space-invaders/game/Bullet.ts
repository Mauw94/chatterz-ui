import Entity from "src/app/game-engine/engine/Entity";
import { GameData } from "src/app/game-engine/engine/types";
import Enemy1 from "./Enemy";

class Bullet extends Entity {

    private bulletColor: string

    constructor(x: number, y: number, speed: number, bulletColor: string) {
        super()
        this.bulletColor = bulletColor
        this.xPos = x
        this.yPos = y
        this.speed = speed

        this.playShootSound()
    }

    public setup() {
        super.setup()

        this.width = 3
        this.height = 15
    }

    public update(gameData: GameData, delta: number): void {
        this.velY = -(this.speed * delta)
        this.yPos += this.velY

        if (this.yPos - this.height <= 0) {
            gameData.entityManager.removeBullet(this)
        }

        let collision = gameData.collisionHandler
            .checkCollisionWith(this, gameData.entityManager.getEnemies()) as Enemy1

        if (collision != null) {
            collision.playDieSound()
            gameData.entityManager.removeEnemy(collision)
            gameData.entityManager.removeBullet(this)
        }
    }

    public render(gameData: GameData): void {
        const { context } = gameData
        context.fillStyle = this.bulletColor
        context.fillRect(this.xPos, this.yPos, this.width, this.height)
    }

    private playShootSound() {
        const shootSound = new Audio("./assets/space-invaders/sounds/shoot.wav")
        shootSound.volume = 0.1
        shootSound.currentTime = 0
        shootSound.play()
    }
}

export default Bullet