import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from 'src/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  username: string
  password: string
  passwordRepeat: string

  registering: boolean = false
  errorMessage: string = ""

  constructor(
    private registerService: RegisterService,
    private router: Router) { }

  ngOnInit(): void {
  }

  public register(): void {
    this.errorMessage = ""
    if (this.password === this.passwordRepeat) {
      this.registerService.register(this.username, this.password).subscribe({
        next: () => {
          this.errorMessage = ""
          this.router.navigate(["login"])
        },
        error: (err) =>
          this.errorMessage = err
      })
    } else {
      this.errorMessage = "Passwords do not match."
    }
  }
}
