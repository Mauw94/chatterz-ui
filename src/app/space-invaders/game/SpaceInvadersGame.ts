import Game from "src/app/game-engine/engine/Game";
import { GameData } from "src/app/game-engine/engine/types";
import GameMap from "./GameMap";
import Player from "./Player";
import EnemyController from "./EnemyController";


class SpaceInvadersGame extends Game {

    private level: number = 1
    private playerStartingPositions = [260, 550]
    private player: Player
    private enemyController: EnemyController

    constructor(canvasEl: HTMLCanvasElement) {
        super(canvasEl);
    }

    protected preload(): void {
        this.enemyController = new EnemyController(this.gameData)
        this.enemyController.spawnEnemies(this.level)
    }

    protected setup(): void {
        this.player = new Player(this.playerStartingPositions[0], this.playerStartingPositions[1])

        this.addObject(new GameMap())
        this.addPlayer(this.player)

        const enemies = this.enemyController.enemies()
        enemies.forEach(e => this.gameData.entityManager.addEnemy(e))
    }

    protected restart(): void {
        this.isGameOver = false
        this.gameData.entityManager.clear()
        this.preload()
        this.setup()
        this.setupEntities()
    }

    protected setupEntities() {
        this.gameData.entityManager.getEntities().map(e => e.setup())
    }

    protected checkRoundOver(gameData: GameData): void {
        const { entityManager } = gameData
        if (entityManager.getEnemies().length === 0) {
            this.isRoundOver = true

            // remove remaining bullets
            const bullets = this.gameData.entityManager.getBullets()
            bullets.forEach(b => this.gameData.entityManager.removeBullet(b))
        }
    }

    protected checkGameOver(gameData: GameData): void {
        const { collisionHandler } = gameData
        const players = gameData.entityManager.getPlayers()
        const enemies = gameData.entityManager.getEnemies()

        players.forEach(p => {
            const collision = collisionHandler.checkCollisionWith(p, enemies)
            if (collision != null) {
                this.isGameOver = true
            }
        })

        enemies.forEach(e => {
            if (e.yPos + e.height >= this.gameData.screenHeight) {
                this.gameData.entityManager.removeEnemy(e)
                this.player.health--
            }
        })
    }

    protected update(delta: number): void {
        super.update(delta)
        const { keyListener } = this.gameData
        if (this.isRoundOver && !this.isGameOver) {
            if (keyListener.isKeyDown("Enter")) {
                this.setupNextLevel()
            }
        }

        if (this.player.health <= 0) {
            this.isGameOver = true
        }
    }

    protected render(): void {
        super.render()
        this.drawSmallText("Level: " + this.level, 0, 10, this.gameData.screenHeight - 10)
        this.drawSmallText("Health: " + this.player.health, 0, this.gameData.screenWidth - 90, this.gameData.screenHeight - 10)

        if (this.isRoundOver && !this.isGameOver) {
            this.drawSmallText(
                "Press ENTER for the next level",
                120,
                this.gameData.screenWidth / 2,
                this.gameData.screenHeight / 2)
        }
    }

    private setupNextLevel() {
        this.level++
        this.player.health++
        this.isRoundOver = false
        this.player.xPos = this.playerStartingPositions[0]
        this.player.yPos = this.playerStartingPositions[1]

        this.enemyController.spawnEnemies(this.level)
        const enemies = this.enemyController.enemies()
        enemies.forEach(e => this.gameData.entityManager.addEnemy(e))
    }
}

export default SpaceInvadersGame