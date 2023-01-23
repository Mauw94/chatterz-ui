import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatSignalRService } from 'src/services/chat-signalr.service';
import { LoginService } from 'src/services/login.service';
import { GameInviteDto } from '../models/gameInviteDto';
import { ChatterzService } from 'src/services/chatterz.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  public signalRConnectionStarted: boolean = false

  constructor(
    public loginService: LoginService,
    private chatterzService: ChatterzService,
    private chatSignalRService: ChatSignalRService) { }

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

  private retrieveGameInvite(): void {
    this.chatSignalRService.retrieveGameInvite().subscribe((gameInvite: GameInviteDto) => {
      console.log(gameInvite)
      let res = window.confirm(gameInvite.InviteMessage)
      if (res) {
        this.chatterzService.acceptGameInvite(gameInvite.Challenger.Id, this.loginService.user.Id).subscribe(() => {
          
        })
      }
    })
  }
}
