import { Component, OnInit } from '@angular/core';
import { ChatSignalRService } from 'src/services/chat-signalr.service';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    public loginService: LoginService,
    private chatSignalRService: ChatSignalRService) { }

  async ngOnInit() {
    await this.chatSignalRService.connect()
  }

}
