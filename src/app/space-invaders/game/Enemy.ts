import Entity from "src/app/game-engine/engine/Entity";
import ImageSprite from "src/app/game-engine/engine/ImageSprite";
import { GameData } from "src/app/game-engine/engine/types";
import Bullet from "./Bullet";

class Enemy extends Entity {

    private sprite: ImageSprite
    private dieSound: HTMLAudioElement
    private enemyType: number
    private bulletShootIntervalMS: number = 100

    constructor(enemyType: number, x: number, y: number) {
        super();
        this.enemyType = enemyType
        this.xPos = x
        this.yPos = y
    }

    public setup() {
        super.setup()
        let img = new Image()
        img.src = "./assets/space-invaders/images/enemy" + this.enemyType + ".png"
        this.sprite = new ImageSprite(img)

        this.width = 44
        this.height = 32
        this.speed = 15

        this.dieSound = new Audio("./assets/space-invaders/sounds/enemy-death.wav")

        // TODO: have enemy shoot at random intervals; depending on the level
        // increase enemy speed, depending on level
        // have some variation in the speed
        // spawn enemies at n interval in a level
    }

    public update(gameData: GameData, delta: number) {
        this.sprite.update(gameData, delta)

        this.velY = (this.speed * delta)
        this.yPos += this.velY

        this.updateBullets(gameData)
    }

    public render(gameData: GameData): void {
        this.sprite.render(gameData, this.xPos, this.yPos, this.width, this.height)
    }

    public playDieSound() {
        this.dieSound.volume = 0.1
        this.dieSound.currentTime = 0
        this.dieSound.play()
    }

    private updateBullets(gameData: GameData): void {
        const { entityManager } = gameData

        if (this.bulletShootIntervalMS > 0) {
            this.bulletShootIntervalMS--
        }

        if (this.bulletShootIntervalMS <= 0) {
            console.log("enemy shooting")
            const bullet = new Bullet(this.xPos + this.width / 2, this.yPos + this.height, 250, "white")
            this.bulletShootIntervalMS = 50
            entityManager.addEnemyBullet(bullet)
        }
    }
}

export default Enemy