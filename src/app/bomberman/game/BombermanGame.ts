import Game from "../../game-engine/engine/Game";
import GameMap from "./GameMap"
import Player from "./Player"
import { GameData } from "../../game-engine/engine/types";
import TestBrick from "./TestBrick";
import GameLoop from "src/app/game-engine/engine/GameLoop";

class BombermanGame extends Game {

  public run() {
    this.gameData.keyListener.setup(this.canvasEl)

    this.preload()
    this.setup(this.gameData)

    this.setupEntities()
    const gameLoop = new GameLoop(
      this.update.bind(this),
      this.render.bind(this)
    )
    gameLoop.run()
  }

  protected preload(): void {
    // TODO: load images beforehand
  }

  protected setup(gameData: GameData) {
    this.addObject(new GameMap(gameData.screenWidth, gameData.screenHeight))
    this.addObject(new TestBrick())
    this.addPlayer(new Player())
  }

  protected setupEntities() {
    this.gameData.entityManager.getEntities().map(e => e.setup())
  }

  protected restart(): void {

  }
}

export default BombermanGame
