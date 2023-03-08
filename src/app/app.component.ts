import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/services/login.service';
import { NotificationService } from 'src/services/signalR-services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    public loginService: LoginService,
    private notificationService: NotificationService) { }

  private notificationSubscription = new Subscription()

  async ngOnInit() {
    await this.notificationService.connect()

    this.retrieveNotification()
  }

  async ngOnDestroy() {
    await this.notificationService.disconnect()

    this.notificationSubscription.unsubscribe()
  }

  private retrieveNotification() {
    this.notificationSubscription = this.notificationService.retrieveNotification().subscribe((message: string) => {
      console.log("display this: ")
      console.log(message)
    })
  }
}
