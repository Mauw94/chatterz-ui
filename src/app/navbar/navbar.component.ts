import { Component, OnInit } from '@angular/core';
import { ChatSignalRService } from 'src/services/chat-signalr.service';
import { ChatterzService } from 'src/services/chatterz.service';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public showWordGuesserRoute: boolean = false

  constructor(
    public loginService: LoginService,
    private chatterzService: ChatterzService,
    private chatSignalRService: ChatSignalRService) { }

  ngOnInit(): void {
    this.chatterzService.checkWordGuesserInProgress(this.loginService.user.Id).subscribe({
      next: (res) => {
        if (res)
          this.showWordGuesserRoute = true
      },
      error: (err) => console.error(err)
    })
  }

  logout(): void {
    this.loginService.logout(this.chatterzService.chatroomId, this.chatSignalRService.connectionId)
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
  }
}
