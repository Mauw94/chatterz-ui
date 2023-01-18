import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Const } from "src/utils/const";
import { ConnectionInfo } from "src/app/models/connectionInfo";
import { Observable, Subject } from "rxjs";
import { changeUsernameDto } from "src/app/models/changeUsernameDto";
import { ChatroomJoinDto } from "src/app/models/chatroomJoinDto";
import { ChatMessage } from "src/app/models/ChatMessage";
import { DtoBuilder } from "src/utils/dto-builder";

@Injectable({ providedIn: 'root' })
export class ChatterzService {

    public inChatRoom: Subject<boolean> = new Subject<boolean>()
    public chatroomId: string = ""

    private apiChatroomUrl = Const.getBaseUrl() + "api/chatroom/"
    private apiUsersUrl = Const.getBaseUrl() + "api/users/"

    constructor(
        private http: HttpClient) { }

    public createChatroom(userId: string, connectionId: string): Observable<any> {
        return this.http.post(this.apiChatroomUrl + "create",
            DtoBuilder.buildConnectionInfo(userId, connectionId), { responseType: 'text' })
    }

    public joinChatroom(chatroomId: string, userId: string, connectionId: string): Observable<any> {
        return this.http.post(this.apiChatroomUrl + "join",
            DtoBuilder.buildChatroomJoinDto(chatroomId, userId, connectionId))
    }

    public getAllChatrooms(): Observable<any> {
        return this.http.get(this.apiChatroomUrl + "all")
    }

    public changeUsername(newUsername: string, userId: string): Observable<any> {
        return this.http.post(this.apiUsersUrl + "change_username",
        DtoBuilder.buildChangeUsernameDto(newUsername, userId))
    }

    public saveChat(chatroomId: string, userName: string, message: string, connectionId: string) {
        return this.http.post(this.apiChatroomUrl + "send",
            DtoBuilder.buildChatMessageInfo(chatroomId, userName, message, connectionId))
    }
}