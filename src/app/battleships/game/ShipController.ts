import { GameData } from "src/app/game-engine/engine/types";
import { Ship } from "./Ship";
import { ShipDirection } from "./ShipDirectionEnum";
import { Utils } from "./Utils";

class ShipController {

    private targetWidth: number
    private targetHeight: number

    private gameData: GameData
    private ships: Ship[] = [
        {
            name: "Cruiser",
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            length: 4
        },
        {
            name: "Destroyer",
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            length: 5
        },
        {
            name: "Aircraft Carrier",
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            length: 7
        },
        {
            name: "Frigate",
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            length: 3
        },
        {
            name: "Ironclad",
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            length: 4
        },
    ]
    private takenPositions: [number, number][] = []

    constructor(gameData: GameData, targetWidth: number, targetHeight: number) {
        this.gameData = gameData
        this.targetWidth = targetWidth
        this.targetHeight = targetHeight

        this.setRandomShipPositions()
    }

    public getShips() {
        return this.ships
    }

    public placeShips(isPlayerBoard: boolean) {
        if (this.ships.length === 0) return
        const { context } = this.gameData
        this.ships.forEach(s => {
            if (isPlayerBoard) {
                context.fillStyle = "orange"
                context.fillRect(s.x, s.y, s.width, s.height)
            }
        })
    }

    public getShipPositions() {
        let positions: [number, number][] = []
        this.ships.forEach(s => {
            for (let x = s.x; x < s.x + s.width; x += this.targetWidth) {
                for (let y = s.y; y < s.y + s.height; y += this.targetHeight) {
                    positions.push([x, y])
                }
            }
        })
        return positions
    }

    /**
     * Place ships on a random position on the canvas. 
     * Ships cannot overlap.
     */
    private setRandomShipPositions() {
        const maxX = this.gameData.screenWidth - this.targetWidth
        const maxY = this.gameData.screenHeight - this.targetHeight

        this.ships.forEach(s => {
            const { x_y, width, height } = this.decidedXAndY(maxX, maxY, s.length)
            s.x = x_y[0]
            s.y = x_y[1]
            s.width = width
            s.height = height
        })
    }

    /**
     * Find X and Y coordinate for a ship. 
     * Cannot overlap on another ship position.
     * @param maxX 
     * @param maxY 
     * @param length 
     * @returns 
     */
    private decidedXAndY(maxX: number, maxY: number, length: number) {
        const direction = Utils.random(0, 1) === 1 ? ShipDirection.horizontal : ShipDirection.vertical

        let width = 0
        let height = 0

        if (direction === ShipDirection.horizontal) {
            maxX = this.gameData.screenWidth - (length * this.targetWidth)
            width = length * this.targetWidth
            height = this.targetHeight
        }
        else {
            maxY = this.gameData.screenWidth - (length * this.targetHeight)
            width = this.targetWidth
            height = length * this.targetHeight
        }

        const x = Utils.random(0, maxX)
        const y = Utils.random(0, maxY)
        const x_y = Utils.alignXAndY([x, y], this.targetWidth, this.targetHeight)

        if (this.takenPositions.some(pos => pos[0] === x_y[0] || pos[1] === x_y[1])) {
            return this.decidedXAndY(maxX, maxY, length)
        }

        for (let x = x_y[0]; x <= x_y[0] + width; x += this.targetWidth) {
            for (let y = x_y[1]; y <= x_y[1] + height; y += this.targetHeight) {
                this.takenPositions.push([x, y])
            }
        }

        return { x_y, width, height }
    }

}

export default ShipController