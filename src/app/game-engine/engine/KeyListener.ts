
class KeyListener {

  private keyStates: { [key: string]: boolean } = {}
  private mouseDown: boolean = false
  private mousePos: [number, number]

  public setup(canvasEl: HTMLCanvasElement) {
    canvasEl.addEventListener("keydown", e => {
      e.preventDefault()
      this.keyStates[e.key] = true
    })
    canvasEl.addEventListener("keyup", e => {
      e.preventDefault()
      this.keyStates[e.key] = false
    })
    canvasEl.addEventListener("mousedown", e => {
      e.preventDefault()
      this.mousePos = [e.offsetX - 10, e.offsetY - 10]
      this.mouseDown = true
    })
    canvasEl.addEventListener("mouseup", e => {
      e.preventDefault()
      this.mouseDown = false
    })
  }

  public isMouseDown() {
    return this.mouseDown
  }

  public getMousePos() {
    return this.mousePos
  }

  public isKeyDown(key: string) {
    return this.keyStates[key] === true
  }

  public isAnyKeyDown(keys: string[]) {
    return keys.some(key => this.isKeyDown(key))
  }

}

export default KeyListener
