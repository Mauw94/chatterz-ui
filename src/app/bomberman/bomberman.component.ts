import { Component, OnInit } from '@angular/core';
import BombermanGame from './game/BombermanGame';

@Component({
  selector: 'app-bomberman',
  templateUrl: './bomberman.component.html',
  styleUrls: ['./bomberman.component.css']
})
export class BombermanComponent implements OnInit {

  public gameStarted: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  start() {
    const canvasEl = document.getElementById("game-canvas") as HTMLCanvasElement | undefined
    if (canvasEl == null) {
      console.log("Couldn't find the canvas")
      return
    }

    canvasEl.focus()

    const game = new BombermanGame(canvasEl)
    game.run()
  }

}
