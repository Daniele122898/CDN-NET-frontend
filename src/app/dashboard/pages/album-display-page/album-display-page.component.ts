import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlbumService} from '../../../../services/album.service';
import {AlertService} from '../../../../services/alert.service';
import {UploadFileResponse} from '../../../models/UploadFileInfo';
import {Album} from '../../../models/Album';
import {FileService} from '../../services/file.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-album-display-page',
  templateUrl: './album-display-page.component.html',
  styleUrls: ['./album-display-page.component.scss']
})
export class AlbumDisplayPageComponent implements OnInit, OnDestroy {

  public files: UploadFileResponse[][] = [];
  public error: string = null;

  private album: Album;
  private filesBeforeStacking: UploadFileResponse[] = [];

  private destroy$ = new Subject();

  constructor(
      private activatedRoute: ActivatedRoute,
      private albumService: AlbumService,
      private alert: AlertService,
      private fileService: FileService,
      private router: Router
  ) { }

  public ngOnInit() {
    this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.id;
      if (!id) {
        // TODO Change to 404
        this.alert.error('Error getting album');
        return;
      }

      this.albumService.getPrivateAlbum(id).subscribe((album) => {
        this.album = album;
        this.filesBeforeStacking = album.files;
        this.setupSeparatedFilesArray(album.files);
      }, (err) => {
        this.alert.error('Error getting album: ' + err.error);
      });
    });
  }

  public removeAlbum() {
    this.alert.confirm('Are you sure you want to remove this album?', () => {
        this.removeAlbumWebCall(false);
    });
  }

  public removeAlbumWithFiles() {
    this.alert.confirm('Are you sure you want to remove this album and all its files?', () => {
      this.removeAlbumWebCall(true);
    });
  }

  private removeAlbumWebCall(removeFiles: boolean) {
    this.albumService.removeAlbum(this.album.id, removeFiles).subscribe(() => {
      this.albumService.resetAlbums();
      this.alert.success('Removed album');
      this.router.navigate(['/dashboard', 'allFiles']);
    }, (err) => {
      console.log(err);
      this.alert.error('Failed to remove album: ' + err.error);
    });
  }

  public removeFile(publicId: string) {
    this.alert.confirm('Are you sure you want to delete this file?', () => {
      this.fileService.removeFile(publicId).subscribe(() => {
        this.filesBeforeStacking = this.filesBeforeStacking.filter((f) => f.publicId !== publicId);
        this.setupSeparatedFilesArray(this.filesBeforeStacking);
      }, (err) => {
        console.log(err);
        this.alert.error('Failed to remove file: ' + err.error);
      });
    });
  }

  private setupSeparatedFilesArray(files: UploadFileResponse[]) {
    this.files = [];
    for (let i = 0; i < files.length;) {
      const filesToAdd: UploadFileResponse[] = [];
      filesToAdd.push(files[i]);
      i++;
      if (files.length > i) {
        filesToAdd.push(files[i]);
      } else {
        filesToAdd.push(null);
        filesToAdd.push(null);
        this.files.push(filesToAdd);
        break;
      }
      i++;
      if (files.length > i) {
        filesToAdd.push(files[i]);
      } else {
        filesToAdd.push(null);
        this.files.push(filesToAdd);
        break;
      }
      i++;
      this.files.push(filesToAdd);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
