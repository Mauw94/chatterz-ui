import Entity from "src/app/game-engine/engine/Entity";
import ImageSprite from "src/app/game-engine/engine/ImageSprite";
import { GameData } from "src/app/game-engine/engine/types";
import Bullet from "./Bullet";

class Player extends Entity {

    private sprite: ImageSprite
    private timeTillNextBulletAllowedMS = 10

    constructor(x: number, y: number) {
        super()   
        this.xPos = x
        this.yPos = y
    }

    public setup() {
        super.setup()
        let img = new Image()
        img.src = "./assets/space-invaders/images/player.png"
        this.sprite = new ImageSprite(img)

        this.width = 50
        this.height = 48
        this.speed = 175
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

        if (this.timeTillNextBulletAllowedMS > 0) {
            this.timeTillNextBulletAllowedMS--
        }

        if (keyListener.isKeyDown(" ")) {
            if (this.timeTillNextBulletAllowedMS <= 0) {
                const bullet = new Bullet(this.xPos + this.width / 2, this.yPos, 300, "red")
                this.timeTillNextBulletAllowedMS = 15
                entityManager.addBullet(bullet)
            }
        }
    }
}

export default Player