import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  constructor(private http: HttpClient) {}

  currentUser() {
    return this.http.get<any>(`${environment.apiUrl}/api/auth`).pipe(
      map((resonse) => {
        return resonse.result;
      })
    );
  }

  listusers() {
    return this.http.get<any>(`${environment.apiUrl}/api/user/list`).pipe(
      map((resonse) => {
        return resonse.result;
      })
    );
  }
}
