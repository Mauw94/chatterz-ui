import { UserLoginInfo } from "./userLoginInfo"

export class GameConnectDto {
    GameId: number
    Player: UserLoginInfo
    ConnectionId: string
}