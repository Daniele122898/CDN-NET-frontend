import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {faCheckSquare} from '@fortawesome/free-solid-svg-icons';
import {faCheckSquare as farCheckSquare} from '@fortawesome/free-regular-svg-icons';
import {AlertService} from '../../../../services/alert.service';
import {AlbumService} from '../../../../services/album.service';

@Component({
  selector: 'app-create-album-page',
  templateUrl: './create-album-page.component.html',
  styleUrls: ['./create-album-page.component.scss'],
})
export class CreateAlbumPageComponent implements OnInit {

  private faCheckSquare = faCheckSquare;
  private farCheckSquare = farCheckSquare;

  private albumForm: FormGroup;
  private error: string;

  constructor(
      private fb: FormBuilder,
      private alert: AlertService,
      private albumService: AlbumService
  ) { }

  ngOnInit() {
    this.createFrom();
  }

  private createFrom(): void {
    this.albumForm = this.fb.group({
      name: ['', Validators.required],
      isPublic: [true]
    });
  }

  private createAlbum() {
    if (!this.albumForm.valid) {
      return;
    }

    this.albumService.createNewAlbum(this.albumForm.get('name').value, this.albumForm.get('isPublic').value)
        .subscribe(() => {
          this.albumForm.reset({isPublic: true});
          this.error = null;
          this.alert.success('Successfully created Album');
          this.albumService.resetAlbums();
        }, (err) => {
          this.error = err.error;
        });

  }

  private toggleIsPublic() {
    this.albumForm.get('isPublic').setValue(!this.albumForm.get('isPublic').value);
  }
}
