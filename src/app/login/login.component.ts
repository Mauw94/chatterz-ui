import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private loginService: LoginService,
    private router: Router) { }

  ngOnInit(): void {
    this.loginService.fetchTestUser().subscribe({
      next: (res) => {
        this.loginService.user = res
        this.loginService.isLoggedIn = true
        this.loginService.setCookie()
      },
      error: (err) => console.error(err)
    })
    // this.loginService.checkCookie()
  }

  login(): void {
    this.loginService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        this.loginService.user = res
        this.loginService.isLoggedIn = true
        this.loginService.setCookie()
      },
      error: (err) => console.error(err)
    })
  }

}
