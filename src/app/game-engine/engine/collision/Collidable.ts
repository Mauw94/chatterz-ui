import CollisionBox from "./CollisionBox";

interface Collidable {
  id: Symbol
  getCollisionBox(): CollisionBox;
}

export default Collidable;
