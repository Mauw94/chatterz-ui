import ShipController from "./ShipController";
import { Utils } from "./Utils";

class BattleShipsGame {

    public isPlayerTurn: boolean = false
    public isPlayerBoard: boolean = false

    private shipController: ShipController
    private targetWidth: number = 25
    private targetHeight: number = 25
    private targettedAreas: [number, number][] = []

    constructor() { }

    public setup(canvas: HTMLCanvasElement): void {
        this.shipController = new ShipController(canvas.width, canvas.height, this.targetWidth, this.targetHeight)
        const context = canvas.getContext("2d")
        context.fillStyle = "lightblue"
        context.fillRect(0, 0, canvas.width, canvas.height)
        this.shipController.placeShips(canvas)
    }

    // TODO: fix so that each canvas has their own shipcontroller
    public targetArea(canvas: HTMLCanvasElement, mousePos: [number, number]): void {
        const pos = Utils.alignXAndY(mousePos, this.targetWidth, this.targetHeight)
        const context = canvas.getContext("2d")
        const shipPositions = this.shipController.getShipPositions()

        if (shipPositions.find(x => x[0] === pos[0] && x[1] === pos[1])) {
            context.fillStyle = "red"
        } else {
            context.fillStyle = "yellow"
        }
        context.fillRect(pos[0], pos[1], this.targetWidth, this.targetHeight)
    }

    public targetRandomXAndY(canvas: HTMLCanvasElement) {
        const x = Utils.random(0, canvas.width)
        const y = Utils.random(0, canvas.height)
        const pos = Utils.alignXAndY([x, y], this.targetWidth, this.targetHeight)

        if (this.targettedAreas.find(t => t[0] === pos[0] && t[1] === pos[1])) {
            return this.targetRandomXAndY(canvas)
        }

        this.targettedAreas.push(pos)

        return pos
    }
}

export default BattleShipsGame