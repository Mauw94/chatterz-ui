import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatSignalRService } from 'src/services/chat-signalr.service';
import { LoginService } from 'src/services/login.service';
import { GameInviteDto } from '../models/gameInviteDto';
import { ChatterzService } from 'src/services/chatterz.service';
import { ChatroomDto } from '../models/chatroomDto';
import { Router } from '@angular/router';
import { WordGuesserService } from 'src/services/word-guesser.service';
import { GameType } from 'src/app/models/gameTypeEnum';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  public signalRConnectionStarted: boolean = false
  public chatroom: ChatroomDto

  constructor(
    public loginService: LoginService,
    private chatterzService: ChatterzService,
    private chatSignalRService: ChatSignalRService,
    private wordGuesserService: WordGuesserService,
    private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.chatSignalRService.connectionEstablished.subscribe((connectionEstablished) => {
      this.signalRConnectionStarted = connectionEstablished
    })

    await this.chatSignalRService.connect()

    this.retrieveGameInvite()
  }

  async ngOnDestroy(): Promise<void> {
    await this.chatSignalRService.disconnect()
  }

  private async retrieveGameInvite(): Promise<void> {
    this.chatSignalRService.retrieveGameInvite().subscribe((gameInvite: GameInviteDto) => {
      let res = window.confirm(gameInvite.InviteMessage)
      if (res) {
        gameInvite.UserId = this.loginService.user.Id
        this.wordGuesserService.create().subscribe({
          next: async (gameId: number) => {
            this.wordGuesserService.gameId = gameId;
            await this.wordGuesserService.connectSignalR();
          },
          error: (err) => console.error(err)
        })
        this.chatterzService.acceptGameInvite(gameInvite).subscribe()
      }
    })

    this.chatSignalRService.retrieveGameAccept().subscribe((gameType: GameType) => {
      console.log("game can start!!")
      console.log(gameType)
      this.router.navigate(['wordguesser'])
    })
  }
}
