import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  public confirm(message: string, okCallback: () => any, notOkCallback?: () => any) {
    alertify.confirm(message, (e: any) => {
      if (e) {
        okCallback();
      } else if (notOkCallback) {
        notOkCallback();
      }
    });
  }

  public success(message: string) {
    alertify.success(message);
  }

  public error(message: string) {
    alertify.error(message);
  }

  public warning(message: string) {
    alertify.warning(message);
  }

  public message(message: string) {
    alertify.message(message);
  }
}
