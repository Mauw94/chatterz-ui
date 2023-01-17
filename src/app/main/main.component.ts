import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatSignalRService } from 'src/services/chat-signalr.service';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  public signalRConnectionStarted: boolean = false

  constructor(
    public loginService: LoginService,
    private chatSignalRService: ChatSignalRService) { }

  async ngOnInit() {
    this.chatSignalRService.connectionEstablished.subscribe((connectionEstablished) => {
      console.log(connectionEstablished)
      this.signalRConnectionStarted = connectionEstablished
    })

    await this.chatSignalRService.connect()
  }

  async ngOnDestroy() {
    await this.chatSignalRService.disconnect()
  }

}
