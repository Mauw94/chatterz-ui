import { Component, OnInit } from '@angular/core';
import { ChatSignalRService } from 'src/services/chat-signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Chatterz'
  text: string = ""

  constructor(public chatSignalRService: ChatSignalRService) { }

  ngOnInit() {
    this.chatSignalRService.connect()
  }

  sendMessage(): void {
    this.chatSignalRService.sendMessageToHub(this.text).subscribe({
      next: _ => this.text = "",
      error: (err) => console.error(err)
    })
  }
}
