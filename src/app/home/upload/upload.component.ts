import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../../../services/alert.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DropzoneOptions} from 'dropzone';
import * as Dropzone from 'dropzone';
import {UploadService} from '../../../services/upload.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';

const previewTemplate = '' +
    '  <div class="dz-details" style="' +
    'display: inline-block; vertical-align: top; width: 33%; margin-top: 0.8rem' +
    '">\n' +
    '    <img data-dz-thumbnail data-dz-remove />\n' +
    '    <div class="dz-filename" style="' +
    'font-size: 80%; width: 50%; overflow-wrap: break-word; margin: auto;\n' +
    '"><span data-dz-name></span></div>\n' +
    '    <div class="dz-size" data-dz-size style="font-size: 80% "></div>\n' +
    '  </div>\n' +
    '  <div class="dz-error-message"><span data-dz-errormessage></span></div>\n' +
    '</div>';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, OnDestroy {

  private uploadForm: FormGroup;
  private dropzone: Dropzone;
  private draggingOver = false;
  private files: File[] = [];
  private progress: number;

  constructor(
      private fb: FormBuilder,
      private alert: AlertService,
      private changeDetection: ChangeDetectorRef,
      private uploadService: UploadService
  ) {
  }

  ngOnInit() {
    this.createForm();
    const dropzoneConfig: DropzoneOptions = {
      url: '/#',
      createImageThumbnails: true,
      previewTemplate,
      autoProcessQueue: false
    };
    this.dropzone = new Dropzone('div#dropzone', dropzoneConfig);
    this.dropzone.on('dragover', this.dragover.bind(this));
    this.dropzone.on('dragleave', this.dragleave.bind(this));
    this.dropzone.on('dragend', this.dragend.bind(this));
    this.dropzone.on('drop', this.drop.bind(this));
    this.dropzone.on('addedfile', this.addedFile.bind(this));
  }

  private createForm() {
    this.uploadForm = this.fb.group({
      filename: [''],
      albumId: [null]
    }, {
      validators: this.formValidator
    });
  }

  private formValidator(g: FormGroup) {
    const filenames: string = g.get('filename').value;
    if (!filenames || filenames.length === 0) {
      return null;
    }

    if (!filenames.includes(';') && this.files.length === 1) {
      return null;
    }

    if (filenames.split(';').length === this.files.length) {
      return null;
    }

    return { filenameError: true };
  }

  private addedFile(event) {
    console.log('added file event:', event);
    this.files.push(event);
  }

  private upload() {
    if (!this.uploadForm.valid) {
      return;
    }
    console.log('upload');
    this.uploadService.uploadFiles(this.files).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log('User successfully created!', event.body);
          this.clearDropzoneAndClearForm();
          setTimeout(() => {
            this.progress = 0;
          }, 1500);
      }
    }, (err => {
      console.log('upload error', err);
    }));
  }

  private hasGeneralError(formName: string): boolean {
    return this.uploadForm.get(formName).errors && this.uploadForm.get(formName).touched;
  }

  private clearDropzoneAndClearForm() {
    this.files = this.files.filter((f) => {
      const foundFile = this.dropzone.files.find((df) => df.name === f.name);
      return !foundFile;
    });
    // Removes all files that have been added through dropzonejs
    this.dropzone.removeAllFiles();
    // Checks if we have to remove files that have been added through copy paste
    if (this.files.length > 0) {
      for (const file of this.files) {
        // @ts-ignore
        this.dropzone.removeFile(file);
      }
    }
    this.files = [];
    // reset form as well
    this.uploadForm.reset();
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
    this.dropzone.off('dragover', this.dragover);
    this.dropzone.off('dragleave', this.dragleave);
    this.dropzone.off('dragend', this.dragend);
    this.dropzone.off('drop', this.drop);
    this.dropzone.off('addedfile', this.addedFile);
  }

  @HostListener('window:paste', ['$event']) handlePaste(event: ClipboardEvent) {
    if (event.clipboardData.files.length > 0) {
      const file = event.clipboardData.files[0];
      // @ts-ignore
      file.status = 'queued';
      // @ts-ignore
      file.accepted = true;
      console.log('got file: ', file);
      this.dropzone.emit('addedfile', file);
      this.dropzone.emit('thumbnail', file, 'https://i.imgur.com/PTRCNrQ.png');
    } else {
      console.log('text:', event.clipboardData.getData('text'));
    }
  }
}
