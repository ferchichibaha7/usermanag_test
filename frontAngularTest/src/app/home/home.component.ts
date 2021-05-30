import { UserServiceService } from './../services/user-service.service';
import { AuthentificationService } from './../services/authentification.service';
import { Component, OnInit } from '@angular/core';
import { User } from '@app/models/user';
import { first, take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading = false;
  currentUser: User;
  userFromApi: User;
  constructor(
    private userService: UserServiceService,
    private authService: AuthentificationService)
    {
      this.currentUser = this.authService.UserObjValue;
    }

  ngOnInit(): void {
    this.loading = true;
    this.userService.currentUser().pipe(first()).subscribe(user => {
        this.loading = false;
        this.userFromApi = user;
    });
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.isAdmin ;
}

}
