import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/services/login.service';
import { WordGuesserService } from 'src/services/word-guesser.service';

@Component({
  selector: 'app-word-guesser',
  templateUrl: './word-guesser.component.html',
  styleUrls: ['./word-guesser.component.css']
})
export class WordGuesserComponent implements OnInit {

  public guess: string = ""
  public guesses: string[] = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private gameService: WordGuesserService) { }

  async ngOnInit(): Promise<void> {
    let id = this.activatedRoute.snapshot.params["id"]
    let gameId: number

    if (id != undefined) {
      gameId = id
    } else {
      gameId = this.gameService.gameId
    }

    console.log("we're in the game component, what now?")

    await this.gameService.connectSignalR()

    this.gameService.connect(
      gameId,
      this.loginService.user,
      this.gameService.connectionId).subscribe({
        next: (game) => {
          console.log(game)
        },
        error: (err) => console.error(err)
      })

    // TODO: when 2 players are connected
    // show start button
    // game starts
  }

  closeWindow(): void {
    console.log("TODO: close game window")
    // TODO: reconnect with chatsignalR
    // disconnect with gamesignalR
  }

  guessWord(): void {
    this.guesses.push(this.guess)
    console.log("guessing... " + this.guess)
  }
}
