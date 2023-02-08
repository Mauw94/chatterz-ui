import Game from "../../game-engine/engine/Game";
import GameMap from "./GameMap"
import GameFieldController from "./GameFieldController";
import Player from "./Player"

class BombermanGame extends Game {

  private gameFieldController: GameFieldController

  constructor(canvasEl: HTMLCanvasElement) {
    super(canvasEl)
  }

  protected preload(): void {
    // TODO: load images beforehand
    this.gameFieldController = new GameFieldController(this.gameData)
  }

  protected setup() {
    this.addObject(new GameMap(this.gameData.screenWidth, this.gameData.screenHeight))
    this.createPlayingField()
    this.addPlayer(new Player())
  }

  protected setupEntities() {
    this.gameData.entityManager.getEntities().map(e => e.setup())
  }

  protected restart(): void {

  }

  private createPlayingField() {
    const bricks = this.gameFieldController.createPlayingField()
    for (let i = 0; i < bricks.length; i++) {
      for (let j = 0; j < bricks[i].length; j++) {
        this.addObject(bricks[i][j])
      }
    }
  }
}

export default BombermanGame
