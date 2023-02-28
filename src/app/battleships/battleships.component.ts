import { Component, OnInit } from '@angular/core';
import BattleShipsGame from './game/BattleShipsGame';
import { AngularDeviceInformationService } from 'angular-device-information';

@Component({
  selector: 'app-battleships',
  templateUrl: './battleships.component.html',
  styleUrls: ['./battleships.component.css']
})
export class BattleshipsComponent implements OnInit {

  public playerTurn: boolean = true

  private game: BattleShipsGame
  private playerCanvas: HTMLCanvasElement
  private opponentCanvas: HTMLCanvasElement

  constructor(private deviceInformationService: AngularDeviceInformationService) { }

  ngOnInit(): void {
    this.playerCanvas = document.getElementById("game-canvas") as HTMLCanvasElement 
    this.opponentCanvas = document.getElementById("game-canvas2") as HTMLCanvasElement 
 
    this.game = new BattleShipsGame()
    this.game.setupPlayerBoard(this.playerCanvas)
    this.game.setupOpponentBoard(this.opponentCanvas)

    this.start()
  }

  private start(): void {
    let greaterOffset = false
    if (this.deviceInformationService.getDeviceInfo().os.includes("Mac")) {
      greaterOffset = true
    }

    this.opponentCanvas.focus()
    this.opponentCanvas.addEventListener("mousedown", e => {
      if (this.playerTurn) {
        const mousePos = greaterOffset ? [e.offsetX - 15, e.offsetY - 15] : [e.offsetX - 10, e.offsetY - 10]
        this.game.targetArea(true, this.opponentCanvas, [mousePos[0], mousePos[1]])
        this.playerTurn = !this.playerTurn
        setTimeout(() => {
          const pos = this.game.targetRandomXAndY(this.playerCanvas)
          this.game.targetArea(false, this.playerCanvas, pos)
          this.playerTurn = !this.playerTurn
        }, 2000)
      }
    })
  }
}
