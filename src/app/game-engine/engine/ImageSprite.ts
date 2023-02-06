import { GameData } from "./types"
import Sprite from "./Sprite"
import { IRenderImageOptions } from "./IRenderImageOptions"

class ImageSprite extends Sprite {

  private image: HTMLImageElement
  private flippedX: boolean

  constructor(image: HTMLImageElement, { flippedX = false }: { flippedX?: boolean } = {}) {
    super()
    this.image = image
    this.flippedX = flippedX
  }

  public render({ context }: GameData, x: number, y: number, width: number, height: number, renderOptions?: IRenderImageOptions) {
    let renderedX = x

    if (this.flippedX) {
      context.save()
      context.scale(-1, 1)
      renderedX = -(x + width)
    }

    if (renderOptions != null && renderOptions.opacity != null) {
      context.globalAlpha = renderOptions.opacity
    }

    context.drawImage(this.image, renderedX, y, width, height)

    if (renderOptions != null && renderOptions.opacity != null) {
      context.globalAlpha = 1
    }

    if (this.flippedX) {
      context.restore()
    }
  }

}

export default ImageSprite
