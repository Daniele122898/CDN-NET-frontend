import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {UploadFileResponse} from '../../models/UploadFileInfo';
import {PaginatedResult} from '../../models/Pagination';
import {map} from 'rxjs/operators';

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

  public getAllFilesPaginated(page?: number, itemsPerPage?: number): Observable<PaginatedResult<UploadFileResponse[]>> {
    const paginatedResult: PaginatedResult<UploadFileResponse[]> = new PaginatedResult<UploadFileResponse[]>();

    let params = new HttpParams();

    if (page != null) {
      params = params.append('pageNumber', page.toString());
    }
    if (itemsPerPage != null) {
      params = params.append('pageSize', itemsPerPage.toString());
    }

    return this.http.get<UploadFileResponse[]>(this.baseUrl + 'file/getall', {
      observe: 'response',
      params
    }).pipe(
        map(resp => {
          paginatedResult.result = resp.body;
          if (resp.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(resp.headers.get('Pagination'));
          }
          return paginatedResult;
        })
    );
  }

  public removeFile(publicId: string) {
    return this.http.delete(this.baseUrl + 'file/' + publicId);
  }
}
