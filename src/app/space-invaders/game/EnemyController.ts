import { GameData } from "src/app/game-engine/engine/types"
import Enemy from "./Enemy"

// TODO: create unit tests for this 
class EnemyController {

    private gameData: GameData

    private enemyRows = []
    private xSpawns: number[]

    constructor(gameData: GameData) {
        this.gameData = gameData
    }

    /**
     * Spawn enemies based on the current game level
     * @param level 
     */
    public spawnEnemies(level: number) {
        this.xSpawns = []
        const enemyMap = this.createEnemyMap(level, 0.5)

        enemyMap.forEach((row, rowIndex) => {
            this.enemyRows[rowIndex] = []
            row.forEach((enemyNumber, enemyIndex) => {
                if (enemyNumber > 0) {
                    const spawn = this.getSpawnPoint(rowIndex)
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
        const shootIntervalMin = 250
        let shootIntervalMax = 1000
        let speed = 15

        if (level % 3 === 0) {
            shootIntervalMax = shootIntervalMax - (level * 20)
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

    private getSpawnPoint(rowIndex: number): [number, number] {
        const x = this.findXSpawnPoint()
        const y = this.findYSpawnPoint(rowIndex, x)

        this.xSpawns.push(x)

        return [x, y]
    }

    private findXSpawnPoint(): number {
        let x = this.random(0, this.gameData.screenWidth - 44)
        for (let xi = 0; xi < this.xSpawns.length; xi++) {
            if (x >= this.xSpawns[xi] && x <= (this.xSpawns[xi] + 44)) {
                return this.findXSpawnPoint()
            }
        }

        return x
    }

    private findYSpawnPoint(rowIndex: number, x: number): number {
        return rowIndex * this.random(-75, -250)
    }
}

export default EnemyController