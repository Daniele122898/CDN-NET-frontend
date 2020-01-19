import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private isLoggedIn = false;

  private destroy$ = new Subject();

  constructor(
      private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.loggedIn();

    this.authService.AuthObs.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isLoggedIn = this.authService.loggedIn();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

}
