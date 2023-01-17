import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Const } from "src/utils/const";
import { ConnectionInfo } from "src/app/models/connectionInfo";
import { Observable, Subject } from "rxjs";
import { changeUsernameDto } from "src/app/models/changeUsernameDto";
import { ChatroomJoinDto } from "src/app/models/chatroomJoinDto";
import { ChatMessage } from "src/app/models/ChatMessage";

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
            this.buildConnectionInfo(userId, connectionId), { responseType: 'text' })
    }

    public joinChatroom(chatroomId: string, userId: string, connectionId: string): Observable<any> {
        return this.http.post(this.apiChatroomUrl + "join",
            this.chatroomJoinDto(chatroomId, userId, connectionId))
    }

    public getAllChatrooms(): Observable<any> {
        return this.http.get(this.apiChatroomUrl + "all")
    }

    public changeUsername(newUsername: string, userId: string): Observable<any> {
        return this.http.post(this.apiUsersUrl + "change_username",
            this.changeUsernameDto(newUsername, userId))
    }

    public saveChat(chatroomId: string, userName: string, message: string, connectionId: string) {
        return this.http.post(this.apiChatroomUrl + "send",
            this.buildChatMessageInfo(chatroomId, userName, message, connectionId))
    }

    private chatroomJoinDto(chatroomId: string, userId: string, connectionId: string): ChatroomJoinDto {
        return {
            ChatroomId: chatroomId,
            UserId: userId,
            ConnectionId: connectionId
        }
    }
    private buildConnectionInfo(userId: string, connectionId: string): ConnectionInfo {
        return {
            ConnectionId: connectionId,
            UserId: userId
        }
    }

    private buildChatMessageInfo(chatroomId: string, userName: string, message: string, connectionId: string): ChatMessage {
        return {
            ChatroomId: chatroomId,
            UserName: userName,
            Text: message,
            ConnectionId: connectionId,
            DateTime: new Date()
        }
    }

    private changeUsernameDto(newUsername: string, userId: string): changeUsernameDto {
        return {
            NewUsername: newUsername,
            UserId: userId
        }
    }
}