import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/services/login.service';

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
        next: (res: any) => {
          this.loginService.user = res
          this.loginService.userSubject.next(res)
          this.loginService.isLoggedIn = true
          this.loginService.setCookie()
        },
        error: (err) => console.error(err)
      })
    }
  }

}
