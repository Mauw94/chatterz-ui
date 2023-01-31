import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/services/login.service';
import { WordGuesserService } from 'src/services/word-guesser.service';
import { WordGuesserDto } from '../models/wordGuesserDto';
import { DtoBuilder } from 'src/utils/dto-builder';

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

  public playerTurn: boolean = false // set defautl false after implementation
  public gameStarted: boolean = false
  public canStart: boolean = false

  private guessedWordsHistory: string[] = [];
  private gameId: number
  private game: WordGuesserDto

  constructor(
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private gameService: WordGuesserService) { }

  async ngOnInit(): Promise<void> {
    // TODO: also check for player turn, send in gamedto probaly?
    let id = this.activatedRoute.snapshot.params["id"]

    if (id != undefined) {
      this.gameId = id
    } else {
      this.gameId = this.gameService.gameId
    }

    this.gameService.retrieveConnectionEstablished().subscribe((connectionEstablished: boolean) => {
      if (connectionEstablished) {
        console.log("connection established")
        this.gameService.connect(
          this.gameId,
          this.loginService.user,
          this.gameService.connectionId).subscribe({
            next: () => {
              this.gameService.canStart(this.gameId).subscribe()
            },
            error: (err) => console.error(err)
          })
      }
    })

    this.gameService.retrieveGameState().subscribe((dto: any) => {
      console.log("retrieving gamestate")
      this.game = DtoBuilder.buildWordGuesserDto(dto.guessedWord, dto.gameroomId, dto.playerToPlay, dto.playerIds, dto.wordToGuess)
      console.log(this.game)
      if (this.game.PlayerToPlay === this.loginService.user.Id) {
        this.playerTurn = true
      } else {
        this.playerTurn = false
      }
      if (this.game.GuessedWord.toLowerCase() === this.wordToGuess.toLowerCase()) {
        console.log("you won pog")
      }
      this.guessedWordsHistory.push(this.game.GuessedWord)
      this.checkValidLetters()
    })

    this.gameService.retrieveCanStartGameSubject().subscribe((start: boolean) => {
      if (start) {
        this.canStart = true
      }
    })

    this.gameService.retrieveStartGameSubject().subscribe((dto: any) => {
      this.game = DtoBuilder.buildWordGuesserDto(dto.guessedWord, dto.gameroomId, dto.playerToPlay, dto.playerIds, dto.wordToGuess)
      console.log("game info..")
      console.log(this.game)
      this.wordToGuess = this.game.WordToGuess
      this.wordToGuessLength = this.wordToGuess.length

      console.log(this.loginService.user.Id)

      if (this.game.PlayerToPlay === this.loginService.user.Id) {
        this.playerTurn = true
      } else {
        this.playerTurn = false
      }

      console.log(this.playerTurn)

      this.gameStarted = true
    })

    await this.gameService.connectSignalR()
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
    this.game.GuessedWord = guess
    this.gameService.sendToHub(this.game)
    this.gameForm.controls.word.setValue("")
  }

  start(): void {
    this.gameService.start(this.gameId).subscribe()
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
