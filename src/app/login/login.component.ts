import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router,
      private alert: AlertService
  ) { }

  private static formatError(err: any): string {
    if (err.status === 401) {
      return 'Username or password incorrect';
    }
    return err.statusText;
  }

  public ngOnInit() {
    this.createRegisterForm();
  }

  public hasGeneralError(formName: string): boolean {
    return this.loginForm.get(formName).errors && this.loginForm.get(formName).touched;
  }

  public login() {
    if (!this.loginForm.valid) {
      return;
    }
    const {username, password} = this.loginForm.value;

    this.authService.login(username, password)
        .subscribe(() => {
          this.alert.success('Successfully logged in');
          this.router.navigate(['/']);
        }, (err) => {
          this.alert.error('Failed to login: ' + LoginComponent.formatError(err));
        });
  }

  private createRegisterForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    });
  }
}
