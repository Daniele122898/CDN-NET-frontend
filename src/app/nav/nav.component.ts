import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  private loggedIn = false;

  constructor(
      private authService: AuthService,
      private router: Router
  ) { }

  ngOnInit() {
    this.loggedIn = this.authService.loggedIn();

    this.authService.AuthObs.subscribe(() => {
      this.loggedIn = this.authService.loggedIn();
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
