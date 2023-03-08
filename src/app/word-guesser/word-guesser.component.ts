import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/services/login.service';
import { WordGuesserService } from 'src/services/signalR-services/word-guesser.service';
import { WordGuesserDto } from '../models/wordGuesserDto';
import { DtoBuilder } from 'src/utils/dto-builder';
import { ScrollToBottomDirective } from '../directives/scroll-to-bottom.directive';
import { Subscription } from 'rxjs';

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
  @ViewChild(ScrollToBottomDirective)
  scroll: ScrollToBottomDirective

  public gameForm: FormGroup = new FormGroup({
    word: new FormControl('', [
      Validators.required
    ])
  })
  public inputForm: FormGroup = new FormGroup({
    wordLength: new FormControl('', [
      Validators.required
    ])
  })

  public wordToGuess: string = ""
  public matchingLetters: MatchingLetters[] = [];
  public wordToGuessLength: number

  public playerTurn: boolean = false // set defautl false after implementation
  public gameStarted: boolean = false
  public canStart: boolean = false

  private guessedWordsHistory: string[] = [];
  private gameId: number
  private game: WordGuesserDto
  private gameWasWon: boolean = false

  private connectionEstablishedSubcription = new Subscription()
  private gameStateSubscription = new Subscription()
  private canStartGameSubscription = new Subscription()
  private startGameSubscription = new Subscription()
  private endGameSubscription = new Subscription()
  private gameWinSubscription = new Subscription()

  @HostListener('window:beforeunload') goToPage() {
    this.router.navigate(['/main']);
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private gameService: WordGuesserService) { }

  async ngOnInit(): Promise<void> {
    let id = this.activatedRoute.snapshot.params["id"]

    if (id != undefined) {
      this.gameId = id
    } else {
      this.gameId = this.gameService.gameId
    }

    this.connectionEstablishedSubcription = this.gameService.retrieveConnectionEstablished().subscribe((connectionEstablished: boolean) => {
      if (connectionEstablished) {
        console.log("connection established")
        this.gameService.connectApi(
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

    this.gameStateSubscription = this.gameService.retrieveGameState().subscribe((dto: any) => {
      console.log("retrieving gamestate")
      this.game = DtoBuilder.buildWordGuesserDto(dto.guessedWord, dto.gameroomId, dto.playerToPlay, dto.playerIds, dto.wordToGuess)
      console.log(this.game)
      if (this.game.PlayerToPlay === this.loginService.user.Id) {
        this.playerTurn = true
      } else {
        this.playerTurn = false
      }
      this.guessedWordsHistory.push(this.game.GuessedWord)
      this.checkValidLetters()
    })

    this.canStartGameSubscription = this.gameService.retrieveCanStartGameSubject().subscribe((start: boolean) => {
      if (start) {
        this.canStart = true
      }
    })

    this.startGameSubscription = this.gameService.retrieveStartGameSubject().subscribe((dto: any) => {
      this.game = DtoBuilder.buildWordGuesserDto(dto.guessedWord, dto.gameroomId, dto.playerToPlay, dto.playerIds, dto.wordToGuess)
      this.wordToGuess = this.game.WordToGuess
      this.wordToGuessLength = this.wordToGuess.length

      if (this.game.PlayerToPlay === this.loginService.user.Id) {
        this.playerTurn = true
      } else {
        this.playerTurn = false
      }

      this.gameStarted = true
    })

    this.endGameSubscription = this.gameService.retrieveGameEndSubject().subscribe((message: string) => {
      let res = window.alert(message)
      console.log(res)
      this.router.navigate(['main'])
    })

    this.gameWinSubscription = this.gameService.retrieveGameWinSubject().subscribe((message: string) => {
      window.alert(message)
      this.gameWasWon = true
      this.router.navigate(['main'])
    })

    await this.gameService.connect()
  }

  async ngOnDestroy(): Promise<void> {
    if (!this.gameWasWon)
      await this.gameService.disconnect()

    this.connectionEstablishedSubcription.unsubscribe()
    this.gameStateSubscription.unsubscribe()
    this.canStartGameSubscription.unsubscribe()
    this.startGameSubscription.unsubscribe()
    this.endGameSubscription.unsubscribe()
    this.gameWinSubscription.unsubscribe()
  }

  async closeWindow(): Promise<void> {
    let res = window.confirm("Are you sure you want to leave the game?")
    if (res) {
      await this.ngOnDestroy()
      this.router.navigate(['main'])
    }
  }

  guessWord(): void {
    let guess = this.gameForm.controls.word.value
    this.game.GuessedWord = guess
    this.gameService.guess(this.gameId).subscribe()
    this.gameService.sendToHub(this.game)
    this.gameForm.controls.word.setValue("")

    if (this.game.GuessedWord.toLowerCase() === this.wordToGuess.toLowerCase()) {
      this.gameService.win(this.gameId).subscribe(() => { })
    }
  }

  start(): void {
    let wordLength = this.inputForm.controls.wordLength.value
    this.gameService.start(this.gameId, wordLength).subscribe()
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
