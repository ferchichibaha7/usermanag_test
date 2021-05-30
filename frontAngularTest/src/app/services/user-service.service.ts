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

  create(params){
    return this.http.post<any>(`${environment.apiUrl}/api/user/create`,params).pipe(
      map((resonse) => {
        return resonse.message;
      })
    );
  }

  update(id,params){
    return this.http.put<any>(`${environment.apiUrl}/api/user/${id}`,params).pipe(
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

  getById(id: string) {
    return this.http.get<any>(`${environment.apiUrl}/api/user/${id}`).pipe(
      map((resonse) => {
        return resonse.result;
      })
    );
}

  deleteuser(id:number) {
    return this.http.delete<any>(`${environment.apiUrl}/api/user/delete/${id}`).pipe(
      map((resonse) => {
        return resonse.message;
      })
    );
  }
}
