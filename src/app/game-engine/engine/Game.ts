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

  public stop() {
    this.gameLoop.stop()
    this.gameData.entityManager.clear()
  }

  public addObject(entity: Entity) {
    this.gameData.entityManager.addObject(entity)
    if (this.isCollidable(entity)) {
      this.gameData.collisionHandler.addCollidable(entity);
    }
  }

  public addEnemy(entity: Entity) {
    this.gameData.entityManager.addEnemy(entity)
    if (this.isCollidable(entity)) {
      this.gameData.collisionHandler.addCollidable(entity);
    }
  }

  public addPlayer(entity: Entity) {
    this.gameData.entityManager.addPlayer(entity)
    if (this.isCollidable(entity)) {
      this.gameData.collisionHandler.addCollidable(entity);
    }
  }

  protected abstract preload(gameData: GameData): void
  protected abstract setup(gameData: GameData): void
  protected abstract setupEntities(): void
  protected abstract restart(): void
  protected checkRoundOver(gameData: GameData): void { }
  protected checkGameOver(gameData: GameData): void { }
  protected checkIsPlayAlive(gameData: GameData): void { }


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

  protected render() {
    this.gameData.entityManager.getEntities().forEach(e => e.render(this.gameData))
    if (this.isGameOver) {
      this.drawBigText("Game Over", 80, this.gameData.screenWidth / 2, this.gameData.screenHeight / 2)
      this.drawSmallText("Press ENTER to restart", 90, this.gameData.screenWidth / 2, (this.gameData.screenHeight / 2) + 50)
    }
  }

  public drawBigText(text: string, offset: number, x: number, y: number): void {
    const { context } = this.gameData
    context.fillStyle = "white"
    context.font = "35px Arial"
    context.fillText(text, x - offset, y)
  }

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
