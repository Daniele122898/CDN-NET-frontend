import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subject} from 'rxjs';
import { AlbumSparse} from '../../../models/Album';
import {AlbumService} from '../../../../services/album.service';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.scss']
})
export class DashboardSidebarComponent implements OnInit, OnDestroy {

  private albums: AlbumSparse[];

  private destroy$ = new Subject();

  constructor(
      private albumService: AlbumService,
      private router: Router
  ) { }

  ngOnInit() {
    this.getAllAlbums();
    this.albumService.resetAlbumEvent$.pipe(takeUntil(this.destroy$))
        .subscribe((val) => {
          if (val) {
            this.getAllAlbums();
          }
        });
  }

  private getAllAlbums(): void {
    this.albumService.getAllAlbumsSparse().subscribe((albums) => {
      this.albums = albums;
    });
  }

  selectAlbum(album: AlbumSparse) {
    this.router.navigate(['/dashboard', 'album', album.id.toString()]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
