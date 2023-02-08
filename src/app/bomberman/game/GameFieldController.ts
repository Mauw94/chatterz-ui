import { GameData } from "src/app/game-engine/engine/types";
import Wall from "./Wall";
import Brick from "./Brick";

class GameFieldController {

    // tilesize = 64
    // width = 1280 = 20 blocks
    // heigth = 702 = 11 blocks
    private gameData: GameData
    private field = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
        [1, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 2, 2, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
        [1, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 2, 2, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]

    constructor(gameData: GameData) {
        this.gameData = gameData
    }

    public createPlayingField(): [Wall[][], Brick[][]] {
        let bricks = []
        let walls = []

        this.field.forEach((row, rowIndex) => {
            walls[rowIndex] = []
            bricks[rowIndex] = []
            row.forEach((_, colIndex) => {
                if (this.field[rowIndex][colIndex] === 1) {
                    const wall = new Wall(colIndex * 64, rowIndex * 64)
                    walls[rowIndex].push(wall)
                }
                else if (this.field[rowIndex][colIndex] === 2) {
                    const brick = new Brick(colIndex * 64, rowIndex * 64)
                    bricks[rowIndex].push(brick)
                }
            })
        })

        return [walls, bricks]
    }
}

export default GameFieldController