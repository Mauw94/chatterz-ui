import { Component, OnInit } from '@angular/core';
import BattleShipsGame from './game/BattleShipsGame';

@Component({
  selector: 'app-battleships',
  templateUrl: './battleships.component.html',
  styleUrls: ['./battleships.component.css']
})
export class BattleshipsComponent implements OnInit {

  private game: BattleShipsGame
  private game2: BattleShipsGame

  constructor() { }

  ngOnInit(): void {
    this.start()
  }

  private start(): void {
    const canvasEl = document.getElementById("game-canvas") as HTMLCanvasElement | undefined
    if (canvasEl == null) {
      console.log("couldn't find the canvas")
      return
    }

    const canvasEl2 = document.getElementById("game-canvas2") as HTMLCanvasElement | undefined
    if (canvasEl2 == null) {
      console.log("couldn't find the canvas")
      return
    }

    canvasEl.focus()

    this.game = new BattleShipsGame(canvasEl, true, true)
  }

}
