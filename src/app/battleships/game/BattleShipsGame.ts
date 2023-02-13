import Game from "src/app/game-engine/engine/Game";
import ShipController from "./ShipController";
import { Utils } from "./Utils";

class BattleShipsGame extends Game {

    public isPlayerTurn: boolean = false

    private shipController: ShipController
    private shipsSetup: boolean = false

    private targetWidth: number = 20
    private targetHeight: number = 20

    constructor(canvasEl: HTMLCanvasElement) {
        super(canvasEl)
    }

    protected preload(): void {
        // TODO: add option in ship in which direction to draw it
        // horizontal or vertical
        // check if total length or width of ship is within canvas bounds
        // cannot draw other ships on top of already drawn ships
        this.shipController = new ShipController(this.gameData)
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

    protected render(): void {
        super.render()
        if (!this.shipsSetup) {
            this.shipController.placeShips()
            this.shipsSetup = true
        }
    }

    private targetArea(pos: [number, number]): void {
        const { context } = this.gameData
        context.fillStyle = "red"
        pos = Utils.alignXAndY(pos, this.targetWidth, this.targetHeight)
        context.fillRect(pos[0], pos[1], this.targetWidth, this.targetHeight)
    }
}

export default BattleShipsGame