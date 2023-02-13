import { GameData } from "src/app/game-engine/engine/types";
import { Ship } from "./Ship";
import { ShipDirection } from "./ShipDirectionEnum";
import { Utils } from "./Utils";

class ShipController {

    private gameData: GameData
    private shipNames: string[] = ['Cruiser', 'Destroyer', 'Aircraft carrier', 'Frigate', 'Ironclad']
    private ships: Ship[] = []
    private takenPositions: [number, number][] = []

    constructor(gameData: GameData) {
        this.gameData = gameData
        this.getShipPositions()
    }

    public getShips() {
        return this.ships
    }

    public placeShips() {
        if (this.ships.length === 0) return
        const { context } = this.gameData
        this.ships.forEach(s => {
            context.fillStyle = "yellow"
            context.fillRect(s.x, s.y, s.width, s.height)
        })
    }

    private getShipPositions() {
        const maxX = this.gameData.screenWidth - 20
        const maxY = this.gameData.screenHeight - 20

        this.shipNames.forEach(name => {
            const { x_y, width, height } = this.decidedXAndY(maxX, maxY)

            const ship: Ship = {
                name: name,
                x: x_y[0],
                y: x_y[1],
                width: width,
                height: height
            }

            this.ships.push(ship)
        })
    }

    private decidedXAndY(maxX: number, maxY: number) {
        const length = this.random(3, 5)
        const direction = this.random(0, 1) === 1 ? ShipDirection.horizontal : ShipDirection.vertical

        let width = 0
        let height = 0

        if (direction === ShipDirection.horizontal) {
            maxX = this.gameData.screenWidth - (length * 20)
            width = length * 20
            height = 20
        }
        else {
            maxY = this.gameData.screenWidth - (length * 20)
            width = 20
            height = length * 20
        }

        const x = this.random(0, maxX)
        const y = this.random(0, maxY)
        const x_y = Utils.alignXAndY([x, y], 20, 20)

        if (this.takenPositions.some(pos => pos[0] === x_y[0] || pos[1] === x_y[1])) {
            return this.decidedXAndY(maxX, maxY)
        }

        for (let x = x_y[0]; x <= x_y[0] + width; x++) {
            for (let y = x_y[1]; y <= x_y[1] + height; y++) {
                this.takenPositions.push([x, y])
            }
        }

        return { x_y, width, height }
    }

    private random(min: number, max: number) {
        return (Math.floor(Math.random() * (max - min + 1) + min))
    }

}

export default ShipController