import { take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { User } from '@app/models/user';
import { AuthentificationService } from '@app/services/authentification.service';
import { UserServiceService } from '@app/services/user-service.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {
  loading = false;
  usersFromApi: User[];
  UserObj :User;

  constructor(
    private userService: UserServiceService,
    private authservice: AuthentificationService

     ) { this.authservice.UserObj.subscribe(userFromApi => this.UserObj = userFromApi); }

  ngOnInit(): void {
    this.loading = true;
    this.userService.listusers().pipe(take(1)).subscribe(users => {
        this.loading = false;
        this.usersFromApi = users.reverse();;
    });
  }

  get isAdmin() {
    return this.UserObj && this.UserObj.isAdmin ;
}

}
