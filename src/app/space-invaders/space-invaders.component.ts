import { Component, OnDestroy, OnInit } from '@angular/core';
import SpaceInvadersGame from './game/SpaceInvadersGame';
import { SpaceInvadersService } from 'src/services/spaceinvaders.service';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-space-invaders',
  templateUrl: './space-invaders.component.html',
  styleUrls: ['./space-invaders.component.css']
})
export class SpaceInvadersComponent implements OnInit, OnDestroy {

  private game: SpaceInvadersGame
  private gameId: number

  constructor(private spaceinvadersService: SpaceInvadersService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.spaceinvadersService.startGame(this.loginService.user.Id).subscribe({
      next: (res) => {
        this.gameId = res
        this.start()
      },
      error: (err) => console.error(err)
    })
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

    this.game = new SpaceInvadersGame(canvasEl, this.spaceinvadersService, this.gameId)
    this.game.run()
  }
}
