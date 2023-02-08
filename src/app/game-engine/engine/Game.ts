import GameLoop from "./GameLoop"
import { GameData } from "./types"
import KeyListener from "./KeyListener"
import Entity from "./Entity"
import CollisionHandler from "./collision/CollisionHandler"
import Collidable from "./collision/Collidable"
import EntityManager from "./EntityManager"

abstract class Game {

  public isGameOver: boolean = false
  public isRoundOver: boolean = false

  protected gameData: GameData
  protected canvasEl: HTMLCanvasElement

  private gameLoop: GameLoop

  constructor(canvasEl: HTMLCanvasElement) {
    this.canvasEl = canvasEl
    this.gameData = {
      context: canvasEl.getContext("2d"),
      screenWidth: canvasEl.width,
      screenHeight: canvasEl.height,
      keyListener: new KeyListener(),
      collisionHandler: new CollisionHandler(),
      entityManager: new EntityManager()
    }
  }

  /**
   * Execute the setup methods and initialize the gameloop
   */
  public run() {
    this.gameData.keyListener.setup(this.canvasEl)

    this.preload()
    this.setup()

    this.setupEntities()
    this.gameLoop = new GameLoop(
      this.update.bind(this),
      this.render.bind(this)
    )
    this.gameLoop.run()
  }

  /**
   * Stop the gameloop
   */
  public stop() {
    this.gameLoop.stop()
    this.gameData.entityManager.clear()
  }

  /**
   * Add entity to entitymanager
   * @param entity 
   */
  public addObject(entity: Entity) {
    this.gameData.entityManager.addObject(entity)
    if (this.isCollidable(entity)) {
      this.gameData.collisionHandler.addCollidable(entity);
    }
  }

  /**
   * Add entity to entitymanager
   * @param entity 
   */
  public addEnemy(entity: Entity) {
    this.gameData.entityManager.addEnemy(entity)
    if (this.isCollidable(entity)) {
      this.gameData.collisionHandler.addCollidable(entity);
    }
  }

  /**
   * Add entity to entitymanager
   * @param entity 
   */
  public addPlayer(entity: Entity) {
    this.gameData.entityManager.addPlayer(entity)
    if (this.isCollidable(entity)) {
      this.gameData.collisionHandler.addCollidable(entity);
    }
  }

  /**
   * Add background
   * @param entity 
   */
  public addBackground(entity: Entity) {
    this.gameData.entityManager.addBackground(entity)
  }

  protected abstract preload(): void
  protected abstract setup(): void
  protected abstract setupEntities(): void
  protected abstract restart(): void
  protected checkRoundOver(gameData: GameData): void { }
  protected checkGameOver(gameData: GameData): void { }
  protected checkIfPlayerIsAlive(gameData: GameData): void { }

  /**
   * Update game every x delta cycle
   * @param delta delta in ms
   */
  protected update(delta: number) {
    const { keyListener } = this.gameData

    if (!this.isGameOver && !this.isRoundOver) {
      this.gameData.entityManager.getEntities().forEach(e => e.update(this.gameData, delta))
      this.checkRoundOver(this.gameData)
      this.checkGameOver(this.gameData)
    } else {
      if (this.isGameOver && !this.isRoundOver) {
        if (keyListener.isKeyDown("Enter")) {
          this.restart()
        }
      }
    }
  }

  /**
   * Render game every x delta cycle
   */
  protected render() {
    this.gameData.entityManager.getEntities().forEach(e => e.render(this.gameData))
    if (this.isGameOver) {
      this.drawBigText("Game Over", 80, this.gameData.screenWidth / 2, this.gameData.screenHeight / 2)
      this.drawSmallText("Press ENTER to restart", 90, this.gameData.screenWidth / 2, (this.gameData.screenHeight / 2) + 50)
    }
  }

  /**
   * Draw text with big font (35px)
   * @param text 
   * @param offset 
   * @param x x coord
   * @param y y coord
   */
  public drawBigText(text: string, offset: number, x: number, y: number): void {
    const { context } = this.gameData
    context.fillStyle = "white"
    context.font = "35px Arial"
    context.fillText(text, x - offset, y)
  }

  /**
   * Draw text with small(er) front (20px)
   * @param text 
   * @param offset 
   * @param x x coord
   * @param y y coord
   */
  public drawSmallText(text: string, offset: number, x: number, y: number): void {
    const { context } = this.gameData
    context.fillStyle = "white"
    context.font = "20px Arial"
    context.fillText(text, x - offset, y)
  }

  private isCollidable(entity: Entity | Collidable): entity is Collidable {
    return (entity as Collidable).getCollisionBox !== undefined;
  }

}

export default Game
