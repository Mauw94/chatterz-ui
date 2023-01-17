import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import * as signalR from "@microsoft/signalr"
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { ChatMessage } from "src/app/models/ChatMessage";
import { Const } from "src/utils/const";
import { LoginService } from "./login.service";
import { UserLoginInfo } from "src/app/models/userLoginInfo";

@Injectable({ providedIn: 'root' })
export class ChatSignalRService {

    public connectionId: string = ""
    public connectionEstablished: Subject<boolean> = new Subject<boolean>()

    private hubConnection: signalR.HubConnection
    private connectionUrl = Const.getBaseUrl() + "signalr"
    private apiUrl = Const.getBaseUrl() + "api/chat/send"
    private apiSignalRUrl = Const.getBaseUrl() + "api/signalr/"

    private messageSubject = new Subject<ChatMessage>()

    constructor(
        private http: HttpClient,
        private ngZone: NgZone,
        private loginService: LoginService) { }

    public async connect() {
        await this.startConnection()
        await this.addListeners()
    }

    public async disconnect() {
        await this.hubConnection.stop()
            .then(() => {
                this.disconnectSignalRApi()
                console.log("connection stopped")
                this.connectionEstablished.next(false)
                // todo api call here to end connection, remove from group etc
            })
            .catch((err) => console.error(err))
    }

    public sendMessageToApi(message: string) {
        return this.http.post(this.apiUrl, this.buildChatMessage(message, undefined))
            .pipe(tap(_ => console.log("message sucessfully sent to api")))
    }

    public async sendMessageToHub(message: string, chatroomId: string) {
        var promise = await this.hubConnection.invoke("BroadcastAsync", this.buildChatMessage(message, chatroomId))
            .then(() => console.log("message sent to hub"))
            .catch((err) => console.error("error while sending message to hub"))

        return promise
    }

    public retrieveMessage(): Observable<ChatMessage> {
        return this.messageSubject.asObservable();
    }

    public disconnectSignalRApi() {
        this.http.post(this.apiSignalRUrl + "disconnect", {}).subscribe({
            next: (res) => console.log(res),
            error: (err) => console.error(err)
        })
    }

    private getConnection(): signalR.HubConnection {
        return new signalR.HubConnectionBuilder()
            .withUrl(this.connectionUrl)
            .withHubProtocol(new MessagePackHubProtocol())
            .build()
    }

    private buildChatMessage(message: string, chatroomId: string): ChatMessage {
        return {
            ConnectionId: this.hubConnection.connectionId,
            Text: message,
            DateTime: new Date(),
            UserName: this.loginService.user.userName,
            ChatroomId: chatroomId
        }
    }

    private async startConnection() {
        this.hubConnection = this.getConnection()

        await this.hubConnection.start()
            .then(() => {
                console.log("connection started")
                this.connectionId = this.hubConnection.connectionId
                this.connectionEstablished.next(true)
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
        this.hubConnection.on("userConnected", _ => {
            console.log("new user connected")
        })
        this.hubConnection.onreconnected(() => {
            console.log("reconnected")
        })
        this.hubConnection.on("disconnected", () => {
            console.log("disconnected")
        })
    }
}