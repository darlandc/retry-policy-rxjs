import { Injectable } from '@angular/core';

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GitHubService {
  baseURL = 'https://api.github.com/';

  constructor(private http: HttpClient) {}

  getRepos(userName: string): Observable<any> {
    return this.http.get(this.baseURL + 'usersY/' + userName + '/repos');
  }

  getReposCatchError(userName: string): Observable<any> {
    return this.http.get(this.baseURL + 'usersY/' + userName + '/repos').pipe(
      catchError(err => {
        console.log('error caught in service');
        console.error(err);
        return throwError(err);
      })
    );
  }
}
