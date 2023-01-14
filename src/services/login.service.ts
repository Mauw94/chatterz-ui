import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserLoginInfo } from "src/app/models/userLoginInfo";
import { Const } from "src/utils/const";

@Injectable({providedIn: 'root'})
export class LoginService {

    public loggedIn: boolean = false
    
    private apiUrl = Const.getBaseUrl() + "api/login/"

    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post(this.apiUrl + "login", 
            this.createUserLoginInfo(username, password))
    }

    createTempUser(username: string, password: string): Observable<any> {
        return this.http.post(this.apiUrl + "create", 
            this.createUserLoginInfo(username, password))
    }

    private createUserLoginInfo(username: string, password: string): UserLoginInfo {
        return {
            userName: username,
            password: password
        }
    }
}