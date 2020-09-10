import { Pipe, PipeTransform } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Pipe({
  name: 'authImage'
})
export class AuthImagePipePipe implements PipeTransform {

  constructor(
      private http: HttpClient
  ) {
  }

  async transform(src: string): Promise<string> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    const imageBlob = await this.http.get(src, {headers, responseType: 'blob'}).toPromise();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(imageBlob);
    });
  }

}
