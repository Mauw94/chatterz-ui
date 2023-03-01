import Game from "src/app/game-engine/engine/Game";
import { GameData } from "src/app/game-engine/engine/types";
import GameMap from "./GameMap";
import Player from "./Player";
import EnemyController from "./EnemyController";
import { SpaceInvadersService } from "src/services/spaceinvaders.service";


class SpaceInvadersGame extends Game {

    private level: number = 1
    private playerStartingPositions = [260, 550]
    private player: Player
    private enemyController: EnemyController
    private highscore: number
    private spaceinvadersService: SpaceInvadersService
    private gameId: number
    private canSaveScore: boolean

    constructor(canvasEl: HTMLCanvasElement, spaceinvadersService: SpaceInvadersService, gameId: number) {
        super(canvasEl);
        this.spaceinvadersService = spaceinvadersService
        this.gameId = gameId
    }

    protected preload(): void {
        this.spaceinvadersService.highScore().subscribe((highscore) => {
            this.highscore = highscore
            console.log(highscore) // TODO: create a scoreboard to display this
        })
        this.enemyController = new EnemyController(this.gameData)
        this.enemyController.spawnEnemies(this.level)
        this.canSaveScore = true
    }

    protected setup(): void {
        this.player = new Player(this.playerStartingPositions[0], this.playerStartingPositions[1])

        this.addObject(new GameMap())
        this.addPlayer(this.player)

        const enemies = this.enemyController.enemies()
        enemies.forEach(e => this.gameData.entityManager.addEnemy(e))
    }

    protected checkRoundOver(gameData: GameData): void {
        const { entityManager } = gameData
        if (entityManager.getEnemies().length === 0) {
            this.isRoundOver = true

            // remove remaining bullets
            const bullets = this.gameData.entityManager.getAllBulletsLeftOnScreen()
            bullets.forEach(b => this.gameData.entityManager.removeEntity(b))
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
                this.saveScore()
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
            this.saveScore()
        }
    }

    protected render(): void {
        super.render()
        this.drawSmallText("Level: " + this.level, 0, 10, 20)
        this.drawSmallText("Health: " + this.player.health, 0, this.gameData.screenWidth - 90, 20)
        this.drawSmallText("Bullets: " +
            (this.player.MAX_BULLETS - this.gameData.entityManager.getBullets().length) + "/" + this.player.MAX_BULLETS,
            0,
            this.gameData.screenWidth / 2 - 75,
            20)

        if (this.isRoundOver && !this.isGameOver) {
            this.drawSmallText(
                "Round won!",
                50,
                this.gameData.screenWidth / 2,
                (this.gameData.screenHeight / 2) - 30)

            this.drawSmallText(
                "Press ENTER for the next level",
                150,
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

        this.gameData.entityManager.clearBullets()
        this.enemyController.spawnEnemies(this.level)
        const enemies = this.enemyController.enemies()
        enemies.forEach(e => this.gameData.entityManager.addEnemy(e))
    }

    private saveScore() {
        if (this.canSaveScore) {
            this.spaceinvadersService.saveScore(this.gameId, 5).subscribe({
                next: () => {
                    this.canSaveScore = false
                },
                error: (err) => console.error(err)
            })
        }
    }
}

export default SpaceInvadersGame