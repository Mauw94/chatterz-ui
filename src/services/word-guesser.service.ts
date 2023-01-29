import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { UserLoginInfo } from "src/app/models/userLoginInfo";
import { Const } from "src/utils/const";
import * as signalR from "@microsoft/signalr"
import { GameConnectDto } from "src/app/models/gameConnectDto";
import { DtoBuilder } from "src/utils/dto-builder";
import { LoginService } from "./login.service";

@Injectable({ providedIn: 'root' })
export class WordGuesserService {

    public gameId: number
    public connectionId: string = ""

    private apiUrl: string = Const.getBaseUrl() + "api/game/wordguesser/"
    private connectionUrl = Const.getBaseUrl() + "signalr_game"
    private hubConnection: signalR.HubConnection
    private messageSubject: Subject<string> = new Subject<string>()
    private connectionEstablishedSubject: Subject<boolean> = new Subject<boolean>()

    constructor(
        private http: HttpClient,
        private loginService: LoginService) { }

    public async connectSignalR() {
        await this.startConnection()
        await this.addListeners()
    }

    public async disconnect() {
        await this.hubConnection.stop()
            .then(() => {
                // call api to dc
                this.connectionEstablishedSubject.next(false)
                console.log("game signalr connection stoppped")
            })
            .catch((err) => console.error(err))
    }

    public async sendToHub(guessedWord: string, gameroomId: string): Promise<any> {
        var promise = await this.hubConnection.invoke("SendAsync",
            DtoBuilder.buildWordGuesserDto(guessedWord, gameroomId, this.loginService.user.Id, this.connectionId))
            .then(() => console.log("message sent to hub"))
            .catch((err) => console.error(err))

        return promise;
    }

    public create(): Observable<any> {
        return this.http.get(this.apiUrl + "create");
    }

    public connect(gameId: number, player: UserLoginInfo, connectionId: string): Observable<any> {
        return this.http.post(this.apiUrl + "connect", this.buildGameConnectDto(gameId, player, connectionId));
    }

    public start(gameId: number): Observable<any> {
        return this.http.get(this.apiUrl + "start?gameId=" + gameId);
    }

    public retrieveMessage(): Observable<string> {
        return this.messageSubject.asObservable()
    }

    public retrieveConnectionEstablished(): Observable<boolean> {
        return this.connectionEstablishedSubject.asObservable()
    }

    private buildGameConnectDto(gameId: number, player: UserLoginInfo, connectionId: string): GameConnectDto {
        return {
            GameId: gameId,
            Player: player,
            ConnectionId: connectionId
        }
    }

    private async startConnection(): Promise<void> {
        this.hubConnection = this.getConnection()

        await this.hubConnection.start()
            .then(() => {
                console.log("game signalr connection started")
                this.connectionId = this.hubConnection.connectionId
                this.connectionEstablishedSubject.next(true)
            })
            .catch((err) => console.error(err))
    }

    private getConnection(): signalR.HubConnection {
        return new signalR.HubConnectionBuilder()
            .withUrl(this.connectionUrl)
            .build()
    }

    private async addListeners(): Promise<void> {
        this.hubConnection.on("PlayerJoined", (message: string) => {
            console.log(message)
        })
        this.hubConnection.on("gameUpdateReceievedFromHub", (message: string) => {
            console.log(message)
            this.messageSubject.next(message)
        })
    }
}