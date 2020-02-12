import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Album, AlbumSparse} from '../app/models/Album';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private baseUrl = environment.apiUrl;
  private resetAlbum = new BehaviorSubject<boolean>(false);
  public resetAlbumEvent$ = this.resetAlbum.asObservable();

  constructor(
      private http: HttpClient
  ) { }

  getAllAlbumsSparse(): Observable<AlbumSparse[]> {
    return this.http.get<AlbumSparse[]>(this.baseUrl + 'album/getallsparse');
  }

  getAllAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(this.baseUrl + 'album/getall');
  }

  createNewAlbum(name: string, isPublic: boolean): Observable<any> {
    return this.http.post(this.baseUrl + 'album', {name, isPublic});
  }

  getPrivateAlbum(albumId: string): Observable<Album> {
    return this.http.get<Album>(this.baseUrl + 'album/' + albumId);
  }

  resetAlbums(): void {
    this.resetAlbum.next(true);
  }
}
