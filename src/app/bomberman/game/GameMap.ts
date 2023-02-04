import { GameData } from "../../game-engine/engine/types"
import Entity from "../../game-engine/engine/Entity"

class GameMap extends Entity {

  private tileImage: HTMLImageElement

  constructor(screenWidth: number, screenHeight: number) {
    super()
    this.width = screenWidth
    this.height= screenHeight
  }

  public setup() {
    super.setup()
    let img = new Image()
    img.src = "./assets/bomberman/bg.png"
    this.tileImage = img
  }

  public render({ context }: GameData) {
    const tileSize = 64

    const tileCountX = Math.ceil(this.width / tileSize)
    const tileCountY = Math.ceil(this.height / tileSize)

    for (let y = 0; y < tileCountY; y++) {
      for (let x = 0; x < tileCountX; x++) {
        context.drawImage(this.tileImage, x * tileSize, y * tileSize, tileSize, tileSize)
      }
    }
  }

}

export default GameMap
