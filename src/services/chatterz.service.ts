import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Const } from "src/utils/const";
import { Observable, Subject } from "rxjs";
import { DtoBuilder } from "src/utils/dto-builder";

@Injectable({ providedIn: 'root' })
export class ChatterzService {

    public inChatRoom: Subject<boolean> = new Subject<boolean>()
    public chatroomId: string = ""

    private apiChatroomUrl = Const.getBaseUrl() + "api/chatroom/"
    private apiUsersUrl = Const.getBaseUrl() + "api/users/"

    constructor(
        private http: HttpClient) { }

    public createChatroom(): Observable<any> {
        return this.http.post(this.apiChatroomUrl + "create", {}, { responseType: 'text' })
    }

    public joinChatroom(chatroomId: string, userId: string, connectionId: string): Observable<any> {
        return this.http.post(this.apiChatroomUrl + "join",
            DtoBuilder.buildChatroomJoinDto(chatroomId, userId, connectionId))
    }

    public leaveChatroom(chatroomId: string, userId: string, connectionId: string): Observable<any> {
        return this.http.post(this.apiChatroomUrl + "leave",
            DtoBuilder.buildChatroomJoinDto(chatroomId, userId, connectionId))
    }

    public getAllChatrooms(): Observable<any> {
        return this.http.get(this.apiChatroomUrl + "all")
    }

    public changeUsername(oldUsername: string, newUsername: string, userId: string, chatroomId: string): Observable<any> {
        return this.http.post(this.apiUsersUrl + "change_username",
            DtoBuilder.buildChangeUsernameDto(oldUsername, newUsername, userId, chatroomId))
    }

    public saveChat(chatroomId: string, userName: string, message: string, connectionId: string): Observable<any> {
        return this.http.post(this.apiChatroomUrl + "send",
            DtoBuilder.buildChatMessageInfo(chatroomId, userName, message, connectionId))
    }

    public getChatHistory(chatroomId: string): Observable<any> {
        return this.http.get(this.apiChatroomUrl + "history?chatroomId=" + chatroomId)
    }
}