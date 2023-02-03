import GameLoop from "./GameLoop"
import { GameData } from "./types"
import KeyListener from "./KeyListener"
import Entity from "./Entity"
import CollisionHandler from "./collision/CollisionHandler"
import Collidable from "./collision/Collidable"

abstract class Game {

  private canvasEl: HTMLCanvasElement
  private gameData: GameData
  private entities: Entity[] = []

  constructor(canvasEl: HTMLCanvasElement) {
    this.canvasEl = canvasEl
    this.gameData = {
      context: canvasEl.getContext("2d"),
      screenWidth: canvasEl.width,
      screenHeight: canvasEl.height,
      keyListener: new KeyListener(),
      collisionHandler: new CollisionHandler()
    }
  }

  public run() {
    this.gameData.keyListener.setup(this.canvasEl)

    this.setup(this.gameData)

    this.setupEntities()

    const gameLoop = new GameLoop(
      this.update.bind(this),
      this.render.bind(this)
    )
    gameLoop.run()
  }

  public addEntity(entity: Entity) {
    this.entities.push(entity)

    if (this.isCollidable(entity)) {
      this.gameData.collisionHandler.addCollidable(entity);
    }
  }

  protected abstract setup(gameData: GameData): void;

  private setupEntities() {
    this.entities.map(e => e.setup(this.gameData))
  }

  private update(delta: number) {
    this.entities.forEach(e => e.update(this.gameData, delta))
  }

  private render() {
    this.entities.forEach(e => e.render(this.gameData))
  }

  private isCollidable(entity: Entity | Collidable): entity is Collidable {
    return (entity as Collidable).getCollisionBox !== undefined;
  }

}

export default Game
