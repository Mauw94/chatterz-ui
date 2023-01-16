import { Component, OnInit } from '@angular/core';
import { ChatterzService } from 'src/services/chatterz.service';
import { ChatroomDto } from '../models/chatroomDto';
import { ChatSignalRService } from 'src/services/chat-signalr.service';

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
    private signalRService: ChatSignalRService) { }

  ngOnInit(): void {
    this.signalRService.connectionEstablished.subscribe({
      next: () => this.getAllChatrooms(),
      error: (err) => console.error(err)
    })
  }

  joinRoom(id: string): void {
    console.log("joining gameroom.." + id)
  }

  create(): void {
    this.chatterzService.createChatroom().subscribe({
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
          this.chatterzService.inChatRoom.next(this.isInChatroom(this.chatrooms))
        }
      },
      error: (err) => console.error(err)
    })
  }

  private isInChatroom(chatrooms: ChatroomDto[]): boolean {
    for (let i = 0; i < chatrooms.length; i++) {
      if (chatrooms[i].users.map(u => u.id).includes(this.signalRService.user.id)) {
        console.log("current chatroom: " + chatrooms[i].id)
        this.chatroomId = chatrooms[i].id
        return true
      }
    }
    return false
  }
}
