import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import * as signalR from "@microsoft/signalr"
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { ChatMessage } from "src/app/models/ChatMessage";
import { Const } from "src/utils/const";
import { LoginService } from "./login.service";
import { ChatroomDto } from "src/app/models/chatroomDto";
import { DtoBuilder } from "src/utils/dto-builder";
import { changeUsernameDto } from "src/app/models/changeUsernameDto";

@Injectable({ providedIn: 'root' })
export class ChatSignalRService {

    public connectionId: string = ""
    public connectionEstablished: Subject<boolean> = new Subject<boolean>()

    private hubConnection: signalR.HubConnection
    private connectionUrl = Const.getBaseUrl() + "signalr"
    private apiUrl = Const.getBaseUrl() + "api/chat/send"
    private apiSignalRUrl = Const.getBaseUrl() + "api/signalr/"

    private chatroomsSubject: Subject<ChatroomDto[]> = new Subject<ChatroomDto[]>()
    private messageSubject = new Subject<ChatMessage>()
    private userConnectedSubject = new Subject<string>()
    private userDisconnectedSubject = new Subject<string>()
    private usernameChangedSubject = new Subject<changeUsernameDto>()

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
            })
            .catch((err) => console.error(err))
    }

    public sendMessageToApi(message: string): Observable<any> {
        return this.http.post(this.apiUrl,
            DtoBuilder.buildChatMessageInfo(undefined, this.loginService.user.UserName, message, this.hubConnection.connectionId))
            .pipe(tap(_ => console.log("message sucessfully sent to api")))
    }

    public async sendMessageToHub(message: string, chatroomId: string): Promise<any> {
        var promise = await this.hubConnection.invoke("BroadcastAsync",
            DtoBuilder.buildChatMessageInfo(chatroomId, this.loginService.user.UserName, message, this.hubConnection.connectionId))
            .then(() => console.log("message sent to hub"))
            .catch((err) => console.error("error while sending message to hub"))

        return promise
    }

    public retrieveMessage(): Observable<ChatMessage> {
        return this.messageSubject.asObservable();
    }

    public retrieveChatrooms(): Observable<ChatroomDto[]> {
        return this.chatroomsSubject.asObservable()
    }

    public retrieveUserConnected(): Observable<string> {
        return this.userConnectedSubject.asObservable()
    }

    public retrieveUserDisconnected(): Observable<string> {
        return this.userDisconnectedSubject.asObservable()
    }

    public retrieveUsernameChanged(): Observable<changeUsernameDto> {
        return this.usernameChangedSubject.asObservable()
    }

    public reconnectToChatrooms(currentChatroomId: string, userId: string, connectionId: string): Observable<any> {
        return this.http.post(this.apiSignalRUrl + "connect",
            DtoBuilder.buildChatroomJoinDto(currentChatroomId, userId, connectionId))
    }

    private disconnectSignalRApi(): void {
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

    private async startConnection(): Promise<void> {
        this.hubConnection = this.getConnection()

        await this.hubConnection.start()
            .then(() => {
                console.log("connection started")
                this.connectionId = this.hubConnection.connectionId
                this.connectionEstablished.next(true)
            })
            .catch((err) => console.error("error while establishing signalr connection"))
    }

    private async addListeners(): Promise<void> {
        this.hubConnection.on("messageReceivedFromApi", (data: ChatMessage) => {
            this.ngZone.run(() => this.messageSubject.next(data))
        })
        this.hubConnection.on("messageReceivedFromHub", (data: ChatMessage) => {
            this.ngZone.run(() => this.messageSubject.next(data))
        })
        this.hubConnection.on("usernameUpdated", (data: changeUsernameDto) => {
            this.usernameChangedSubject.next(data)
        })
        this.hubConnection.on("userConnected", (userName: string) => {
            this.userConnectedSubject.next(userName)
        })
        this.hubConnection.on("userDisconnected", (userName: string) => {
            this.userDisconnectedSubject.next(userName)
        })
        this.hubConnection.on("roomsUpdated", (chatrooms: ChatroomDto[]) => {
            this.chatroomsSubject.next(chatrooms)
        })
    }
}