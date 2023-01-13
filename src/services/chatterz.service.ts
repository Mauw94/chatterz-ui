import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Const } from "src/utils/const";
import { ChatSignalRService } from "./chat-signalr.service";
import { tap } from "rxjs/operators";
import { connectionInfo } from "src/app/models/connectionInfo";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class ChatterzService {
    
    private apiUrl = Const.getBaseUrl() + "api/chatroom/create"

    constructor(private http: HttpClient, private signalRService: ChatSignalRService) {}

    public createChatroom(): Observable<any> {
        if (this.signalRService.connectionEstablished) {
            return this.http.post(this.apiUrl, this.buildConnectionInfo(), {responseType: 'text'})
        }
    }

    private buildConnectionInfo(): connectionInfo {
        return {
            ConnectionId: this.signalRService.connectionId
        }
    }
}