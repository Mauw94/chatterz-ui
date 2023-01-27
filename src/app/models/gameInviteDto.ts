import { UserLoginInfo } from "./userLoginInfo";

export class GameInviteDto {
    Challenger: UserLoginInfo
    UserId: number
    InviteMessage: string
    GameType: number
}