import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {dashboardRoutes} from './dashboard/routes/dashboard.routes';

export const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    ...dashboardRoutes,
    {
        path: '**',
        component: HomeComponent
    }
];
