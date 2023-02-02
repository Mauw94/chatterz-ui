import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ScrollToBottomDirective } from '../directives/scroll-to-bottom.directive';
import { WordGuesserService } from 'src/services/word-guesser.service';
import { Subscription } from 'rxjs';
import { ChatMessage } from '../models/chatMessage';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-game-chat',
  templateUrl: './game-chat.component.html',
  styleUrls: ['./game-chat.component.css']
})
export class GameChatComponent implements OnInit, OnDestroy {
  @ViewChild(ScrollToBottomDirective)
  scroll: ScrollToBottomDirective

  public message: string = ""
  public msgInbox: string[] = []

  private messageSubscription = new Subscription()

  constructor(private gameService: WordGuesserService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.messageSubscription = this.gameService.retrieveMessage().subscribe((message: ChatMessage) => {
      console.log("retrieved message")
      this.addToInbox(message)
    })
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe()
  }

  async sendMessage(): Promise<void> {
    if (this.message.length === 0) return

    await this.gameService.sendMessageToHub(this.message, this.gameService.gameId)
      .then(_ => {
        this.message = ""
      })
      .catch((err) => console.error(err))
  }

  private addToInbox(message: any): void {
    let time = this.datePipe.transform(message.dateTime, 'HH:MM')
    this.msgInbox.push(time + " " + '<span class="msg-blue">' + message.userName + '</span>' + ": " + message.text)
  }
}
