import { GameData } from "./types";

abstract class Entity {

  public hasBeenSetup: boolean = false
  public hit: boolean = false
  public readonly id: Symbol

  public xPos: number = 0
  public yPos: number = 0
  public speed: number = 0  
  public width: number
  public height: number

  protected velX: number = 0
  protected velY: number = 0

  private blinkTimeMS: number = 300
  private currBlinkTimeMS: number
  private minBlinkOpacity: number = 0.5
  private hitTimeMS: number = 2000

  constructor() {
    this.id = Symbol()
    this.currBlinkTimeMS = this.blinkTimeMS
  }

  public runSetup(): void {
    this.setup()
  }

  public setup(): void {
    this.hasBeenSetup = true
  }

  public update(gameData: GameData, delta: number): void {
    if (this.hit && this.hitTimeMS >= 0) {
      this.hitTimeMS -= delta * 1000
      this.doFlinch(delta)
      if (this.hitTimeMS <= 0) {
        this.hit = false
        this.hitTimeMS = 2000
        this.currBlinkTimeMS = this.blinkTimeMS // reset currBlinkTimeMS so the opacity will be 1 again
      }
    }
  }

  public abstract render(gameData: GameData): void;

  protected setBlinkTimeMS(blinkTime: number) {
    this.blinkTimeMS = blinkTime
    this.currBlinkTimeMS = blinkTime
  }

  protected doFlinch(delta: number) {
    this.currBlinkTimeMS -= delta * 1000
    if (this.currBlinkTimeMS <= -this.blinkTimeMS) {
      this.currBlinkTimeMS = this.blinkTimeMS
    }
  }

  protected calculateOpacity(): number {
    const opacityVariance = 1 - this.minBlinkOpacity
    const opacityValue = (Math.abs(this.currBlinkTimeMS) / this.blinkTimeMS) * opacityVariance
    return this.minBlinkOpacity + opacityValue
  }

}

export default Entity
