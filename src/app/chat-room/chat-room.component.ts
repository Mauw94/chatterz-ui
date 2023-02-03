import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatterzService } from 'src/services/chatterz.service';
import { ChatroomDto } from '../models/chatroomDto';
import { ChatSignalRService } from 'src/services/chat-signalr.service';
import { LoginService } from 'src/services/login.service';
import { UserLoginInfo } from '../models/userLoginInfo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, OnDestroy {

  public chatroomId: number
  public chatrooms: ChatroomDto[] = []
  public MAX_USERS: number = 5

  private chatroomsCreateSubscription = new Subscription()
  private chatroomsUpdateSubscription = new Subscription()

  constructor(
    private chatterzService: ChatterzService,
    private signalRService: ChatSignalRService,
    private loginService: LoginService) { }

  ngOnInit(): void {
    // timeout so other components initialize first which are subscribed to
    // observables that are used in this (chatroom) component
    // little sketchy implementation, but it'll do for now
    setTimeout(() => {
      if (this.loginService.user.ChatroomId) {
        this.joinRoom(this.loginService.user.ChatroomId)
      } else {
        this.getAllChatrooms()
      }
    }, 2000)

    this.chatroomsCreateSubscription = this.chatterzService.retrieveChatroomCreate().subscribe((create) => {
      if (create) {
        this.create()
      }
    })

    this.retrieveChatroomsOnUpdate()
  }

  ngOnDestroy(): void {
    this.chatroomsCreateSubscription.unsubscribe()
    this.chatroomsUpdateSubscription.unsubscribe()
  }

  joinRoom(id: number): void {
    this.chatterzService.joinChatroom(id, this.loginService.user.Id, this.signalRService.connectionId)
      .subscribe({
        next: () => {
          this.chatroomId = id
          this.chatterzService.chatroomId = id
          this.chatterzService.inChatRoom.next(true)
          this.loginService.user.ChatroomId = id
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

  private create(): void {
    this.chatterzService.createChatroom()
      .subscribe({
        next: (chatroomId: number) => { this.joinRoom(chatroomId) },
        error: (err) => console.error(err)
      })
  }

  private getAllChatrooms(): void {
    this.chatterzService.getAllChatrooms().subscribe({
      next: (chatrooms) => {
        this.chatrooms = []
        chatrooms.forEach(cr => {
          this.chatrooms.push(this.newChatroom(cr.id, cr.users))
        })
      },
      error: (err) => console.error(err)
    })
  }

  private retrieveChatroomsOnUpdate(): void {
    this.chatroomsUpdateSubscription = this.signalRService.retrieveChatrooms().subscribe({
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
