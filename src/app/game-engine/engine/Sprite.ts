import { IRenderImageOptions } from "./IRenderImageOptions";
import { GameData } from "./types";

abstract class Sprite {

  public update(gameData: GameData, delta: number) { }

  public abstract render(
    gameData: GameData,
    x: number,
    y: number,
    width: number,
    height: number,
    renderOptions?: IRenderImageOptions
  ): void;

}

export default Sprite
