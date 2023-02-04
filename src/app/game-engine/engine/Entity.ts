import { GameData } from "./types";

abstract class Entity {

  public hasBeenSetup: boolean = false
  public readonly id: Symbol

  public xPos: number = 0
  public yPos: number = 0
  protected velX: number = 0
  protected velY: number = 0
  protected speed: number = 0
  
  public width: number
  public height: number

  constructor() {
    this.id = Symbol()
  }

  public runSetup(): void {
    this.setup()
  }

  public setup(): void {
    this.hasBeenSetup = true
  }
  public update(gameData: GameData, delta: number): void { }
  public abstract render(gameData: GameData): void;

}

export default Entity
