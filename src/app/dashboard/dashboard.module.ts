import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {AllUploadsPageComponent} from './pages/all-uploads/all-uploads-page.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {HttpClientModule} from '@angular/common/http';
import { CreateAlbumPageComponent } from './pages/create-album-page/create-album-page.component';
import {ReactiveFormsModule} from '@angular/forms';
import { AlbumDisplayPageComponent } from './pages/album-display-page/album-display-page.component';
import { FileGridComponent } from './components/file-grid/file-grid.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { AuthImagePipePipe } from './pipes/auth-image-pipe.pipe';
import { DownloadAuthFileDirective } from './directives/download-auth-file.directive';



@NgModule({
  declarations: [
    DashboardComponent,
    DashboardSidebarComponent,
    AllUploadsPageComponent,
    CreateAlbumPageComponent,
    AlbumDisplayPageComponent,
    FileGridComponent,
    AuthImagePipePipe,
    DownloadAuthFileDirective
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ]
})
export class DashboardModule { }
