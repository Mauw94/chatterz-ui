import { Component, OnInit } from '@angular/core';
import BattleShipsGame from './game/BattleShipsGame';
import { AngularDeviceInformationService } from 'angular-device-information';

@Component({
  selector: 'app-battleships',
  templateUrl: './battleships.component.html',
  styleUrls: ['./battleships.component.css']
})
export class BattleshipsComponent implements OnInit {

  private game: BattleShipsGame
  private playerTurn: boolean = true
  private playerCanvas: HTMLCanvasElement
  private opponentCanvas: HTMLCanvasElement

  constructor(private deviceInformationService: AngularDeviceInformationService) { }

  ngOnInit(): void {
    this.playerCanvas = document.getElementById("game-canvas") as HTMLCanvasElement | undefined
    if (this.playerCanvas == null) {
      console.log("couldn't find the canvas")
      return
    }

    this.opponentCanvas = document.getElementById("game-canvas2") as HTMLCanvasElement | undefined
    if (this.opponentCanvas == null) {
      console.log("couldn't find the canvas")
      return
    }

    this.game = new BattleShipsGame()
    this.game.setup(this.playerCanvas)
    this.game.setup(this.opponentCanvas)

    this.playerTurn = true

    this.start()
  }

  private start(): void {
    let greaterOffset = false
    if (this.deviceInformationService.getDeviceInfo().os.includes("Mac OS")) {
      greaterOffset = true
    }

    this.opponentCanvas.focus()
    this.opponentCanvas.addEventListener("mousedown", e => {
      if (this.playerTurn) {
        const mousePos = greaterOffset ? [e.offsetX - 15, e.offsetY - 15] : [e.offsetX - 10, e.offsetY - 10]
        this.game.targetArea(this.opponentCanvas, [mousePos[0], mousePos[1]])
        this.playerTurn = !this.playerTurn
        setTimeout(() => {
          const pos = this.game.targetRandomXAndY(this.playerCanvas)
          this.game.targetArea(this.playerCanvas, pos)
          this.playerTurn = !this.playerTurn
        }, 2000)
      }
    })
  }

  private target(): void {

  }


}
