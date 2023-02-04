import Entity from "src/app/game-engine/engine/Entity";
import { GameData } from "src/app/game-engine/engine/types";

class GameMap extends Entity {

    private bgImage: HTMLImageElement

    constructor() {
        super();
    }

    public setup() {
        super.setup()
        let img = new Image()
        img.src = "./assets/space-invaders/images/space.png"
        this.bgImage = img
    }

    public render(gameData: GameData): void {
        gameData.context.drawImage(this.bgImage, 0, 0)
    }
}

export default GameMap