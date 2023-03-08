import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatSignalRService } from 'src/services/signalR-services/chat-signalr.service';
import { ChatterzService } from 'src/services/chatterz.service';
import { LoginService } from 'src/services/login.service';
import { WordGuesserService } from 'src/services/signalR-services/word-guesser.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public showWordGuesserRoute: boolean = false
  private gameId: number

  constructor(
    public loginService: LoginService,
    private router: Router,
    private chatterzService: ChatterzService,
    private chatSignalRService: ChatSignalRService,
    private gameService: WordGuesserService) { }

  ngOnInit(): void {
    // this.chatterzService.checkWordGuesserInProgress(this.loginService.user.Id).subscribe({
    //   next: (res) => {
    //     console.log(res)
    //     if (res > 0) {
    //       this.showWordGuesserRoute = true
    //       this.gameId = res
    //     }
    //   },
    //   error: (err) => console.error(err)
    // })
  }

  async home(): Promise<void> {
    if (this.gameService.gameId !== undefined) {
      let res = window.confirm("Are you sure you want to leave the game?")
      if (res) {
        await this.gameService.disconnect()
        this.router.navigate(['main'])
      }
    } else {
      this.router.navigate(['main'])
    }
  }

  logout(): void {
    this.loginService.logout(this.chatSignalRService.connectionId)
  }

  createChatroom(): void {
    this.chatterzService.createChatroomSubject.next(true)
  }

  changeUsername(): void {
    var username = window.prompt("Enter your username")
    if (username.length > 2) {
      this.chatterzService.changeUsername(this.loginService.user.UserName, username, this.loginService.user.Id, this.chatterzService.chatroomId).subscribe({
        next: () => {
          this.loginService.user.UserName = username
        },
        error: (err) => console.error(err)
      })
    } else {
      this.changeUsername()
    }
  }

  goToWordGuesser(): void {
    console.log("go to wordguesser game in progress")
    this.router.navigate(['wordguesser', this.gameId])
  }

  launchBomberman(): void {
    this.router.navigate(['bomberman'])
  }

  launchSpaceinvaders(): void {
    this.router.navigate(['spaceinvaders'])
  }

  launchBattleships(): void {
    this.router.navigate(['battleships'])
  }
}
