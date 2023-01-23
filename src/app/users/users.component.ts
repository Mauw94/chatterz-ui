import { Component, HostListener, OnInit } from '@angular/core';
import { ChatterzService } from 'src/services/chatterz.service';
import { UserLoginInfo } from '../models/userLoginInfo';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public users: UserLoginInfo[] = []
  public isDisplayContextMenu: boolean = false
  public rightClickMenuItems: string[] = []
  public rightClickMenuPositionX: number
  public rightClickMenuPositionY: number

  constructor(private chatterzService: ChatterzService) { }

  ngOnInit(): void {
    this.retrieveUpdateChatroom()
    this.retrieveIsInChatroom()
  }

  public displayContextMenu(event: MouseEvent): void {
    this.isDisplayContextMenu = true
    this.rightClickMenuItems =
      [
        "ChallengeWordGuesser",
        "ChallengeBomberman"
      ]

    this.rightClickMenuPositionX = event.clientX
    this.rightClickMenuPositionY = event.clientY
  }

  public handleMenuItemClick(event) {
    switch (event) {
      case "ChallengeWordGuesser":
        console.log("launch word guesser game")
        break
      case "ChallengeBomberman":
        console.log("launch bomberman")
        break
    }
  }

  public getRightClickMenuStyle() {
    return {
      position: 'fixed',
      left: `${this.rightClickMenuPositionX}`,
      top: `${this.rightClickMenuPositionY}`
    }
  }

  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayContextMenu = false
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
