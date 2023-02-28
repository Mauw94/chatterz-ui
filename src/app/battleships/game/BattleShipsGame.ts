import ShipController from "./ShipController";
import { Utils } from "./Utils";
import { GameData } from "src/app/game-engine/engine/types";
import KeyListener from "src/app/game-engine/engine/KeyListener";
import CollisionHandler from "src/app/game-engine/engine/collision/CollisionHandler";
import EntityManager from "src/app/game-engine/engine/EntityManager";

class BattleShipsGame {

    public isPlayerTurn: boolean = false
    public isPlayerBoard: boolean = false

    private shipController: ShipController
    private shipsSetup: boolean = false

    private targetWidth: number = 25
    private targetHeight: number = 25

    private targettedAreas: [number, number][] = []
    protected canvasEl: HTMLCanvasElement

    private gameData: GameData

    constructor(canvasEl: HTMLCanvasElement, isPlayerTurn: boolean, isPlayerBoard: boolean) {
        this.canvasEl = canvasEl
        this.gameData = {
            context: canvasEl.getContext("2d"),
            screenWidth: canvasEl.width,
            screenHeight: canvasEl.height,
            keyListener: new KeyListener(),
            collisionHandler: new CollisionHandler(),
            entityManager: new EntityManager()
          }
        this.isPlayerTurn = isPlayerTurn
        this.isPlayerBoard = isPlayerBoard
    }

    // TODO: remove game engine -> only create 1 game with 2 different canvases
    // don't run update, just update on mouse click -> switch to computer turn
    // add 2sec timer or so for computer turn, computer plays
    // then player turn again
    protected preload(): void {
        this.shipController = new ShipController(this.gameData, this.targetWidth, this.targetHeight)
        this.setup()
    }

    protected setup(): void {
        const { context } = this.gameData
        context.fillStyle = "lightblue"
        context.fillRect(0, 0, this.gameData.screenWidth, this.gameData.screenHeight)
        this.shipController.placeShips(this.isPlayerBoard)
    }

    protected update(delta: number): void {
        const { keyListener } = this.gameData
        if (keyListener.isMouseDown() && this.isPlayerTurn && !this.isPlayerBoard) {
            const pos = Utils.alignXAndY(keyListener.getMousePos(), this.targetWidth, this.targetHeight)
            this.targetArea(pos)
        } else if (!this.isPlayerTurn) {
            
            console.log("Computer's turn")
        }
    }

    protected render(): void {
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