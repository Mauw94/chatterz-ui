import { Component, } from '@angular/core';
import { LoginService } from 'src/services/login.service';
import { UserLoginInfo } from '../models/userLoginInfo';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public loginFailed: boolean = false
  public username: string = ""
  public password: string = ""
  public loggingIn: boolean = false

  constructor(
    private loginService: LoginService) {
    this.loginService.checkCookie()
  }

  login(): void {
    if (this.username && this.password) {
      this.loggingIn = true
      this.loginService.login(this.username, this.password).subscribe({
        next: (res) => {
          this.loginService.user = this.newUserLoginInfo(res.id, res.userName, res.password, res.chatroomId)
          this.loginService.userSubject.next(res)
          this.loginService.isLoggedIn = true
          this.loginService.setCookie()
          this.loginFailed = false
        },
        error: (err) => { 
          this.loggingIn = false
          this.loginFailed = true
          console.error(err) 
        }
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
