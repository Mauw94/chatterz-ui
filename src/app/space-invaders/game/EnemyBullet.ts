import Entity from "src/app/game-engine/engine/Entity";
import { GameData } from "src/app/game-engine/engine/types";
import Player from "./Player";

class EnemyBullet extends Entity {

    private bulletColor: string

    constructor(x: number, y: number, speed: number, bulletColor: string) {
        super();
        this.bulletColor = bulletColor
        this.xPos = x
        this.yPos = y
        this.speed = speed
    }

    public setup() {
        super.setup()

        this.width = 3
        this.height = 15
    }

    public update(gameData: GameData, delta: number): void {
        const { entityManager } = gameData
        const { collisionHandler } = gameData

        this.velY = (this.speed * delta)
        this.yPos += this.velY

        if (this.yPos + this.height <= 0) {
            entityManager.removeEnemyBullet(this)
        }

        let collision = collisionHandler.checkCollisionWith(this, entityManager.getPlayers()) as Player

        if (collision != null && !collision.gotHit) {
            entityManager.removeEnemyBullet(this)
            collision.health--
            collision.gotHit = true
        }
    }

    public render(gameData: GameData): void {
        const { context } = gameData
        context.fillStyle = this.bulletColor
        context.fillRect(this.xPos, this.yPos, this.width, this.height)
    }
}

export default EnemyBullet