import { GameData } from "./types";

abstract class Entity {

  public xPos: number = 0
  public yPos: number = 0
  public width: number
  public height: number

  public setup(gameData: GameData): void { }
  public update(gameData: GameData, delta: number): void { }
  public abstract render(gameData: GameData): void;

}

export default Entity
