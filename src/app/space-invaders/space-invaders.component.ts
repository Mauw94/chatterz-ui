import { Component, OnDestroy, OnInit } from '@angular/core';
import SpaceInvadersGame from './game/SpaceInvadersGame';

@Component({
  selector: 'app-space-invaders',
  templateUrl: './space-invaders.component.html',
  styleUrls: ['./space-invaders.component.css']
})
export class SpaceInvadersComponent implements OnInit, OnDestroy {

  private game: SpaceInvadersGame

  constructor() { }

  ngOnInit(): void {
    this.start()
    // TODO: do we want a chatroom here?
  }

  ngOnDestroy(): void {
    // TODO: setting undefined is not enough, still things are being run in the bg
    console.log("should destroy game AND REMOVE FROM MEMORY")
    this.game.stop()
    this.game = null
  }

  private start(): void {
    const canvasEl = document.getElementById("game-canvas") as HTMLCanvasElement | undefined
    if (canvasEl == null) {
      console.log("couldn't find the canvas")
      return
    }

    canvasEl.focus()

    this.game = new SpaceInvadersGame(canvasEl)
    this.game.run()
  }
}
