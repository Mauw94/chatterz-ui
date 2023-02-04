import Enemy from "./Enemy"

class EnemyController {

    // TODO: generate enemymap for each level again
    private enemyMapEasiest = [
        [1, 1],
        [2]
    ]
    private enemyMapEasy = [
        [1, 1, 1],
        [1, 2, 1],
        [3, 1, 1]
    ]
    private enemyMapModest = [
        [1, 1, 1, 2, 1],
        [1, 1, 1, 1, 3],
        [1, 3, 3, 2, 3],
        [1, 2, 2, 1, 1],
    ]
    private enemyRows = []

    public spawnEnemies(level: number) {
        this.enemyMapEasiest.forEach((row, rowIndex) => {
            this.enemyRows[rowIndex] = []
            row.forEach((enemyNumber, enemyIndex) => {
                if (enemyNumber > 0) {
                    const enemy = new Enemy(enemyNumber, enemyIndex * 50, rowIndex * 35)
                    this.enemyRows[rowIndex].push(
                        this.modifyEnemyBasedOnlevel(enemy, level)
                    )
                }
            })
        })
    }

    public enemies() {
        return this.enemyRows.flat()
    }

    private modifyEnemyBasedOnlevel(enemy: Enemy, level: number): Enemy {
        // enemy.stats * level or something
        return enemy
    }
}

export default EnemyController