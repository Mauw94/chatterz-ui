import { Component, OnInit } from '@angular/core';
import SpaceInvadersGame from './game/SpaceInvadersGame';

@Component({
  selector: 'app-space-invaders',
  templateUrl: './space-invaders.component.html',
  styleUrls: ['./space-invaders.component.css']
})
export class SpaceInvadersComponent implements OnInit {

  public gameStarted: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  start(): void {
    const canvasEl = document.getElementById("game-canvas") as HTMLCanvasElement | undefined
    if (canvasEl == null) {
      console.log("couldn't find the canvas")
      return
    }

    canvasEl.focus()

    const game = new SpaceInvadersGame(canvasEl)
    game.run()
    
    this.gameStarted = true
  }
}
