import Game from "src/app/game-engine/engine/Game";
import { GameData } from "src/app/game-engine/engine/types";
import GameMap from "./GameMap";
import Player from "./Player";

class SpaceInvadersGame extends Game {
    
    protected preload(gameData: GameData): void {
        
    }

    protected setup(gameData: GameData): void {
        this.addEntity(new GameMap())
        this.addEntity(new Player())
    }

}

export default SpaceInvadersGame