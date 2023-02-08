import Entity from "src/app/game-engine/engine/Entity";
import ImageSprite from "src/app/game-engine/engine/ImageSprite";
import { GameData } from "src/app/game-engine/engine/types";
import EnemyBullet from "./EnemyBullet";

class Enemy extends Entity {

    public bulletShootIntervalMS: number

    private baseShootIntervalMS: number
    private sprite: ImageSprite
    private dieSound: HTMLAudioElement
    private enemyType: number
    private bulletColor: string

    constructor(enemyType: number, x: number, y: number) {
        super();
        this.enemyType = enemyType
        this.xPos = x
        this.yPos = y

        this.decideBulletColor()
    }

    public setup() {
        super.setup()
        // TODO: move across x 
        let img = new Image()
        img.src = "./assets/space-invaders/images/enemy" + this.enemyType + ".png"
        this.sprite = new ImageSprite(img)

        this.width = 44
        this.height = 32
        this.speed = 15

        this.dieSound = new Audio("./assets/space-invaders/sounds/enemy-death.wav")
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

    public setBulletShootInterval(interval: number) {
        this.bulletShootIntervalMS = interval
        this.baseShootIntervalMS = interval
    }

    private updateBullets(gameData: GameData): void {
        const { entityManager } = gameData

        if (this.bulletShootIntervalMS > 0) {
            this.bulletShootIntervalMS--
        }

        if (this.bulletShootIntervalMS <= 0) {
            const bullet = new EnemyBullet(
                this.xPos + this.width / 2,
                this.yPos + this.height,
                250,
                this.bulletColor)
            this.bulletShootIntervalMS = this.baseShootIntervalMS
            entityManager.addEnemyBullet(bullet)
        }
    }

    private decideBulletColor(): void {
        if (this.enemyType === 1) {
            this.bulletColor = "orange"
        } else if (this.enemyType === 2) {
            this.bulletColor = "green"
        } else {
            this.bulletColor = "blue"
        }
    }
}

export default Enemy