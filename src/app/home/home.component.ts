import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private isLoggedIn = false;

  constructor(
      private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.loggedIn();
  }

}
