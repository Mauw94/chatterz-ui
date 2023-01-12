import { Component, OnInit } from '@angular/core';
import { ChatSignalRService } from 'src/services/chat-signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Chatterz'
  message: string = ""
  username: string = ""

  constructor(public chatSignalRService: ChatSignalRService) { }

  ngOnInit() {
    this.userName()
    this.chatSignalRService.connect()
  }

  async sendMessage() {
    await this.chatSignalRService.sendMessageToHub(this.message)
      .then(_ => this.message = "")
      .catch((err) => console.log(err))
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
