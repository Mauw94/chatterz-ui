import { Component, OnInit } from '@angular/core';
import { ChatMessage } from '../models/ChatMessage';
import { environment } from 'src/environments/environment';
import { ChatSignalRService } from 'src/services/chat-signalr.service';
import { LoginService } from 'src/services/login.service';
import { ChatterzService } from 'src/services/chatterz.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  title = 'Chatterz'
  message: string = ""
  username: string = ""
  msgInbox: ChatMessage[] = []
  prodEnv: boolean = false;

  constructor(
    public loginService: LoginService,
    private chatterzService: ChatterzService,
    private chatSignalRService: ChatSignalRService) { }

  async ngOnInit() {
    if (environment.production) this.prodEnv = true

    await this.chatSignalRService.connect()
    this.chatSignalRService.retrieveMessage().subscribe((message: ChatMessage) => {
      console.log("retrieved a new message")
      this.addToInbox(message)
    })
  }

  async sendMessage() {
    // TODO: save in chatroom history
    if (this.message.length === 0) return

    await this.chatSignalRService.sendMessageToHub(this.message)
      .then(_ => this.message = "")
      .catch((err) => console.log(err))
  }

  addToInbox(message: ChatMessage) {
    let newMsg = this.newChatMessage(message)
    this.msgInbox.push(newMsg)
  }

  newChatMessage(message: ChatMessage): ChatMessage {
    return {
      ConnectionId: message.ConnectionId,
      UserName: message.UserName,
      Text: message.Text,
      DateTime: message.DateTime
    }
  }

  changeUsername(): void {
    var username = window.prompt("Enter your username")
    if (username === null) {
      this.changeUsername()
      return
    }
    if (username.length > 2) {
      this.username = username
      this.chatterzService.changeUsername(username, this.loginService.user.id).subscribe({
        next: () => {
          this.loginService.user.userName = username
        },
        error: (err) => console.error(err)
      })
    } else {
      this.changeUsername()
    }
  }

}
