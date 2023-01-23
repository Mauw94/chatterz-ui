import { Component, HostListener, OnInit } from '@angular/core';
import { ChatterzService } from 'src/services/chatterz.service';
import { UserLoginInfo } from '../models/userLoginInfo';
import { LoginService } from 'src/services/login.service';

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

  constructor(
    private chatterzService: ChatterzService,
    private loginService: LoginService) { }

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

  public handleMenuItemClick(event: string, userId: string) {
    let message: string = ""

    switch (event) {
      case "ChallengeWordGuesser":
        message = "challenges you to play a game of word guesser! Do you accept?"
        break
      case "ChallengeBomberman":
        message = "challenges you to play a game of bomberman! Do you accept?"
        break
    }

    this.chatterzService.challengePlayer(this.loginService.user.Id, userId, message).subscribe({
      next: () => { },
      error: (err) => console.error(err)
    })
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
