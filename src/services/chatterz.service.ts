import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Const } from "src/utils/const";
import { ChatSignalRService } from "./chat-signalr.service";
import { ConnectionInfo } from "src/app/models/connectionInfo";
import { Observable, Subject } from "rxjs";
import { changeUsernameDto } from "src/app/models/changeUsernameDto";
import { ChatroomJoinDto } from "src/app/models/chatroomJoinDto";

@Injectable({ providedIn: 'root' })
export class ChatterzService {

    public inChatRoom: Subject<boolean> = new Subject<boolean>()

    private apiChatroomUrl = Const.getBaseUrl() + "api/chatroom/"
    private apiUsersUrl = Const.getBaseUrl() + "api/users/"

    constructor(
        private http: HttpClient,
        private signalRService: ChatSignalRService) { }

    public createChatroom(): Observable<any> {
        return this.http.post(this.apiChatroomUrl + "create",
            this.buildConnectionInfo(), { responseType: 'text' })
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

    private chatroomJoinDto(chatroomId: string, userId: string, connectionId: string): ChatroomJoinDto {
        return {
            chatroomId: chatroomId,
            userId: userId,
            connectionId: connectionId
        }
    }
    private buildConnectionInfo(): ConnectionInfo {
        console.log(this.signalRService.user)
        return {
            connectionId: this.signalRService.connectionId,
            userId: this.signalRService.user.id
        }
    }

    private changeUsernameDto(newUsername: string, userId: string): changeUsernameDto {
        return {
            newUsername: newUsername,
            userId: userId
        }
    }
}