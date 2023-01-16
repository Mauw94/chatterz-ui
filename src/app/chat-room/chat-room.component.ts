import { Component, OnInit } from '@angular/core';
import { ChatterzService } from 'src/services/chatterz.service';
import { ChatroomDto } from '../models/chatroomDto';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

  public chatroomId: string = ""
  public chatrooms: ChatroomDto[] = []

  constructor(private chatterzService: ChatterzService) { }

  ngOnInit(): void {
  }

  create(): void {
    this.chatterzService.createChatroom().subscribe({
      next: data => {
        this.chatroomId = data
        console.log(data)
      },
      error: error => console.error(error)
    })
  }

  getAllChatrooms(): void {
    this.chatterzService.getAllChatrooms().subscribe({
      next: (res) => {
        console.log(res)
        this.chatrooms = res
      },
      error: (err) => console.error(err)
    })
  }
}
