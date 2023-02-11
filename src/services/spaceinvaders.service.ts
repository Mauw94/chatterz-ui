import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Const } from "src/utils/const";

@Injectable({ providedIn: 'root' })
export class SpaceInvadersService {

    private apiUrl = Const.getBaseUrl() + "api/game/spaceinvaders/"

    constructor(private http: HttpClient) { }

    public highScore(): Observable<any> {
        return this.http.get(this.apiUrl + "highscore")
    }
}