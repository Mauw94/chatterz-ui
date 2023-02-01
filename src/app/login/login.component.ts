import { Component, } from '@angular/core';
import { LoginService } from 'src/services/login.service';
import { UserLoginInfo } from '../models/userLoginInfo';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  username: string = ""
  password: string = ""

  constructor(
    private loginService: LoginService) {
    this.loginService.checkCookie()
  }

  login(): void {
    if (this.username && this.password) {
      this.loginService.login(this.username, this.password).subscribe({
        next: (res) => {
          this.loginService.user = this.newUserLoginInfo(res.id, res.userName, res.password, res.chatroomId)
          this.loginService.userSubject.next(res)
          this.loginService.isLoggedIn = true
          this.loginService.setCookie()
        },
        error: (err) => console.error(err)
      })
    }
  }

  private newUserLoginInfo(id: number, username: string, password: string, chatroomId: number): UserLoginInfo {
    return {
      Id: id,
      UserName: username,
      Password: password,
      ChatroomId: chatroomId
    }
  }

}
