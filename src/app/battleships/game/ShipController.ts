import { GameData } from "src/app/game-engine/engine/types";
import { Ship } from "./Ship";
import { ShipDirection } from "./ShipDirectionEnum";
import { Utils } from "./Utils";

class ShipController {

    private targetWidth: number
    private targetHeight: number

    private gameData: GameData
    private shipNames: string[] = ['Cruiser', 'Destroyer', 'Aircraft carrier', 'Frigate', 'Ironclad']
    private ships: Ship[] = []
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

    private setRandomShipPositions() {
        const maxX = this.gameData.screenWidth - this.targetWidth
        const maxY = this.gameData.screenHeight - this.targetHeight

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
            maxX = this.gameData.screenWidth - (length * this.targetWidth)
            width = length * this.targetWidth
            height = this.targetHeight
        }
        else {
            maxY = this.gameData.screenWidth - (length * this.targetHeight)
            width = this.targetWidth
            height = length * this.targetHeight
        }

        const x = this.random(0, maxX)
        const y = this.random(0, maxY)
        const x_y = Utils.alignXAndY([x, y], this.targetWidth, this.targetHeight)

        if (this.takenPositions.some(pos => pos[0] === x_y[0] || pos[1] === x_y[1])) {
            return this.decidedXAndY(maxX, maxY)
        }

        for (let x = x_y[0]; x <= x_y[0] + width; x += this.targetWidth) {
            for (let y = x_y[1]; y <= x_y[1] + height; y += this.targetHeight) {
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