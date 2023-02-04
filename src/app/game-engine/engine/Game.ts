import GameLoop from "./GameLoop"
import { GameData } from "./types"
import KeyListener from "./KeyListener"
import Entity from "./Entity"
import CollisionHandler from "./collision/CollisionHandler"
import Collidable from "./collision/Collidable"
import EntityManager from "./EntityManager"

abstract class Game {

  private canvasEl: HTMLCanvasElement
  private gameData: GameData
  private gameLoop: GameLoop

  constructor(canvasEl: HTMLCanvasElement) {
    this.canvasEl = canvasEl
    this.gameData = {
      context: canvasEl.getContext("2d"),
      screenWidth: canvasEl.width,
      screenHeight: canvasEl.height,
      keyListener: new KeyListener(),
      collisionHandler: new CollisionHandler(),
      entityManager: new EntityManager
    }
  }

  public run() {
    this.gameData.keyListener.setup(this.canvasEl)

    this.preload(this.gameData) // TODO: add imageCache to gameData
    this.setup(this.gameData)

    this.setupEntities()

    this.gameLoop = new GameLoop(
      this.update.bind(this),
      this.render.bind(this)
    )
    this.gameLoop.run()
  }

  public stop() {
    this.gameLoop.stop()
    // TODO: call entitymanager and remove everything or something
    // IDK
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
  protected abstract setup(gameData: GameData): void;

  private setupEntities() {
    this.gameData.entityManager.getEntities().map(e => e.setup())
  }

  private update(delta: number) {
    this.gameData.entityManager.getEntities().forEach(e => e.update(this.gameData, delta))
  }

  private render() {
    this.gameData.entityManager.getEntities().forEach(e => e.render(this.gameData))
  }

  private isCollidable(entity: Entity | Collidable): entity is Collidable {
    return (entity as Collidable).getCollisionBox !== undefined;
  }

}

export default Game
