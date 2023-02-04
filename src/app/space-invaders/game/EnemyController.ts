import Enemy from "./Enemy"

class EnemyController {

    private level: number = 1
    
    // TODO: generate enemymap for each level again
    private enemyMap = [
        [1, 1, 1, 2, 1],
        [1, 1, 1, 1, 3],
        [1, 3, 3, 2, 3],
        [1, 2, 2, 1, 1],
    ]
    private enemyRows = []

    public spawnEnemies() {
        this.enemyMap.forEach((row, rowIndex) => {
            this.enemyRows[rowIndex] = []
            row.forEach((enemyNumber, enemyIndex) => {
                if (enemyNumber > 0) {
                    this.enemyRows[rowIndex].push(
                        new Enemy(enemyNumber, enemyIndex * 50, rowIndex * 35)
                    )
                }
            })
        })
    }

    public enemies() {
        return this.enemyRows.flat()
    }

    public nextLevel() {
        this.level++
        // TODO: increase enemy stats
    }
}

export default EnemyController