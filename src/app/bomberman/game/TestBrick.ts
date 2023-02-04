import Collidable from "../../game-engine/engine/collision/Collidable";
import CollisionBox from "../../game-engine/engine/collision/CollisionBox";
import Entity from "../../game-engine/engine/Entity";
import SpriteSheet from "../../game-engine/engine/SpriteSheet";
import { GameData } from "../../game-engine/engine/types"

class TestBrick extends Entity implements Collidable {

  private sheet: SpriteSheet;

  public setup() {
    super.setup()
    let image = new Image()
    image.src = "./assets/bomberman/blocks.png"
    const img = image
    this.sheet = new SpriteSheet(img, 64, 64)

    this.xPos = 128
    this.yPos = 128
    this.width = 64
    this.height = 64
  }

  public render(gameData: GameData): void {
    this.sheet.render(gameData, 1, 0, this.xPos, this.yPos, this.width, this.height);
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

export default TestBrick;