import { Component, OnInit } from '@angular/core';
import { ChatterzService } from 'src/services/chatterz.service';
import { UserLoginInfo } from '../models/userLoginInfo';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public users: UserLoginInfo[] = []

  constructor(private chatterzService: ChatterzService) { }

  ngOnInit(): void {
    this.retrieveUpdateChatroom()
    this.retrieveIsInChatroom()
  }

  private retrieveUpdateChatroom(): void {
    this.chatterzService.retrieveChatroomUpdated().subscribe((update) => {
      if (update) {
        this.chatterzService.getConnectedUsers().subscribe({
          next: (users) => {
            this.users = this.newUserLoginInfo(users)
          },
          error: (err) => console.error(err)
        })
      }
    })
  }

  private retrieveIsInChatroom(): void {
    this.chatterzService.inChatRoom.subscribe((inChatroom) => {
      if (!inChatroom) {
        this.users = []
      }
    })
  }

  private newUserLoginInfo(users: any): UserLoginInfo[] {
    var newusers: UserLoginInfo[] = []
    users.forEach(user => {
      newusers.push({ Id: user.id, UserName: user.userName, Password: user.password })
    });

    return newusers
  }

}
