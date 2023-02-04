import Game from "../../game-engine/engine/Game";
import GameMap from "./GameMap"
import Player from "./Player"
import TestBrick from "./TestBrick";
import GameLoop from "src/app/game-engine/engine/GameLoop";

class BombermanGame extends Game {

  protected preload(): void {
    // TODO: load images beforehand
  }

  protected setup() {
    this.addObject(new GameMap(this.gameData.screenWidth, this.gameData.screenHeight))
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
