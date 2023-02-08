import Entity from "src/app/game-engine/engine/Entity";
import SpriteSheet from "src/app/game-engine/engine/SpriteSheet";
import Collidable from "src/app/game-engine/engine/collision/Collidable";
import CollisionBox from "src/app/game-engine/engine/collision/CollisionBox";
import { GameData } from "src/app/game-engine/engine/types";

class Brick extends Entity implements Collidable {

    private sheet: SpriteSheet

    constructor(x: number, y: number) {
        super()
        this.xPos = x
        this.yPos = y
    }

    public setup() {
        super.setup()
        let image = new Image()
        image.src = "./assets/bomberman/blocks.png"
        this.sheet = new SpriteSheet(image, 64, 64)
        this.width = 64
        this.height = 64
    }

    public render(gameData: GameData): void {
        this.sheet.render(gameData, 2, 0, this.xPos, this.yPos, this.width, this.height)
    }

    public getCollisionBox(): CollisionBox {
        return {
            xPos: this.xPos,
            yPos: this.yPos,
            width: this.width,
            height: this.height
        }
    }
}

export default Brick