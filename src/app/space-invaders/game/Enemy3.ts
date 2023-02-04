import { GameData } from "src/app/game-engine/engine/types";
import Enemy from "./Enemy";

class Enemy3 extends Enemy {

    constructor() {
        super(3, 340, 75);
    }

    public setup() {
        super.setup()
    }

    public update(gameData: GameData, delta: number) {
        super.update(gameData, delta)
    }

    public render(gameData: GameData): void {
        super.render(gameData)
    }
}

export default Enemy3