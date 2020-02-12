import {Routes} from '@angular/router';
import {DashboardComponent} from '../dashboard.component';
import {AuthGuard} from '../../../guards/auth.guard';
import {AllUploadsPageComponent} from '../pages/all-uploads/all-uploads-page.component';
import {CreateAlbumPageComponent} from '../pages/create-album-page/create-album-page.component';
import {AlbumDisplayPageComponent} from '../pages/album-display-page/album-display-page.component';

export let dashboardRoutes: Routes = [
    {
        path: 'dashboard',
        canActivate: [AuthGuard],
        component: DashboardComponent,
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: 'allFiles',
                component: AllUploadsPageComponent,
            },
            {
                path: 'createAlbum',
                component: CreateAlbumPageComponent
            },
            {
                path: 'album/:id',
                component: AlbumDisplayPageComponent
            }
        ]
    }
];
