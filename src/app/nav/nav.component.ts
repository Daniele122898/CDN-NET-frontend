import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {


  private loggedIn = false;

  private destroy$ = new Subject();

  constructor(
      private authService: AuthService,
      private router: Router
  ) { }

  ngOnInit() {
    this.loggedIn = this.authService.loggedIn();

    this.authService.AuthObs.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loggedIn = this.authService.loggedIn();
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
