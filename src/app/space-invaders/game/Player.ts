import Entity from "src/app/game-engine/engine/Entity";
import ImageSprite from "src/app/game-engine/engine/ImageSprite";
import { GameData } from "src/app/game-engine/engine/types";
import Bullet from "./Bullet";

class Player extends Entity {

    private sprite: ImageSprite
    private canShoot: boolean = false
    private timeTillNextBulletAllowedMS = 10
    private maxBulletsAtATime = 10
    private bullets: Bullet[] = []

    public setup() {
        super.setup()
        let img = new Image()
        img.src = "./assets/space-invaders/images/player.png"
        this.sprite = new ImageSprite(img)

        this.width = 50
        this.height = 48
        this.speed = 175

        this.xPos = 450
        this.yPos = 450

        this.canShoot = true
    }

    public update(gameData: GameData, delta: number) {
        this.sprite.update(gameData, delta)
        this.updatePosition(gameData, delta)
        this.updateBullets(gameData, delta)
    }

    public render(gameData: GameData): void {
        this.sprite.render(gameData, this.xPos, this.yPos, this.width, this.height)
    }

    private updatePosition(gameData: GameData, delta: number) {
        const { keyListener } = gameData

        this.velX = 0
        this.velY = 0

        if (keyListener.isAnyKeyDown(["a", "ArrowLeft"])) {
            this.velX = -(this.speed * delta)
        } else if (keyListener.isAnyKeyDown(["d", "ArrowRight"])) {
            this.velX = (this.speed * delta)
        }

        if (keyListener.isAnyKeyDown(["w", "ArrowUp"])) {
            this.velY = -(this.speed * delta)
        } else if (keyListener.isAnyKeyDown(["s", "ArrowDown"])) {
            this.velY = (this.speed * delta)
        }

        this.xPos += this.velX
        this.yPos += this.velY

        if (this.xPos + this.width >= gameData.screenWidth) {
            this.xPos = gameData.screenWidth - this.width
        } else if (this.xPos <= 0) {
            this.xPos = 0
        }

        if (this.yPos + this.height >= gameData.screenHeight) {
            this.yPos = gameData.screenHeight - this.height
        } else if (this.yPos <= 0) {
            this.yPos = 0
        }
    }

    private updateBullets(gameData: GameData, delta: number) {
        const { entityManager } = gameData
        const { keyListener } = gameData
        // TODO: create bullet manager or something to handle sounds as well
        // TODO time between shots
        // max bullets allowed
        // play sound when shooting
        if (this.timeTillNextBulletAllowedMS > 0) {
            this.timeTillNextBulletAllowedMS--
        }

        if (keyListener.isKeyDown(" ")) {
            if (this.timeTillNextBulletAllowedMS <= 0 && this.bullets.length < this.maxBulletsAtATime) {
                const bullet = new Bullet(this.xPos + this.width / 2, this.yPos, 300, "red")
                entityManager.addEntity(bullet)
                this.timeTillNextBulletAllowedMS = 10
            }
        }
    }
}

export default Player