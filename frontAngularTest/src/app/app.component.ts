import { AuthentificationService } from './services/authentification.service';
import { User } from './models/user';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  UserObj :User;

  constructor(
    private router: Router,
    private authservice: AuthentificationService
) {
    this.authservice.UserObj.subscribe(userFromApi => this.UserObj = userFromApi);
}

get isAdmin() {
    return this.UserObj && this.UserObj.isAdmin ;
}

logout() {
    this.authservice.logout();
    this.router.navigate(['/login']);
}
}
