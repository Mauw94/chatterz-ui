import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Observable, Subject } from "rxjs";
import { UserLoginInfo } from "src/app/models/userLoginInfo";
import { Const } from "src/utils/const";
import { DtoBuilder } from "src/utils/dto-builder";

@Injectable({ providedIn: 'root' })
export class LoginService {

    public isLoggedIn: boolean = false
    public user: UserLoginInfo = new UserLoginInfo()
    public userSubject: Subject<UserLoginInfo> = new Subject<UserLoginInfo>()

    private apiUrl = Const.getBaseUrl() + "api/login/"

    constructor(
        private http: HttpClient,
        private router: Router,
        private cookieService: CookieService) { }

    public fetchTestUser(): Observable<any> {
        return this.http.get(this.apiUrl + "new")
    }

    public login(username: string, password: string): Observable<any> {
        return this.http.post(this.apiUrl + "login",
            DtoBuilder.buildUserLoginInfo(username, password, undefined))
    }

    public logout(connectionId: string): void {
        this.apiLogout(this.user.Id, connectionId).subscribe({
            next: () => {
                this.cookieService.delete('loginInfo')
                this.isLoggedIn = false
                this.user = undefined
                this.router.navigate(['login'])
            },
            error: (err) => console.error(err)
        })
    }

    public checkCookie(): void {
        var loginInfo = this.cookieService.get('loginInfo')
        if (loginInfo !== '') {
            var user = JSON.parse(loginInfo)
            this.isLoggedIn = true
            this.user = user
            this.router.navigate(['main'])
        }
    }

    public setCookie(): void {
        var now = new Date()
        now.setHours(now.getHours() + 1) // cookie expires in 1hour
        this.cookieService.set('loginInfo', JSON.stringify(this.user), now)
        this.router.navigate(['main'])
    }

    private apiLogout(userId: number, connectionId: string): Observable<any> {
        return this.http.post(this.apiUrl + "logout?userId=" + userId + "&connectionId=" + connectionId, {});
    }
}