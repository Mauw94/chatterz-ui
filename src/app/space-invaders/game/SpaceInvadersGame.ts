import Game from "src/app/game-engine/engine/Game";
import { GameData } from "src/app/game-engine/engine/types";
import GameMap from "./GameMap";
import Player from "./Player";
import Enemy1 from "./Enemy1";

class SpaceInvadersGame extends Game {
    
    protected preload(gameData: GameData): void {
        
    }

    protected setup(gameData: GameData): void {
        this.addObject(new GameMap())
        this.addPlayer(new Player())
        this.addEnemy(new Enemy1())
    }

}

export default SpaceInvadersGame