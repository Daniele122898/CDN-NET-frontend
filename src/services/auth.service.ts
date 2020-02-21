import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {map} from 'rxjs/operators';
import {LoginResponse} from '../app/models/LoginResponse';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authSubj = new BehaviorSubject<void>(null);
  public AuthObs = this.authSubj.asObservable();

  private baseUrl = environment.apiUrl + 'auth/';
  private jwtHelper = new JwtHelperService();
  private decodedToken: any;

  constructor(
      private http: HttpClient
  ) { }

  public loggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  public register(username: string, password: string) {
    return this.http.post(this.baseUrl + 'register', {username, password});
  }

  public login(username: string, password: string) {
    return this.http.post(this.baseUrl + 'login', {username, password})
        .pipe(
            map((resp: any) => {
              const loginResp: LoginResponse = resp;
              if (loginResp) {
                localStorage.setItem('token', loginResp.token);
                localStorage.setItem('user', JSON.stringify(loginResp.user));
                this.decodedToken = this.jwtHelper.decodeToken(loginResp.token);
                this.authSubj.next(null);
              }
            })
        );
  }

  public logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.decodedToken = null;
    this.authSubj.next(null);
  }

  public getUsername(): string {
    return this.decodedToken.unique_name;
  }
}
