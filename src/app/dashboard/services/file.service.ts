import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {UploadFileResponse} from '../../models/UploadFileInfo';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private baseUrl = environment.apiUrl;

  constructor(
      private http: HttpClient
  ) { }

  public getAllFiles(): Observable<UploadFileResponse[]> {
    return this.http.get<UploadFileResponse[]>(this.baseUrl + 'file/getall');
  }

  public removeFile(publicId: string) {
    return this.http.delete(this.baseUrl + 'file/' + publicId);
  }
}
