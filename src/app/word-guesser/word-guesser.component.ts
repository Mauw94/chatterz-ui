import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/services/login.service';
import { WordGuesserService } from 'src/services/word-guesser.service';

export interface MatchingLetters {
  word: Letter[];
}

export interface Letter {
  match: boolean;
  contains: boolean;
  character: string;
}

@Component({
  selector: 'app-word-guesser',
  templateUrl: './word-guesser.component.html',
  styleUrls: ['./word-guesser.component.css']
})
export class WordGuesserComponent implements OnInit, OnDestroy {

  public gameForm: FormGroup = new FormGroup({
    word: new FormControl('', [
      Validators.required
    ])
  });
  public wordToGuess: string = ""
  public matchingLetters: MatchingLetters[] = [];
  public wordToGuessLength: number

  public playerTurn: boolean = true // set defautl false after implementation
  public gameStarted: boolean = false

  private guessedWordsHistory: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private gameService: WordGuesserService) { }

  async ngOnInit(): Promise<void> {
    // TODO: also check for player turn, send in gamedto probaly?
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
              this.wordToGuess = game.wordToGuess
              this.wordToGuessLength = this.wordToGuess.length
              console.log(this.wordToGuess)
            },
            error: (err) => console.error(err)
          })
      }
    })

    this.gameService.retrieveMessage().subscribe((guessedWord: string) => {
      console.log("retrieving guess")
      console.log(guessedWord)
      if (guessedWord.toLowerCase() === this.wordToGuess.toLowerCase()) {
        console.log("you won pog")
      }
      this.guessedWordsHistory.push(guessedWord)
      this.checkValidLetters()
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
    let guess = this.gameForm.controls.word.value

    console.log("guessing... " + guess)
    this.gameService.sendToHub(guess, "wordguesser" + this.gameService.gameId)
    this.gameForm.controls.word.setValue("")
  }


  /**
  * Check valid and matching letters in a word.
  */
  private checkValidLetters(): void {
    var letterWord: Letter[] = [];
    var wordToGuessChars = this.wordToGuess!.split('');

    for (let i = 0; i < this.guessedWordsHistory.length; i++) {
      var word = this.guessedWordsHistory[i].toUpperCase();
      var wordChars = word.split('');
      letterWord = [];

      for (let j = 0; j < wordChars.length; j++) {
        var letter: Letter = {} as Letter;
        if (wordToGuessChars[j] === wordChars[j]) letter.match = true;
        if (wordToGuessChars.includes(wordChars[j])) letter.contains = true;
        letter.character = wordChars[j];
        letterWord.push(letter);
      }
      this.matchingLetters.push({ word: letterWord });

      this.guessedWordsHistory.shift();
      i--;
    }
  }

}
