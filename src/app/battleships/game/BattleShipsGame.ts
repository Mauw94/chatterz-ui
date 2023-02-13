import Game from "src/app/game-engine/engine/Game";

class BattleShipsGame extends Game {
    
    constructor(canvasEl: HTMLCanvasElement) {
        super(canvasEl);
    }

    protected preload(): void {
        
    }

    protected setup(): void {
        const { context } = this.gameData
        context.fillStyle = "blue"
        context.fillRect(0, 0, this.gameData.screenWidth, this.gameData.screenHeight)
    }
}

export default BattleShipsGame