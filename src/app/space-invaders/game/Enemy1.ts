import { GameData } from "src/app/game-engine/engine/types";
import Enemy from "./Enemy";

class Enemy1 extends Enemy {

    constructor() {
        super(1, 20, 20);
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

export default Enemy1