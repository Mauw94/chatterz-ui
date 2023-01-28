import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Const } from "src/utils/const";
import { Observable, Subject } from "rxjs";
import { DtoBuilder } from "src/utils/dto-builder";
import { GameInviteDto } from "src/app/models/gameInviteDto";

@Injectable({ providedIn: 'root' })
export class ChatterzService {

    public chatroomId: number

    public inChatRoom: Subject<boolean> = new Subject<boolean>()
    public createChatroomSubject: Subject<boolean> = new Subject<boolean>()

    private apiChatroomUrl = Const.getBaseUrl() + "api/chatroom/"
    private apiUsersUrl = Const.getBaseUrl() + "api/users/"

    constructor(
        private http: HttpClient) { }

    public createChatroom(): Observable<any> {
        return this.http.post(this.apiChatroomUrl + "create", {}, { responseType: 'text' })
    }

    public joinChatroom(chatroomId: number, userId: number, connectionId: string): Observable<any> {
        return this.http.post(this.apiChatroomUrl + "join",
            DtoBuilder.buildChatroomJoinDto(chatroomId, userId, connectionId))
    }

    public leaveChatroom(chatroomId: number, userId: number, connectionId: string): Observable<any> {
        return this.http.post(this.apiChatroomUrl + "leave",
            DtoBuilder.buildChatroomJoinDto(chatroomId, userId, connectionId))
    }

    public getAllChatrooms(): Observable<any> {
        return this.http.get(this.apiChatroomUrl + "all")
    }

    public changeUsername(oldUsername: string, newUsername: string, userId: number, chatroomId: number): Observable<any> {
        return this.http.post(this.apiUsersUrl + "change_username",
            DtoBuilder.buildChangeUsernameDto(oldUsername, newUsername, userId, chatroomId))
    }

    public saveChat(chatroomId: number, userName: string, message: string, connectionId: string): Observable<any> {
        return this.http.post(this.apiChatroomUrl + "send",
            DtoBuilder.buildChatMessageInfo(chatroomId, userName, message, connectionId))
    }

    public checkWordGuesserInProgress(userId: number): Observable<any> {
        return this.http.get(this.apiUsersUrl + "check_game_inprogress?userId=" + userId)
    }

    public getChatHistory(chatroomId: number): Observable<any> {
        return this.http.get(this.apiChatroomUrl + "history?chatroomId=" + chatroomId)
    }

    public getConnectedUsers(): Observable<any> {
        return this.http.get(this.apiChatroomUrl + "users?chatroomId=" + this.chatroomId)
    }

    public retrieveInChatroom(): Observable<boolean> {
        return this.inChatRoom.asObservable()
    }

    public retrieveChatroomCreate(): Observable<boolean> {
        return this.createChatroomSubject.asObservable()
    }

    public challengePlayer(challengerUserId: number, userId: number, inviteMessage: string, gameType: number): Observable<any> {
        return this.http.get(this.apiUsersUrl +
            "challenge?userId=" + userId +
            "&inviteMessage=" + inviteMessage +
            "&challengerUserId=" + challengerUserId +
            "&gameType=" + gameType)
    }

    public acceptGameInvite(gameInvite: GameInviteDto): Observable<any> {
        console.log(gameInvite)
        return this.http.post(this.apiUsersUrl + "accept_gameinvite", gameInvite)
    }
}