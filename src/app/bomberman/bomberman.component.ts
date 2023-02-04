import { Component, OnDestroy, OnInit } from '@angular/core';
import BombermanGame from './game/BombermanGame';

@Component({
  selector: 'app-bomberman',
  templateUrl: './bomberman.component.html',
  styleUrls: ['./bomberman.component.css']
})
export class BombermanComponent implements OnInit, OnDestroy {

  public gameStarted: boolean = false

  private game: BombermanGame

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.game = undefined
  }

  start() {
    const canvasEl = document.getElementById("game-canvas") as HTMLCanvasElement | undefined
    if (canvasEl == null) {
      console.log("Couldn't find the canvas")
      return
    }

    canvasEl.focus()

    this.game = new BombermanGame(canvasEl)
    this.game.run()

    this.gameStarted = true
  }

}
