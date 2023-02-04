import Game from "src/app/game-engine/engine/Game";
import { GameData } from "src/app/game-engine/engine/types";
import GameMap from "./GameMap";
import Player from "./Player";
import EnemyController from "./EnemyController";
import GameLoop from "src/app/game-engine/engine/GameLoop";


class SpaceInvadersGame extends Game {

    private level: number = 1
    private enemyController: EnemyController

    constructor(canvasEl: HTMLCanvasElement) {
        super(canvasEl);
    }

    public run() {
        this.gameData.keyListener.setup(this.canvasEl)

        this.preload(this.gameData)
        this.setup(this.gameData)

        this.setupEntities()
        const gameLoop = new GameLoop(
            this.update.bind(this),
            this.render.bind(this)
        )
        gameLoop.run()
    }

    protected preload(gameData: GameData): void {
        this.enemyController = new EnemyController()
        this.enemyController.spawnEnemies()
    }

    protected setup(gameData: GameData): void {
        this.addObject(new GameMap())
        this.addPlayer(new Player())

        const enemies = this.enemyController.enemies()
        enemies.forEach(e => gameData.entityManager.addEnemy(e))
    }

    protected restart(): void {
        this.isGameOver = false
        this.gameData.entityManager.clear()
        this.preload(this.gameData)
        this.setup(this.gameData)
        this.setupEntities()
    }

    protected setupEntities() {
        this.gameData.entityManager.getEntities().map(e => e.setup())
    }

    protected checkRoundOver(gameData: GameData): void {
        
    }

    protected checkGameOver(gameData: GameData): void {
        const { collisionHandler } = gameData
        const players = gameData.entityManager.getPlayers()
        const enemies = gameData.entityManager.getEnemies()

        players.forEach(p => {
            const collision = collisionHandler.checkCollisionWith(p, enemies)
            if (collision != null) {
                console.log("collision with enemy")
                this.isGameOver = true
            }
        })
    }

    protected update(delta: number): void {
        super.update(delta)
    }

    protected render(): void {
        super.render()
    }


}

export default SpaceInvadersGame