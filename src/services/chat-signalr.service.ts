import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import * as signalR from "@microsoft/signalr"
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { ChatMessage } from "src/app/models/ChatMessage";
import { Const } from "src/utils/const";

@Injectable({ providedIn: 'root' })
export class ChatSignalRService {

    public connectionId: string = ""
    public connectionEstablished: boolean = false

    private hubConnection: signalR.HubConnection
    private connectionUrl = Const.getBaseUrl() + "signalr"
    private apiUrl = Const.getBaseUrl() + "api/chat/send"
    private messageSubject = new Subject<ChatMessage>()

    constructor(private http: HttpClient, private ngZone: NgZone) { }

    public async connect() {
        await this.startConnection()
        await this.addListeners()
    }

    public sendMessageToApi(message: string) {
        return this.http.post(this.apiUrl, this.buildChatMessage(message))
            .pipe(tap(_ => console.log("message sucessfully sent to api")))
    }

    public async sendMessageToHub(message: string) {
        var promise = await this.hubConnection.invoke("BroadcastAsync", this.buildChatMessage(message))
            .then(() => console.log("message sent to hub"))
            .catch((err) => console.error("error while sending message to hub"))

        return promise
    }

    public retrieveMessage(): Observable<ChatMessage> {
        return this.messageSubject.asObservable();
    }

    private getConnection(): signalR.HubConnection {
        return new signalR.HubConnectionBuilder()
            .withUrl(this.connectionUrl)
            .withHubProtocol(new MessagePackHubProtocol())
            .build()
    }

    private buildChatMessage(message: string): ChatMessage {
        return {
            ConnectionId: this.hubConnection.connectionId,
            Text: message,
            DateTime: new Date(),
            UserName: localStorage.getItem("username").toString()
        }
    }

    private async startConnection() {
        this.hubConnection = this.getConnection()

        await this.hubConnection.start()
            .then(() =>  { 
                console.log("connection started")
                this.connectionId = this.hubConnection.connectionId
                this.connectionEstablished = true
            })
            .catch((err) => console.error("error while establishing signalr connection"))
    }

    private async addListeners() {
        this.hubConnection.on("messageReceivedFromApi", (data: ChatMessage) => {
            this.ngZone.run(() => this.messageSubject.next(data))
        })
        this.hubConnection.on("messageReceivedFromHub", (data: ChatMessage) => {
            this.ngZone.run(() => this.messageSubject.next(data))
        })
        this.hubConnection.on("newUserConnected", _ => {
            console.log("new user connected")
        })
    } 
}