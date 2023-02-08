import { GameData } from "../../game-engine/engine/types"
import Sprite from "../../game-engine/engine/Sprite"
import SpriteSheet from "../../game-engine/engine/SpriteSheet"
import SpriteSheetSprite from "../../game-engine/engine/SpriteSheetSprite"
import Animation from "../../game-engine/engine/Animation"
import Range from "../../game-engine/engine/Range"
import Entity from "../../game-engine/engine/Entity"
import CollisionBox from "../../game-engine/engine/collision/CollisionBox"
import Bomb from "./Bomb"
import TestBrick from "./TestBrick"

class Player extends Entity {

  private sprites: { [direction: string]: Sprite } = {}

  private bombCooldownMS: number = 1000
  private currBombCooldownMS: number = 0

  public setup() {
    super.setup()
    let img = new Image()
    img.src = "./assets/bomberman/player_spritesheet.png"
    const spriteSheetImage = img
    const spriteSheet = new SpriteSheet(spriteSheetImage, 64, 128)

    this.sprites = {
      idle: new SpriteSheetSprite(spriteSheet, 0, 0),
      forward: new Animation(spriteSheet, Range.rowRange(0, 8), 100),
      backward: new Animation(spriteSheet, Range.rowRange(1, 8), 100),
      right: new Animation(spriteSheet, Range.rowRange(2, 8), 100),
      left: new Animation(spriteSheet, Range.rowRange(2, 8), 100, { flippedX: true })
    }

    this.width = 64
    this.height = 128
    this.speed = 150

    this.xPos = 64 * 2
    this.yPos = 65 * 2
  }

  public update(gameData: GameData, delta: number) {
    this.updatePosition(gameData, delta)
    this.getMovingSprite().update(gameData, delta)
    this.updateBombs(gameData, delta)
  }

  public render(gameData: GameData) {
    this.getMovingSprite().render(gameData, this.xPos, this.yPos, this.width, this.height)
  }

  private calculateCollision({ collisionHandler }: GameData) {
    const collisionBox: CollisionBox = {
      xPos: this.xPos + 10,
      yPos: this.yPos + 110,
      width: this.width - 20,
      height: this.height - 115
    };

    const collisionsX = collisionHandler.testMovement(collisionBox, this.velX, 0);
    if (collisionsX.length > 0) {
      this.velX = 0;
    }

    const collisionsY = collisionHandler.testMovement(collisionBox, 0, this.velY);
    if (collisionsY.length > 0) {
      this.velY = 0;
    }
  }

  private updatePosition(gameData: GameData, delta: number) {
    const { keyListener } = gameData

    this.velX = 0
    this.velY = 0

    if (keyListener.isAnyKeyDown(["d", "ArrowRight"])) {
      this.velX = this.speed * delta
    } else if (keyListener.isAnyKeyDown(["q", "a", "ArrowLeft"])) {
      this.velX = -(this.speed * delta)
    }

    if (keyListener.isAnyKeyDown(["s", "ArrowDown"])) {
      this.velY = this.speed * delta
    } else if (keyListener.isAnyKeyDown(["w", "ArrowUp"])) {
      this.velY = -(this.speed * delta)
    }

    this.calculateCollision(gameData);

    this.xPos += this.velX
    this.yPos += this.velY
  }

  private getMovingSprite() {
    if (this.velX === 0 && this.velY === 0) return this.sprites["idle"]
    if (this.velX > 0) return this.sprites["right"]
    if (this.velX < 0) return this.sprites["left"]
    if (this.velY < 0) return this.sprites["backward"]
    return this.sprites["forward"]
  }

  private updateBombs(gameData: GameData, delta: number) {
    if (this.currBombCooldownMS > 0) {
      this.currBombCooldownMS -= delta * 1000
    }

    // keydown " " = SPACEBAR
    if (gameData.keyListener.isKeyDown(" ") && this.currBombCooldownMS <= 0) {
      const x_y = this.calculateCleanXAndY(this.xPos + (this.width / 2), this.yPos + this.height)
      const overlap = this.checkValidLocation(gameData, x_y)
      if (!overlap) {
        const bomb = new Bomb(x_y[0], x_y[1])
        gameData.entityManager.addObject(bomb)
        this.currBombCooldownMS = this.bombCooldownMS
      }
    }
  }

  private calculateCleanXAndY(currX: number, currY: number): [number, number] {
    const x = currX - (currX % 64)
    const y = currY - (currY % 64)

    return [x, y]
  }

  private checkValidLocation({ entityManager, collisionHandler }: GameData, x_y: [number, number]): boolean {
    const objects = entityManager.getObjects()
    const bombCollisionBox: CollisionBox = {
      xPos: x_y[0],
      yPos: x_y[1],
      width: 48,
      height: 48
    }

    for (let i = 0; i < objects.length; i++) {
      if (objects[i] instanceof TestBrick) {
        if (collisionHandler.overlaps(bombCollisionBox, objects[i])) {
          return true
        }
      }
    }

    return false
  }
}

export default Player
