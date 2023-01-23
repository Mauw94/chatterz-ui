import { UserLoginInfo } from "./userLoginInfo";

export class GameInviteDto {
    Challenger: UserLoginInfo
    UserId: string
    InviteMessage: string
    GameId: number
}