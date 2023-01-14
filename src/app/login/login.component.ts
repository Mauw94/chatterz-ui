import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = ""
  password: string = ""

  constructor(private loginService: LoginService) { }

  ngOnInit(): void { }

  login(): void {
    this.loginService.login(this.username, this.password).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.error(err)
    })
  }

}
