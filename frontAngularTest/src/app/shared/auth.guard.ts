import { AuthentificationService } from './../services/authentification.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';



@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthentificationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const UserObj = this.authService.UserObjValue;
        if (UserObj) {
            // check if route is restricted for normal users
            if (route.data && route.data.isAdmin) {
                this.router.navigate(['/']);
                return false;
            }
            // authorised so return true
            return true;
        }

        // not logged in
        this.router.navigate(['/login']);
        return false;
    }
}
