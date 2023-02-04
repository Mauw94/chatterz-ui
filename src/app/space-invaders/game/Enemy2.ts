import { GameData } from "src/app/game-engine/engine/types";
import Enemy from "./Enemy";

class Enemy2 extends Enemy {

    constructor() {
        super(2, 60, 150);
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

export default Enemy2