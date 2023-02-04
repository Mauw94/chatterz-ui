import Game from "../../game-engine/engine/Game";
import GameMap from "./GameMap"
import Player from "./Player"
import { GameData } from "../../game-engine/engine/types";
import TestBrick from "./TestBrick";

class BombermanGame extends Game {

  protected preload(): void {
    // TODO: load images beforehand
  }

  protected setup(gameData: GameData) {
    this.addObject(new GameMap(gameData.screenWidth, gameData.screenHeight))
    this.addObject(new TestBrick())
    this.addPlayer(new Player())
  }

}

export default BombermanGame
