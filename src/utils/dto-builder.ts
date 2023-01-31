import { ChatMessage } from "src/app/models/chatMessage"
import { changeUsernameDto } from "src/app/models/changeUsernameDto"
import { ChatroomJoinDto } from "src/app/models/chatroomJoinDto"
import { ConnectionInfo } from "src/app/models/connectionInfo"
import { UserLoginInfo } from "src/app/models/userLoginInfo"
import { WordGuesserDto } from "src/app/models/wordGuesserDto"

export class DtoBuilder {

    public static buildChatroomJoinDto(chatroomId: number, userId: number, connectionId: string): ChatroomJoinDto {
        return {
            ChatroomId: chatroomId,
            UserId: userId,
            ConnectionId: connectionId
        }
    }

    public static buildConnectionInfo(userId: number, connectionId: string): ConnectionInfo {
        return {
            ConnectionId: connectionId,
            UserId: userId
        }
    }

    public static buildChatMessageInfo(chatroomId: number, userName: string, message: string, connectionId: string): ChatMessage {
        return {
            ChatroomId: chatroomId,
            UserName: userName,
            Text: message,
            ConnectionId: connectionId,
            DateTime: new Date()
        }
    }

    public static buildChangeUsernameDto(oldUsername: string, newUsername: string, userId: number, chatroomId: number): changeUsernameDto {
        return {
            OldUsername: oldUsername,
            NewUsername: newUsername,
            UserId: userId,
            ChatroomId: chatroomId
        }
    }

    public static buildUserLoginInfo(username: string, password: string, chatroomId: number): UserLoginInfo {
        return {
            Id: undefined,
            UserName: username,
            Password: password,
            ChatroomId: chatroomId
        }
    }

    public static buildWordGuesserDto(guessedWord: string, gameroomId: string, playerToPlay: number, playerIds: number[], wordToGuess: string): WordGuesserDto {
        return {
            GuessedWord: guessedWord,
            GameroomId: gameroomId,
            PlayerToPlay: playerToPlay,
            PlayerIds: playerIds,
            WordToGuess: wordToGuess
        }
    }
}