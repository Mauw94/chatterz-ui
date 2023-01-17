import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/services/login.service';
import { UserLoginInfo } from '../models/userLoginInfo';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string = ""
  password: string = ""

  constructor(
    private loginService: LoginService) { }

  ngOnInit(): void { }

  login(): void {
    if (this.username && this.password) {
      this.loginService.login(this.username, this.password).subscribe({
        next: (res) => {
          this.loginService.user = this.newUserLoginInfo(res.id, res.userName, res.password)
          this.loginService.userSubject.next(res)
          this.loginService.isLoggedIn = true
          this.loginService.setCookie()
        },
        error: (err) => console.error(err)
      })
    }
  }

  private newUserLoginInfo(id: string, username: string, password: string): UserLoginInfo {
    return {
      Id: id,
      UserName: username,
      Password: password
    }
  }

}
