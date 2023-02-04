import Entity from "src/app/game-engine/engine/Entity";
import ImageSprite from "src/app/game-engine/engine/ImageSprite";
import { GameData } from "src/app/game-engine/engine/types";

class Enemy1 extends Entity {

    private sprite: ImageSprite

    public setup() {
        super.setup()
        let img = new Image()
        img.src = "./assets/space-invaders/images/enemy1.png"
        this.sprite = new ImageSprite(img)

        this.width = 44
        this.height = 32
        this.speed = 75

        this.xPos = 20
        this.yPos = 20
    }

    public update(gameData: GameData, delta: number) {
        this.sprite.update(gameData, delta)
    }

    public render(gameData: GameData): void {
        this.sprite.render(gameData, this.xPos, this.yPos, this.width, this.height)
    }
}

export default Enemy1