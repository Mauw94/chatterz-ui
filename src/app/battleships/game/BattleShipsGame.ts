import Game from "src/app/game-engine/engine/Game";

class BattleShipsGame extends Game {

    public isPlayerTurn: boolean = false

    private targetWidth: number = 20
    private targetHeight: number = 20

    constructor(canvasEl: HTMLCanvasElement) {
        super(canvasEl)
    }

    protected preload(): void {

    }

    protected setup(): void {
        const { context } = this.gameData
        context.fillStyle = "lightblue"
        context.fillRect(0, 0, this.gameData.screenWidth, this.gameData.screenHeight)
    }

    protected update(delta: number): void {
        super.update(delta)
        const { keyListener } = this.gameData
        if (keyListener.isMouseDown() && this.isPlayerTurn) {
            this.targetArea(keyListener.getMousePos())
        }
    }

    private targetArea(pos: [number, number]): void {
        const { context } = this.gameData
        context.fillStyle = "red"
        pos = this.alignXAndY(pos)
        context.fillRect(pos[0], pos[1], this.targetWidth, this.targetHeight)
    }

    private alignXAndY(pos: [number, number]): [number, number] {
        let offsetX = pos[0] % this.targetWidth
        let offsetY = pos[1] % this.targetHeight

        if (offsetX >= 10) {
            pos[0] = pos[0] + this.targetWidth - offsetX
        } else {
            pos[0] = pos[0] - offsetX
        }

        if (offsetY >= 10) {
            pos[1] = pos[1] + this.targetHeight - offsetY
        } else {
            pos[1] = pos[1] - offsetY
        }

        return [pos[0], pos[1]]
    }
}

export default BattleShipsGame