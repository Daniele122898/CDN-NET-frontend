import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private loginForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router
  ) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  private createRegisterForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    });
  }


  private login() {
    if (!this.loginForm.valid) {
      return;
    }
    const {username, password} = this.loginForm.value;

    this.authService.login(username, password)
        .subscribe(() => {
          console.log('Successfully logged in');
          this.router.navigate(['/']);
        }, (err) => {
          console.log('Error', err);
        });
  }

  private hasGeneralError(formName: string): boolean {
    return this.loginForm.get(formName).errors && this.loginForm.get(formName).touched;
  }

}
