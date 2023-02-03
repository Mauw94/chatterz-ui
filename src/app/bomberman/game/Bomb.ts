import Entity from "./engine/Entity";
import Sprite from "./engine/Sprite";
import SpriteSheet from "./engine/SpriteSheet";
import SpriteSheetSprite from "./engine/SpriteSheetSprite";
import { GameData } from "./engine/types";

class Bomb extends Entity {

    private sprite: Sprite

    private timerBeforeExplodeMS: number

    private blinkTimeMS: number = 300
    private currBlinkTimeMS: number
    private minBlinkOpacity = 0.5

    constructor(xPos: number, yPos: number) {
        super()
        this.xPos = xPos
        this.yPos = yPos
        this.width = 48
        this.height = 48
        this.timerBeforeExplodeMS = 3000
        this.currBlinkTimeMS = this.blinkTimeMS
    }

    public setup() {
        let image = new Image()
        image.src = "./assets/bomberman/bomb.png"
        const sheet = new SpriteSheet(image, this.width, this.height)
        this.sprite = new SpriteSheetSprite(sheet, 0, 0)
        console.log(this.sprite)
    }

    public update(gameData: GameData, delta: number): void {
        this.timerBeforeExplodeMS -= delta * 1000

        if (this.timerBeforeExplodeMS <= 0) {
            gameData.entityManager.removeEntity(this)
        }

        this.currBlinkTimeMS -= delta * 1000
        if (this.currBlinkTimeMS <= -this.blinkTimeMS) {
            this.currBlinkTimeMS = this.blinkTimeMS
        }
    }

    public render(gameData: GameData): void {
        const opacityVariance = 1 - this.minBlinkOpacity
        const opacityValue = (Math.abs(this.currBlinkTimeMS) / this.blinkTimeMS) * opacityVariance
        const opacity = this.minBlinkOpacity + opacityValue

        this.sprite.render(gameData, this.xPos, this.yPos, this.width, this.height, { opacity })
    }
}

export default Bomb