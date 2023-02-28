import { Component, OnInit } from '@angular/core';
import BattleShipsGame from './game/BattleShipsGame';

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

  constructor() { }

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
    this.opponentCanvas.focus()

    this.opponentCanvas.addEventListener("mousedown", e => {
      // e.preventDefault()
      if (this.playerTurn) {
        this.game.targetArea(this.opponentCanvas, [e.offsetX - 10, e.offsetY - 10])
        this.playerTurn = !this.playerTurn
        console.log("computer's turn")
        setTimeout(() => {
          console.log("computer plays")
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
