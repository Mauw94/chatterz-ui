import Game from "./engine/Game";
import GameMap from "./GameMap"
import Player from "./Player"
import { GameData } from "./engine/types";
import TestBrick from "./TestBrick";

class BombermanGame extends Game {

  protected preload(): void {
    // TODO: load images beforehand
  }

  protected setup(gameData: GameData) {
    this.addEntity(new GameMap(gameData.screenWidth, gameData.screenHeight))
    this.addEntity(new TestBrick())
    this.addEntity(new Player())
  }

}

export default BombermanGame
