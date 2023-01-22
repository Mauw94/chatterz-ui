import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-word-guesser',
  templateUrl: './word-guesser.component.html',
  styleUrls: ['./word-guesser.component.css']
})
export class WordGuesserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  closeWindow(): void {
    console.log("TODO: close game window")
  }
}
