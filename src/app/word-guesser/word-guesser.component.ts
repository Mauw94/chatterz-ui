import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/services/login.service';
import { WordGuesserService } from 'src/services/word-guesser.service';

@Component({
  selector: 'app-word-guesser',
  templateUrl: './word-guesser.component.html',
  styleUrls: ['./word-guesser.component.css']
})
export class WordGuesserComponent implements OnInit, OnDestroy {

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

    this.gameService.retrieveConnectionEstablished().subscribe((connectionEstablished: boolean) => {
      if (connectionEstablished) {
        console.log("connection established")
        this.gameService.connect(
          gameId,
          this.loginService.user,
          this.gameService.connectionId).subscribe({
            next: (game) => {
              console.log(game)
            },
            error: (err) => console.error(err)
          })
      }
    })

    this.gameService.retrieveMessage().subscribe((message: string) => {
      console.log("retrieving guess")
      console.log(message)
      this.guesses.push(message)
    })

    await this.gameService.connectSignalR()

    // TODO: when 2 players are connected
    // show start button
    // game starts
  }

  async ngOnDestroy(): Promise<void> {
    await this.gameService.disconnect()
  }

  closeWindow(): void {
    console.log("TODO: close game window")
    // TODO: reconnect with chatsignalR
    // disconnect with gamesignalR
  }

  guessWord(): void {
    console.log("guessing... " + this.guess)
    this.gameService.sendToHub(this.guess, "wordguesser" + this.gameService.gameId)
  }
}
