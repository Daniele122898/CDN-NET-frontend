import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../../../services/alert.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as dropzone from 'dropzone';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, OnDestroy {

  private uploadForm: FormGroup;
  private dropzone: any;
  private draggingOver = false;

  constructor(
      private fb: FormBuilder,
      private alert: AlertService,
      private changeDetection: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.createForm();
    const dropzoneConfig = {
      url: '/#',
      createImageThumbnails: false,
      previewTemplate: ''
    };
    this.dropzone = new dropzone('div#dropzone', dropzoneConfig);
    this.dropzone.on('dragover', this.dragover.bind(this));
    this.dropzone.on('dragleave', this.dragleave.bind(this));
    this.dropzone.on('dragend', this.dragend.bind(this));
    this.dropzone.on('drop', this.drop.bind(this));
  }


  private createForm() {
    this.uploadForm = this.fb.group({
      filename: [''],
      albumId: [null]
    });
  }

  private upload() {
    if (!this.uploadForm.valid) {
      return;
    }
    console.log('upload');
  }

  private hasGeneralError(formName: string): boolean {
    return this.uploadForm.get(formName).errors && this.uploadForm.get(formName).touched;
  }

  private dragleave() {
    this.draggingOver = false;
    this.changeDetection.detectChanges();
  }

  private dragend() {
    this.draggingOver = false;
    this.changeDetection.detectChanges();
  }

  private drop() {
    this.draggingOver = false;
    this.changeDetection.detectChanges();
  }

  private dragover() {
    this.draggingOver = true;
    this.changeDetection.detectChanges();
  }

  ngOnDestroy(): void {
    this.dropzone.removeEventListener('dragover', this.dragover);
    this.dropzone.removeEventListener('dragleave', this.dragleave);
    this.dropzone.removeEventListener('dragend', this.dragend);
    this.dropzone.removeEventListener('drop', this.drop);
  }
}
