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

    private readonly explosionRectWidth: number = 48
    private readonly explosionRectHeight: number = 48

    private horizontalExplosionBox: CollisionBox
    private verticalExplosionBox: CollisionBox

    constructor(xPos: number, yPos: number) {
        super()
        this.xPos = xPos
        this.yPos = yPos
        this.width = 48
        this.height = 48
        this.timerBeforeExplodeMS = 3000
        this.explosionTimeMS = 500

        this.horizontalExplosionBox = {
            xPos: this.xPos - 48,
            yPos: this.yPos,
            width: this.explosionRectWidth * 3,
            height: this.explosionRectHeight
        }

        this.verticalExplosionBox = {
            xPos: this.xPos,
            yPos: this.yPos - 48,
            width: this.explosionRectWidth,
            height: this.explosionRectHeight * 3
        }
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
            let collisions: Entity[] = []

            const horizontalCollisions = gameData.collisionHandler
                .checkCollisionsWith(
                    this.horizontalExplosionBox,
                    gameData.entityManager.getObjects())
            const verticalCollisions = gameData.collisionHandler
                .checkCollisionsWith(
                    this.verticalExplosionBox,
                    gameData.entityManager.getObjects())

            collisions = [...horizontalCollisions, ...verticalCollisions]

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
            this.renderExplosionPart(gameData, this.horizontalExplosionBox)
            this.renderExplosionPart(gameData, this.verticalExplosionBox)
        } else {
            this.sprite.render(gameData, this.xPos, this.yPos, this.width, this.height, { opacity: this.calculateOpacity() })
        }
    }

    private renderExplosionPart(gameData: GameData, explosion: CollisionBox): void {
        const { context } = gameData
        context.fillStyle = "red"
        context.fillRect(
            explosion.xPos,
            explosion.yPos,
            explosion.width,
            explosion.height
        )
    }
}

export default Bomb