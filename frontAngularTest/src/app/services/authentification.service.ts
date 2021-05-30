import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private UserObjSubject: BehaviorSubject<User>;
  public UserObj: Observable<User>;
  constructor(private http: HttpClient) {
    this.UserObjSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('UserObj')));
    this.UserObj = this.UserObjSubject.asObservable();
  }

  public get UserObjValue(): User {
    return this.UserObjSubject.value;
}

login(emailOrUsername: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/api/auth`, { emailOrUsername, password })
        .pipe(map(user => {
            if (user && user.token) {
                // store user details and jwt token in local storage
                localStorage.setItem('UserObj', JSON.stringify(user));
                this.UserObjSubject.next(user);
            }

            return user;
        }));
}
}
