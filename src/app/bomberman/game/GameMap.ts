import { GameData } from "./engine/types"
import Entity from "./engine/Entity"

class GameMap extends Entity {

  private tileImage: HTMLImageElement

  constructor() {
    super()
  }

  public setup(gameData: GameData) {
    let img = new Image()
    img.src = "./assets/bomberman/bg.png"
    this.tileImage = img
    this.width = gameData.screenWidth
    this.height = gameData.screenHeight
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
