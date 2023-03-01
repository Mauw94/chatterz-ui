import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Const } from "src/utils/const";

@Injectable({ providedIn: 'root' })
export class SpaceInvadersService {

    private apiUrl = Const.getBaseUrl() + "api/game/spaceinvaders/"

    constructor(private http: HttpClient) { }

    public startGame(userId: number): Observable<any> {
        return this.http.get(this.apiUrl + "start?userId=" + userId)
    }

    public saveScore(gameId: number, score: number): Observable<any> {
        return this.http.post(this.apiUrl + "savescore?gameId=" + gameId + "&score=" + score, {})
    }

    public highScore(): Observable<any> {
        return this.http.get(this.apiUrl + "highscore")
    }
}