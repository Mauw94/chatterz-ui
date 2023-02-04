import DeltaTracker from "./DeltaTracker";

type GameUpdateFunction = (delta: number) => void;
type GameRenderFunction = () => void;

class GameLoop {

  private renderFunction: GameRenderFunction
  private updateFunction: GameUpdateFunction
  private deltaTracker: DeltaTracker

  private animationFrame: number

  constructor(
    updateFunction: GameUpdateFunction,
    renderFunction: GameRenderFunction
  ) {
    this.updateFunction = updateFunction
    this.renderFunction = renderFunction
    this.deltaTracker = new DeltaTracker()
  }

  public run() {
    this.animationFrame = window.requestAnimationFrame(this.loop.bind(this))
  }

  public stop() {
    window.cancelAnimationFrame(this.animationFrame)
  }

  private loop() {
    const delta = this.deltaTracker.getAndUpdateDelta()

    this.updateFunction(delta)
    this.renderFunction()

    window.requestAnimationFrame(this.loop.bind(this))
  }

}

export default GameLoop
