import CollisionBox from "src/app/game-engine/engine/collision/CollisionBox";
import Entity from "../../game-engine/engine/Entity";
import Sprite from "../../game-engine/engine/Sprite";
import SpriteSheet from "../../game-engine/engine/SpriteSheet";
import SpriteSheetSprite from "../../game-engine/engine/SpriteSheetSprite";
import { GameData } from "../../game-engine/engine/types";

class Bomb extends Entity {

    private sprite: Sprite
    private exploded: boolean = false
    private timerBeforeExplodeMS: number
    private explosionTimeMS: number // TODO: only show explosion 0.5s and then remove bomb entity

    private explosionRectWidth: number = 48 * 3
    private explosionRectHeight: number = 48

    constructor(xPos: number, yPos: number) {
        super()
        this.xPos = xPos
        this.yPos = yPos
        this.width = 48
        this.height = 48
        this.timerBeforeExplodeMS = 3000
        this.explosionTimeMS = 500
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
            this.exploded = true
        }
        if (this.exploded) {
            // TODO: maybe itll be better if we moved this to a seperate file
            // called bomb explosion or something
            const collisionBox: CollisionBox = {
                xPos: this.xPos - 48,
                yPos: this.yPos,
                width: this.explosionRectWidth,
                height: this.explosionRectHeight
            }
            const collisions = gameData.collisionHandler
                .checkCollisionsWith(
                    collisionBox,
                    gameData.entityManager.getObjects())

            collisions.forEach(collision => {
                if (collision === this) return // do not remove self
                gameData.collisionHandler.removeCollidable(collision.id)
                gameData.entityManager.removeObject(collision)
            })

            this.explosionTimeMS -= delta * 1000
            if (this.explosionTimeMS <= 0) {
                gameData.entityManager.removeEntity(this)
            }
        }

        this.doFlinch(delta) // show flinching on the bomb all the time
    }

    public render(gameData: GameData): void {
        if (this.exploded) {
            this.renderRect(gameData)
        } else {
            this.sprite.render(gameData, this.xPos, this.yPos, this.width, this.height, { opacity: this.calculateOpacity() })
        }
    }

    private renderRect(gameData: GameData): void {
        const { context } = gameData
        context.fillStyle = "red"
        context.fillRect(this.xPos - 48, this.yPos, this.explosionRectWidth, this.explosionRectHeight)
    }
}

export default Bomb