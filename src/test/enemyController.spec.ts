// import 'jasmine'
import EntityManager from 'src/app/game-engine/engine/EntityManager'
import KeyListener from 'src/app/game-engine/engine/KeyListener'
import CollisionHandler from 'src/app/game-engine/engine/collision/CollisionHandler'
import { GameData } from 'src/app/game-engine/engine/types'
import EnemyController from 'src/app/space-invaders/game/EnemyController'

describe('EnemyController', () => {
    const gameData: GameData = {
        context: undefined,
        screenWidth: 0,
        screenHeight: 0,
        keyListener: new KeyListener(),
        collisionHandler: new CollisionHandler(),
        entityManager: new EntityManager()
    }
    let enemyController: EnemyController

    beforeEach(() => {
        enemyController = new EnemyController(gameData)
    })

    it('should return new array containing enemies', () => {
        enemyController.spawnEnemies(1)
        const enemies = enemyController.enemies()

        expect(enemies).toBeDefined()
        expect(enemies.length).toBe(4)
    })
})