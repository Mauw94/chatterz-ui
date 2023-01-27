import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/services/login.service';
import { WordGuesserService } from 'src/services/word-guesser.service';

@Component({
  selector: 'app-word-guesser',
  templateUrl: './word-guesser.component.html',
  styleUrls: ['./word-guesser.component.css']
})
export class WordGuesserComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private gameService: WordGuesserService) { }

  ngOnInit(): void {
    console.log("we're in the game component, what now?")
    this.gameService.connect(this.loginService.user).subscribe({
      next: (game) => {
        console.log(game)
      },
      error: (err) => console.error(err)
    })
  }

  closeWindow(): void {
    console.log("TODO: close game window")
  }
}
