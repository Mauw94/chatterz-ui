import Entity from "../../game-engine/engine/Entity";
import Sprite from "../../game-engine/engine/Sprite";
import SpriteSheet from "../../game-engine/engine/SpriteSheet";
import SpriteSheetSprite from "../../game-engine/engine/SpriteSheetSprite";
import { GameData } from "../../game-engine/engine/types";

class Bomb extends Entity {

    private sprite: Sprite

    private timerBeforeExplodeMS: number

    constructor(xPos: number, yPos: number) {
        super()
        this.xPos = xPos
        this.yPos = yPos
        this.width = 48
        this.height = 48
        this.timerBeforeExplodeMS = 3000
    }

    public setup() {
        super.setup()
        let image = new Image()
        image.src = "./assets/bomberman/bomb.png"
        const sheet = new SpriteSheet(image, this.width, this.height)
        this.sprite = new SpriteSheetSprite(sheet, 0, 0)
    }

    public update(gameData: GameData, delta: number): void {
        this.timerBeforeExplodeMS -= delta * 1000

        if (this.timerBeforeExplodeMS <= 0) {
            gameData.entityManager.removeEntity(this)
        }

        this.doFlinch(delta) // show flinching on the bomb all the time
    }

    public render(gameData: GameData): void {
        this.sprite.render(gameData, this.xPos, this.yPos, this.width, this.height, { opacity: this.calculateOpacity() })
    }
}

export default Bomb