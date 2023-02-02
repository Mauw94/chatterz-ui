import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { UserLoginInfo } from "src/app/models/userLoginInfo";
import { Const } from "src/utils/const";
import * as signalR from "@microsoft/signalr"
import { GameConnectDto } from "src/app/models/gameConnectDto";
import { DtoBuilder } from "src/utils/dto-builder";
import { LoginService } from "./login.service";
import { WordGuesserDto } from "src/app/models/wordGuesserDto";
import { ChatMessage } from "src/app/models/chatMessage";

@Injectable({ providedIn: 'root' })
export class WordGuesserService {

    public gameId: number
    public connectionId: string = ""

    private apiUrl: string = Const.getBaseUrl() + "api/game/wordguesser/"
    private connectionUrl = Const.getBaseUrl() + "signalr_game"
    private hubConnection: signalR.HubConnection
    private wordGuesserSubject: Subject<WordGuesserDto> = new Subject<WordGuesserDto>()
    private connectionEstablishedSubject: Subject<boolean> = new Subject<boolean>()
    private canStartGameSubject: Subject<boolean> = new Subject<boolean>()
    private startGameSubject: Subject<WordGuesserDto> = new Subject<WordGuesserDto>()
    private gameEndSubject: Subject<string> = new Subject<string>()
    private gameWinSubject: Subject<string> = new Subject<string>()
    private messageSubject: Subject<ChatMessage> = new Subject<ChatMessage>()

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
                this.disconnectApi(this.gameId, this.connectionId, this.loginService.user.Id).subscribe(() => {
                    this.gameId = undefined
                    this.connectionEstablishedSubject.next(false)
                    console.log("game signalr connection stoppped")
                })
            })
            .catch((err) => console.error(err))
    }

    public async sendToHub(dto: WordGuesserDto): Promise<any> {
        var promise = await this.hubConnection.invoke("SendAsync",
            DtoBuilder.buildWordGuesserDto(dto.GuessedWord, dto.GameroomId, dto.PlayerToPlay, dto.PlayerIds, dto.WordToGuess))
            .then(() => console.log("message sent to hub"))
            .catch((err) => console.error(err))

        return promise;
    }

    public async sendMessageToHub(message: string, chatroomId: number): Promise<any> {
        var promise = await this.hubConnection.invoke("BroadcastAsync",
            DtoBuilder.buildChatMessageInfo(+chatroomId, this.loginService.user.UserName, message, this.hubConnection.connectionId))
            .then(() => console.log("message sent to hub"))
            .catch((err) => console.error(err))

        return promise
    }

    public create(): Observable<any> {
        return this.http.get(this.apiUrl + "create");
    }

    public connect(gameId: number, player: UserLoginInfo, connectionId: string): Observable<any> {
        return this.http.post(this.apiUrl + "connect", this.buildGameConnectDto(gameId, player, connectionId));
    }

    public disconnectApi(gameId: number, connectionId: string, playerId: number): Observable<any> {
        return this.http.post(this.apiUrl + "disconnect?gameId=" + gameId + "&connectionId=" + connectionId + "&playerId=" + playerId, {})
    }

    public canStart(gameId: number): Observable<any> {
        return this.http.get(this.apiUrl + "can_start?gameId=" + gameId)
    }

    public start(gameId: number, wordLength: number): Observable<any> {
        return this.http.get(this.apiUrl + "start?gameId=" + gameId + "&wordLength=" + wordLength);
    }

    public win(gameId: number): Observable<any> {
        return this.http.get(this.apiUrl + "win?gameId=" + gameId + "&playerId=" + this.loginService.user.Id)
    }

    public guess(gameId: number): Observable<any> {
        return this.http.post(this.apiUrl + "guess?gameId=" + gameId, {})
    }

    public retrieveMessage(): Observable<ChatMessage> {
        return this.messageSubject.asObservable()
    }

    public retrieveGameState(): Observable<WordGuesserDto> {
        return this.wordGuesserSubject.asObservable()
    }

    public retrieveConnectionEstablished(): Observable<boolean> {
        return this.connectionEstablishedSubject.asObservable()
    }

    public retrieveCanStartGameSubject(): Observable<boolean> {
        return this.canStartGameSubject.asObservable()
    }

    public retrieveStartGameSubject(): Observable<WordGuesserDto> {
        return this.startGameSubject.asObservable()
    }

    public retrieveGameEndSubject(): Observable<string> {
        return this.gameEndSubject.asObservable()
    }

    public retrieveGameWinSubject(): Observable<string> {
        return this.gameWinSubject.asObservable()
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
        this.hubConnection.on("messageReceivedFromHub", (message: ChatMessage) => {
            console.log(message)
            this.messageSubject.next(message)
        })
        this.hubConnection.on("gameUpdateReceievedFromHub", (dto: WordGuesserDto) => {
            this.wordGuesserSubject.next(dto)
        })
        this.hubConnection.on("canStartGame", (start: boolean) => {
            this.canStartGameSubject.next(start)
        })
        this.hubConnection.on("startGame", (dto: WordGuesserDto) => {
            this.startGameSubject.next(dto)
        })
        this.hubConnection.on("gameEnded", (message: string) => {
            this.gameEndSubject.next(message)
        })
        this.hubConnection.on("gameWin", (message: string) => {
            this.gameWinSubject.next(message)
        })
    }
}