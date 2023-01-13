import { Component, OnInit } from '@angular/core';
import { ChatSignalRService } from 'src/services/chat-signalr.service';
import { ChatMessage } from './models/ChatMessage';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Chatterz'
  message: string = ""
  username: string = ""
  msgInbox: ChatMessage[] = []
  prodEnv: boolean = false;

  constructor(private chatSignalRService: ChatSignalRService) { }

  async ngOnInit() {
    if (environment.production) this.prodEnv = true

    this.userName()
    await this.chatSignalRService.connect()
    this.chatSignalRService.retrieveMessage().subscribe((message: ChatMessage) => {
      console.log("retrieved a new message")
      this.addToInbox(message)
    })
  }

  async sendMessage() {
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

  userName(): void {
    if (localStorage.getItem("username") !== null) {
      console.log("already have a username stored")
      this.username = localStorage.getItem("username").toString()
      return
    }
    var username = window.prompt("Enter your username")
    if (username === null) {
      this.userName()
      return
    }
    if (username.length > 2) {
      this.username = username
      localStorage.setItem("username", username)
    } else {
      this.userName()
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
      localStorage.setItem("username", username)
    } else {
      this.changeUsername()
    }
  }
}
