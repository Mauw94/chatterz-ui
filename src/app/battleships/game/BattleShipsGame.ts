import Game from "src/app/game-engine/engine/Game";

class BattleShipsGame extends Game {
    
    constructor(canvasEl: HTMLCanvasElement) {
        super(canvasEl);
    }

    protected preload(): void {
        
    }
    
    protected setup(): void {
        throw new Error("Method not implemented.");
    }
}

export default BattleShipsGame