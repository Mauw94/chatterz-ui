import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserLoginInfo } from "src/app/models/userLoginInfo";
import { Const } from "src/utils/const";

@Injectable({ providedIn: 'root' })
export class WordGuesserService {

    private apiUrl: string = Const.getBaseUrl() + "api/game/wordguesser/"

    constructor(private http: HttpClient) { }

    public connect(player: UserLoginInfo): Observable<any> {
        return this.http.post(this.apiUrl + "connect", { player: player });
    }

}