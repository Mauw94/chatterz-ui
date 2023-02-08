import Entity from "../Entity";
import Collidable from "./Collidable";
import Collision from "./Collision";
import CollisionBox from "./CollisionBox";

class CollisionHandler {

  private collidables: Collidable[] = [];

  public addCollidable(collidable: Collidable) {
    this.collidables.push(collidable);
  }

  public removeCollidable(id: Symbol) {
    this.collidables = this.collidables.filter(c => c.id !== id)
  }
  
  /**
   * Returns first entity object collides with.
   * @param object to check for collision
   * @param objects list to check collisions with
   * @returns 
   */
  public checkCollisionWith(object: Entity, objects: Entity[]): Entity {
    let collision: Entity

    for (let i = 0; i < objects.length; i++) {
      const sprite = objects[i]
      if (
        object.xPos + object.width > sprite.xPos &&
        object.xPos < sprite.xPos + sprite.width &&
        object.yPos + object.height > sprite.yPos &&
        object.yPos < sprite.yPos + sprite.height) {
        collision = sprite
        return collision
      }
    }

    return null
  }

  public checkCollisionsWith(x: number, y: number, width: number, height: number, objects: Entity[]): Entity[] {
    let collisions: Entity[] = []

    for (let i = 0; i < objects.length; i++) {
      const sprite = objects[i]
      if (
        x + width > sprite.xPos &&
        x < sprite.xPos + sprite.width &&
        y + height > sprite.yPos &&
        y < sprite.yPos + sprite.height) {
        collisions.push(sprite)
      }
    }

    return collisions
  }

  public testMovement(driverBox: CollisionBox, xMovement: number, yMovement: number) {
    return this.findCollisions({
      xPos: driverBox.xPos + xMovement,
      yPos: driverBox.yPos + yMovement,
      width: driverBox.width,
      height: driverBox.height
    });
  }

  public findCollisions(driverBox: CollisionBox): Collision[] {
    let collisions: Collision[] = []

    for (let collidable of this.collidables) {
      const collision = this.findCollision(driverBox, collidable);
      if (collision != null) {
        collisions.push(collision);
      }
    }

    return collisions;
  }

  private findCollision(driverBox: CollisionBox, brick: Collidable): null | Collision {
    const brickBox = brick.getCollisionBox();

    const rightCollision = driverBox.xPos < brickBox.xPos && driverBox.xPos + driverBox.width > brickBox.xPos;
    const leftCollision = brickBox.xPos < driverBox.xPos && brickBox.xPos + brickBox.width > driverBox.xPos;

    const topCollision = driverBox.yPos < brickBox.yPos && driverBox.yPos + driverBox.height > brickBox.yPos;
    const bottomCollision = brickBox.yPos < driverBox.yPos && brickBox.yPos + brickBox.height > driverBox.yPos;

    if ((rightCollision || leftCollision) && (topCollision || bottomCollision)) {
      return {
        with: brick,
        top: topCollision,
        bottom: bottomCollision,
        left: leftCollision,
        right: rightCollision
      }
    }

    return null;
  }

}

export default CollisionHandler;
