import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { UserLoginInfo } from "src/app/models/userLoginInfo";
import { Const } from "src/utils/const";
import { DtoBuilder } from "src/utils/dto-builder";

@Injectable({ providedIn: 'root' })
export class RegisterService {

    public isLoggedIn: boolean = false
    public user: UserLoginInfo = new UserLoginInfo()
    public userSubject: Subject<UserLoginInfo> = new Subject<UserLoginInfo>()

    private apiUrl = Const.getBaseUrl() + "api/register/"

    constructor(private http: HttpClient) { }

    public register(username: string, password: string): Observable<any> {
        return this.http.post(this.apiUrl + "register",
            DtoBuilder.buildUserLoginInfo(username, password, undefined))
    }
}