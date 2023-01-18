import { ChatMessage } from "src/app/models/ChatMessage"
import { changeUsernameDto } from "src/app/models/changeUsernameDto"
import { ChatroomJoinDto } from "src/app/models/chatroomJoinDto"
import { ConnectionInfo } from "src/app/models/connectionInfo"
import { UserLoginInfo } from "src/app/models/userLoginInfo"

export class DtoBuilder {

    public static buildChatroomJoinDto(chatroomId: string, userId: string, connectionId: string): ChatroomJoinDto {
        return {
            ChatroomId: chatroomId,
            UserId: userId,
            ConnectionId: connectionId
        }
    }
    public static buildConnectionInfo(userId: string, connectionId: string): ConnectionInfo {
        return {
            ConnectionId: connectionId,
            UserId: userId
        }
    }

    public static buildChatMessageInfo(chatroomId: string, userName: string, message: string, connectionId: string): ChatMessage {
        return {
            ChatroomId: chatroomId,
            UserName: userName,
            Text: message,
            ConnectionId: connectionId,
            DateTime: new Date()
        }
    }

    public static buildChangeUsernameDto(newUsername: string, userId: string): changeUsernameDto {
        return {
            NewUsername: newUsername,
            UserId: userId
        }
    }
    
    public static buildUserLoginInfo(username: string, password: string): UserLoginInfo {
        return {
            Id: undefined,
            UserName: username,
            Password: password
        }
    }
}