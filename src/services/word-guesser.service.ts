import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserLoginInfo } from "src/app/models/userLoginInfo";
import { Const } from "src/utils/const";
import * as signalR from "@microsoft/signalr"
import { GameConnectDto } from "src/app/models/gameConnectDto";

@Injectable({ providedIn: 'root' })
export class WordGuesserService {

    public gameId: number
    public connectionId: string = ""

    private apiUrl: string = Const.getBaseUrl() + "api/game/wordguesser/"
    private connectionUrl = Const.getBaseUrl() + "signalr_game"
    private hubConnection: signalR.HubConnection

    constructor(private http: HttpClient) { }

    public async connectSignalR() {
        await this.startConnection()
        await this.addListeners()
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
    }
}