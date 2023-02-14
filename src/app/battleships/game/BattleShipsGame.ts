import Game from "src/app/game-engine/engine/Game";
import ShipController from "./ShipController";
import { Utils } from "./Utils";

class BattleShipsGame extends Game {

    public isPlayerTurn: boolean = false
    public isPlayerBoard: boolean = false

    private shipController: ShipController
    private shipsSetup: boolean = false

    private targetWidth: number = 25
    private targetHeight: number = 25

    private targettedAreas: [number, number][] = []

    constructor(canvasEl: HTMLCanvasElement, isPlayerTurn: boolean, isPlayerBoard: boolean) {
        super(canvasEl)
        this.isPlayerTurn = isPlayerTurn
        this.isPlayerBoard = isPlayerBoard
    }

    protected preload(): void {
        this.shipController = new ShipController(this.gameData, this.targetWidth, this.targetHeight)
    }

    protected setup(): void {
        const { context } = this.gameData
        context.fillStyle = "lightblue"
        context.fillRect(0, 0, this.gameData.screenWidth, this.gameData.screenHeight)
    }

    protected update(delta: number): void {
        super.update(delta)
        const { keyListener } = this.gameData
        if (keyListener.isMouseDown() && this.isPlayerTurn && !this.isPlayerBoard) {
            const pos = Utils.alignXAndY(keyListener.getMousePos(), this.targetWidth, this.targetHeight)
            this.targetArea(pos)
        }
    }

    protected render(): void {
        super.render()
        if (!this.shipsSetup) {
            this.shipController.placeShips(this.isPlayerBoard)
            this.shipsSetup = true
        }
    }

    private targetArea(pos: [number, number]): void {
        const { context } = this.gameData
        const shipPositions = this.shipController.getShipPositions()

        if (shipPositions.find(x => x[0] === pos[0] && x[1] === pos[1])) {
            context.fillStyle = "red"
        } else {
            context.fillStyle = "yellow"
        }
        context.fillRect(pos[0], pos[1], this.targetWidth, this.targetHeight)
    }

    private targetRandomXAndY() {
        const x = Utils.random(0, this.gameData.screenWidth)
        const y = Utils.random(0, this.gameData.screenHeight)
        const pos = Utils.alignXAndY([x, y], this.targetWidth, this.targetHeight)

        if (this.targettedAreas.find(t => t[0] === pos[0] && t[1] === pos[1])) {
            return this.targetRandomXAndY()
        }

        this.targettedAreas.push(pos)

        return pos
    }
}

export default BattleShipsGame