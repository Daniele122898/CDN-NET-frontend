import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {UploadFileInfo} from '../app/models/UploadFileInfo';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private baseUrl = environment.apiUrl;

  constructor(
      private http: HttpClient
  ) { }

  public uploadFiles(files: File[], info?: UploadFileInfo[], albumId?: number) {
    const fd = new FormData();
    if (info && info.length > 0) {
      if (info.length !== files.length) {
        return throwError('Info and file list mismatch');
      }
      fd.append('Infos', JSON.stringify(info));
    }
    if (albumId) {
      fd.append('AlbumId', '' + albumId);
    }
    files.forEach((file) => {
      fd.append('Files', file, file.name);
    });
    return this.http.post(this.baseUrl  + 'upload/multi', fd, { reportProgress: true, observe: 'events'});
  }
}
