import { Component, OnInit } from '@angular/core';
import { ChatterzService } from 'src/services/chatterz.service';
import { ChatroomDto } from '../models/chatroomDto';
import { ChatSignalRService } from 'src/services/chat-signalr.service';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

  public chatroomId: string = ""
  public chatrooms: ChatroomDto[] = []

  constructor(
    private chatterzService: ChatterzService,
    private signalRService: ChatSignalRService,
    private loginService: LoginService) { }

  ngOnInit(): void {
    this.getAllChatrooms()
  }

  joinRoom(id: string): void {
    this.chatterzService.joinChatroom(id, this.loginService.user.id, this.signalRService.connectionId)
      .subscribe({
        next: () => {
          this.chatroomId = id
          this.chatterzService.chatroomId = id
          this.chatterzService.inChatRoom.next(true)
        },
        error: (err) => console.error(err)
      })
  }

  create(): void {
    this.chatterzService.createChatroom(this.loginService.user.id, this.signalRService.connectionId)
      .subscribe({
        next: data => {
          this.chatroomId = data
          this.getAllChatrooms()
        },
        error: error => console.error(error)
      })
  }

  private getAllChatrooms(): void {
    this.chatterzService.getAllChatrooms().subscribe({
      next: (res) => {
        this.chatrooms = res
        if (res !== null) {
          let isInChatroom = this.isInChatroom(this.chatrooms)
          this.chatterzService.inChatRoom.next(isInChatroom)
          if (isInChatroom) {
            console.log("is in a chatroom with id" + this.chatroomId)
            this.joinRoom(this.chatroomId)
          }
        }
      },
      error: (err) => console.error(err)
    })
  }

  private isInChatroom(chatrooms: ChatroomDto[]): boolean {
    for (let i = 0; i < chatrooms.length; i++) {
      if (chatrooms[i].users.map(u => u.id).includes(this.loginService.user.id)) {
        console.log("current chatroom: " + chatrooms[i].id)
        this.chatroomId = chatrooms[i].id
        return true
      }
    }
    return false
  }
}
