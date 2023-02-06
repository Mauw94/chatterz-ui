import { GameData } from "src/app/game-engine/engine/types"
import Enemy from "./Enemy"

// TODO: create unit tests for this 
class EnemyController {

    // TODO: generate enemymap for each level again
    // private enemyMapEasiest = [
    //     [1, 1],
    //     [2]
    // ]
    // private enemyMapEasy = [
    //     [1, 1, 1],
    //     [1, 2, 1],
    //     [3, 1, 1]
    // ]
    // private enemyMapModest = [
    //     [1, 1, 1, 2, 1],
    //     [1, 1, 1, 1, 3],
    //     [1, 3, 3, 2, 3],
    //     [1, 2, 2, 1, 1],
    // ]

    private gameData: GameData

    private enemyRows = []
    private occupiedPoints: [number, number][]

    constructor(gameData: GameData) {
        this.gameData = gameData
    }

    /**
     * Spawn enemies based on the current game level
     * @param level 
     */
    public spawnEnemies(level: number) {
        this.occupiedPoints = []
        const enemyMap = this.createEnemyMap(level, 0.5)

        enemyMap.forEach((row, rowIndex) => {
            this.enemyRows[rowIndex] = []
            row.forEach((enemyNumber, enemyIndex) => {
                if (enemyNumber > 0) {
                    const spawn = this.getSpawnPoint(rowIndex, enemyIndex)
                    const enemy = new Enemy(
                        enemyNumber,
                        spawn[0],
                        spawn[1])
                    this.enemyRows[rowIndex].push(
                        this.modifyEnemyBasedOnlevel(enemy, level)
                    )
                }
            })
        })
    }

    /**
     * Get all the current enemies that were spawned (dead or alive)
     * @returns 
     */
    public enemies() {
        return this.enemyRows.flat()
    }

    private modifyEnemyBasedOnlevel(enemy: Enemy, level: number): Enemy {
        let shootIntervalMin = 500
        let shootIntervalMax = 750
        let speed = 15

        if (level % 3 === 0) {
            shootIntervalMin = shootIntervalMin - (level * 15)
            shootIntervalMax = shootIntervalMax - (level * 15)
            speed = speed + (level * 2)
        }

        enemy.setBulletShootInterval(this.random(shootIntervalMin, shootIntervalMax))
        enemy.speed = speed

        return enemy
    }

    private createEnemyMap(level: number, offset: number) {
        let rows = Math.floor((level) + offset)
        let cols = Math.floor((level * 1) + offset)
        rows = rows + (rows % 2)
        cols = cols + (cols % 2)

        const enemyMap = []

        for (let r = 0; r < rows; r++) {
            enemyMap[r] = []
            for (let c = 0; c < cols; c++) {
                enemyMap[r].push(this.random(1, 3))
            }
        }

        return enemyMap
    }

    private random(min: number, max: number) {
        return (Math.floor(Math.random() * (max - min + 1) + min))
    }

    private getSpawnPoint(rowIndex: number, enemyIndex: number): [number, number] {
        let x = enemyIndex * this.random(50, 150)
        let y = rowIndex * this.random(-75, -150)

        if (x + 44 >= this.gameData.screenWidth) {
            x = this.random(0, this.gameData.screenWidth - 44)
            y -= 60
        }

        return [x, y]
    }
}

export default EnemyController