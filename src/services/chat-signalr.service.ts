import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr"
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { from } from "rxjs";
import { tap } from "rxjs/operators";
import { chatMessage } from "src/app/models/chatMessage";

@Injectable({ providedIn: 'root' })
export class ChatSignalRService {

    public messages: chatMessage[] = []

    private hubConnection: signalR.HubConnection
    private connectionUrl = "https://localhost:7291/signalr"
    private apiUrl = "https://localhost:7291/api/chat/send"

    constructor(private http: HttpClient) { }

    public connect = () => {
        this.startConnection()
        this.addListeners()
    }

    public sendMessageToApi(message: string) {
        return this.http.post(this.apiUrl, this.buildChatMessage(message))
            .pipe(tap(_ => console.log("message sucessfully sent to api")))
    }

    public sendMessageToHub(message: string) {
        var promise = this.hubConnection.invoke("BroadcastAsync", this.buildChatMessage(message))
            .then(() => console.log("message sent to hub"))
            .catch((err) => console.error("error while sending message to hub"))

        return from(promise)
    }

    private getConnection(): signalR.HubConnection {
        return new signalR.HubConnectionBuilder()
            .withUrl(this.connectionUrl)
            .withHubProtocol(new MessagePackHubProtocol())
            .build()
    }

    private buildChatMessage(message: string): chatMessage {
        return {
            ConnectionId: this.hubConnection.connectionId,
            Text: message,
            DateTime: new Date(),
            UserName: localStorage.getItem("username").toString()
        }
    }

    private startConnection() {
        this.hubConnection = this.getConnection()

        this.hubConnection.start()
            .then(() => console.log("connection started"))
            .catch((err) => console.error("error while establishing signalr connection"))
    }

    private addListeners() {
        this.hubConnection.on("messageReceivedFromApi", (data: chatMessage) => {
            console.log("messaged received from API controller")
            this.messages.push(data)
        })
        this.hubConnection.on("messageReceivedFromHub", (data: chatMessage) => {
            console.log("message received from hub")
            this.messages.push(data)
        })
        this.hubConnection.on("newUserConnected", _ => {
            console.log("new user connected")
        })
    }

}