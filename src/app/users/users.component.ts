import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ChatterzService } from 'src/services/chatterz.service';
import { UserLoginInfo } from '../models/userLoginInfo';
import { LoginService } from 'src/services/login.service';
import { ChatSignalRService } from 'src/services/chat-signalr.service';
import { GameType } from '../models/gameTypeEnum';

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

  private userIdFromContextMenu: number

  constructor(
    private chatterzService: ChatterzService,
    private signalRService: ChatSignalRService,
    private loginService: LoginService) { }

  ngOnInit(): void {
    this.retrieveIsInChatroom()
    this.retrieveUsersList()
  }

  public displayContextMenu(event: MouseEvent, userId: number): void {
    this.isDisplayContextMenu = true
    this.rightClickMenuItems =
      [
        "Play Wordguesser",
        "Play Bomberman"
      ]

    this.rightClickMenuPositionX = event.clientX
    this.rightClickMenuPositionY = event.clientY

    this.userIdFromContextMenu = userId
  }

  public handleMenuItemClick(event: string,) {
    let message: string = ""
    let gameType: number

    switch (event) {
      case "Play Wordguesser":
        message = "challenges you to play a game of word guesser! Do you accept?"
        gameType = 0
        break
      case "Play Bomberman":
        message = "challenges you to play a game of bomberman! Do you accept?"
        gameType = 1
        break
    }

    this.chatterzService.challengePlayer(
      this.loginService.user.Id,
      this.userIdFromContextMenu,
      message,
      gameType)
      .subscribe({
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

  private retrieveIsInChatroom(): void {
    this.chatterzService.inChatRoom.subscribe((inChatroom) => {
      if (!inChatroom) {
        this.users = []
      }
    })
  }

  private retrieveUsersList(): void {
    this.signalRService.retrieveUsersList().subscribe((users) => {
      this.users = users
    })
  }

}
