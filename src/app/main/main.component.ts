import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatSignalRService } from 'src/services/chat-signalr.service';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  constructor(
    public loginService: LoginService,
    private chatSignalRService: ChatSignalRService) { }

  async ngOnInit() {
    await this.chatSignalRService.connect()

    // todo: make signal r call to recreate groups etc here..?
  }

  async ngOnDestroy() {
    await this.chatSignalRService.disconnect()
  }

}
