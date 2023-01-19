import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatMessage } from '../models/ChatMessage';
import { ChatSignalRService } from 'src/services/chat-signalr.service';
import { LoginService } from 'src/services/login.service';
import { ChatterzService } from 'src/services/chatterz.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ChatComponent implements OnInit {
  public title = 'Chatterz'
  public message: string = ""
  public username: string = ""
  public msgInbox: string[] = []
  public isInChatroom: boolean = false;

  constructor(
    public loginService: LoginService,
    private chatterzService: ChatterzService,
    private chatSignalRService: ChatSignalRService,
    public datePipe: DatePipe) { }

  async ngOnInit(): Promise<void> {
    this.chatterzService.inChatRoom.subscribe({
      next: (res) => {
        this.isInChatroom = res
        this.msgInbox = []
        if (this.chatterzService.chatroomId) {
          this.chatterzService.getChatHistory(this.chatterzService.chatroomId).subscribe({
            next: (res) => {
              this.addChatHistoryToInbox(res)
            },
            error: (err) => console.error(err)
          })
        }
      },
      error: (err) => console.error(err)
    })

    this.chatSignalRService.retrieveUserConnected().subscribe((userName: string) => {
      this.msgInbox.push(userName + " joined")
    })
    this.chatSignalRService.retrieveUserDisconnected().subscribe((userName: string) => {
      this.msgInbox.push(userName + " disconnected")
    })
    this.chatSignalRService.retrieveMessage().subscribe((message: ChatMessage) => {
      console.log("retrieved a new message")
      this.addToInbox(message)
    })
  }

  async sendMessage(): Promise<void> {
    if (this.message.length === 0) return

    await this.chatSignalRService.sendMessageToHub(this.message, this.chatterzService.chatroomId)
      .then(_ => {
        this.chatterzService.saveChat(
          this.chatterzService.chatroomId,
          this.loginService.user.UserName,
          this.message,
          this.chatSignalRService.connectionId)
          .subscribe({
            next: () => { },
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

  private addToInbox(message: ChatMessage): void {
    let time = this.datePipe.transform(message.DateTime, 'HH:MM')
    this.msgInbox.push(time + " " + '<span class="msg-blue">' + message.UserName + '</span>' + ": " + message.Text)
  }

  private addChatHistoryToInbox(messages: any[]): void {
    let msgs: ChatMessage[] = []
    messages.forEach(msg => {
      msgs.push({ DateTime: msg.dateTime, UserName: msg.userName, Text: msg.text, ConnectionId: msg.connectionId, ChatroomId: msg.chatroomId })
    });

    for (let i = 0; i < msgs.length; i++) {
      this.addToInbox(msgs[i])
    }
  }
}
