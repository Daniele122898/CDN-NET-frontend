import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private registerForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router
  ) { }

  private static passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : { mismatch: true };
  }

  ngOnInit() {
    this.createRegisterForm();
  }

  private createRegisterForm() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: RegisterComponent.passwordMatchValidator
    });
  }


  private register() {
    if (!this.registerForm.valid) {
      return;
    }
    const val = this.registerForm.value;
    this.authService.register(val.username, val.password)
        .subscribe(() => {
          console.log('Successfully registered');
        }, err => {
          console.log('Error', err);
        }, () => {
          this.authService.login(val.username, val.password)
              .subscribe(() => {
                this.router.navigate(['/']);
              });
        });
  }

  private hasGeneralError(formName: string): boolean {
    return this.registerForm.get(formName).errors && this.registerForm.get(formName).touched;
  }
}
