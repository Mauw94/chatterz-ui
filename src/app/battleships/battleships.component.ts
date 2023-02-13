import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-battleships',
  templateUrl: './battleships.component.html',
  styleUrls: ['./battleships.component.css']
})
export class BattleshipsComponent implements OnInit {

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

    canvasEl.focus()

    // this.game = new SpaceInvadersGame(canvasEl)
    // this.game.run()
  }

}
