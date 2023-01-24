import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatterzService } from 'src/services/chatterz.service';
import { ChatroomDto } from '../models/chatroomDto';
import { ChatSignalRService } from 'src/services/chat-signalr.service';
import { LoginService } from 'src/services/login.service';
import { UserLoginInfo } from '../models/userLoginInfo';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

  public chatroomId: number
  public chatrooms: ChatroomDto[] = []
  public MAX_USERS: number = 5

  constructor(
    private chatterzService: ChatterzService,
    private signalRService: ChatSignalRService,
    private loginService: LoginService) { }

  ngOnInit(): void {
    if (this.loginService.user.ChatroomId !== undefined) {
      this.joinRoom(this.loginService.user.ChatroomId)
    }

    this.chatterzService.createChatroomSubject.subscribe((create) => {
      if (create) {
        this.create()
      }
    })
    this.retrieveChatroomsOnUpdate()
  }

  joinRoom(id: number): void {
    this.chatterzService.joinChatroom(id, this.loginService.user.Id, this.signalRService.connectionId)
      .subscribe({
        next: () => {
          this.chatroomId = id
          this.chatterzService.chatroomId = id
          this.chatterzService.inChatRoom.next(true)
        },
        error: (err) => console.error(err)
      })
  }

  leaveRoom(id: number): void {
    this.chatterzService.leaveChatroom(id, this.loginService.user.Id, this.signalRService.connectionId).subscribe({
      next: () => {
        this.chatroomId = undefined
        this.chatterzService.chatroomId = undefined
        this.chatterzService.inChatRoom.next(false)
      },
      error: (err) => console.error(err)
    })
  }

  create(): void {
    this.chatterzService.createChatroom()
      .subscribe({
        next: (chatroomId: number) => { this.joinRoom(chatroomId) },
        error: (err) => console.error(err)
      })
  }

  private retrieveChatroomsOnUpdate(): void {
    this.signalRService.retrieveChatrooms().subscribe({
      next: (chatrooms) => {
        this.chatrooms = []
        chatrooms.forEach(cr => {
          this.chatrooms.push(this.newChatroom(cr.Id, cr.Users))
        });
        this.isInChatroom(this.chatrooms)
      },
      error: (err) => console.error(err)
    })
  }

  private isInChatroom(chatrooms: ChatroomDto[]): boolean {
    for (let i = 0; i < chatrooms.length; i++) {
      if (chatrooms[i].Users.map(u => u.Id).includes(this.loginService.user.Id)) {
        this.chatroomId = chatrooms[i].Id
        return true
      }
    }
    return false
  }

  private newChatroom(id: number, users: UserLoginInfo[]): ChatroomDto {
    return {
      Id: id,
      Users: this.newUserLoginInfo(users)
    }
  }

  private newUserLoginInfo(users): UserLoginInfo[] {
    var newUsers: UserLoginInfo[] = []
    users.forEach(u => {
      newUsers.push({ Id: u.Id, UserName: u.UserName, Password: u.Password, ChatroomId: u.ChatroomId })
    })

    return newUsers
  }
}
