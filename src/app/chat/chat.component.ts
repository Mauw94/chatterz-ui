import { Component, OnInit } from '@angular/core';
import { ChatMessage } from '../models/ChatMessage';
import { ChatSignalRService } from 'src/services/chat-signalr.service';
import { LoginService } from 'src/services/login.service';
import { ChatterzService } from 'src/services/chatterz.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  public title = 'Chatterz'
  public message: string = ""
  public username: string = ""
  public msgInbox: ChatMessage[] = []
  public isInChatroom: boolean = false;

  constructor(
    public loginService: LoginService,
    private chatterzService: ChatterzService,
    private chatSignalRService: ChatSignalRService) { }

  async ngOnInit() {
    this.chatterzService.inChatRoom.subscribe({
      next: (res) => {
        this.isInChatroom = res
      },
      error: (err) => console.error(err)
    })

    this.chatSignalRService.retrieveMessage().subscribe((message: ChatMessage) => {
      console.log("retrieved a new message")
      this.addToInbox(message)
    })
  }

  async sendMessage() {
    // TODO: save in chatroom history
    if (this.message.length === 0) return

    await this.chatSignalRService.sendMessageToHub(this.message, this.chatterzService.chatroomId)
      .then(_ => {
        this.chatterzService.saveChat(
          this.chatterzService.chatroomId,
          this.loginService.user.UserName,
          this.message,
          this.chatSignalRService.connectionId)
          .subscribe({
            next: (res) => console.log(res),
            error: (err) => console.error(err)
          })
        this.message = ""
      })
      .catch((err) => console.log(err))
  }

  changeUsername(): void {
    var username = window.prompt("Enter your username")
    if (username === null) {
      this.changeUsername()
      return
    }
    if (username.length > 2) {
      this.username = username
      this.chatterzService.changeUsername(username, this.loginService.user.Id).subscribe({
        next: () => {
          this.loginService.user.UserName = username
        },
        error: (err) => console.error(err)
      })
    } else {
      this.changeUsername()
    }
  }

  private addToInbox(message: ChatMessage) {
    let newMsg = this.newChatMessage(message)
    this.msgInbox.push(newMsg)
  }

  private newChatMessage(message: ChatMessage): ChatMessage {
    return {
      ConnectionId: message.ConnectionId,
      UserName: message.UserName,
      Text: message.Text,
      DateTime: message.DateTime,
      ChatroomId: message.ChatroomId
    }
  }
}
