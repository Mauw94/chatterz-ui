import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { LoginService } from "src/services/login.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private loginService: LoginService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        console.log(this.loginService.isLoggedIn)
        if (!this.loginService.isLoggedIn) {
            return this.router.navigate[('/login')]
        }

        return this.loginService.isLoggedIn;
    }
}