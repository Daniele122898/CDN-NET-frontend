import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../../../services/alert.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DropzoneOptions} from 'dropzone';
import * as Dropzone from 'dropzone';
import {FileService} from '../../../services/file.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {faCheckSquare} from '@fortawesome/free-solid-svg-icons';
import {faCheckSquare as farCheckSquare} from '@fortawesome/free-regular-svg-icons';
import {UploadFileInfo, UploadFileResponse} from '../../models/UploadFileInfo';

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
  private faCheckSquare = faCheckSquare;
  private farCheckSquare = farCheckSquare;
  private error: string = null;
  private success = false;
  private defaultImagePreview = 'https://i.imgur.com/PTRCNrQ.png';

  private uploading = false;
  private progress = 0;
  private fileResponses: UploadFileResponse[] = null;

  constructor(
      private fb: FormBuilder,
      private alert: AlertService,
      private changeDetection: ChangeDetectorRef,
      private uploadService: FileService
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
    this.dropzone.on('removedfile', this.removedFile.bind(this));
  }

  private createForm() {
    this.uploadForm = this.fb.group({
      filename: [''],
      albumId: [null],
      isPublic: [true]
    }, {
      validators: this.formValidator.bind(this)
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

    const split = filenames.split(';');

    if (split.length === this.files.length + 1) {
      return null;
    }

    // See if maybe only the last one is missing
    if (split.length === this.files.length && split[split.length - 1].trim().length > 0) {
      return null;
    }

    return { filenameError: true };
  }

  private addedFile(event) {
    console.log('added file event:', event);
    if (!event.type.includes('image/')) {
      this.dropzone.emit('thumbnail', event, this.defaultImagePreview);
    }
    this.files.push(event);
  }

  private removedFile(event) {
    console.log('removed file event:', event);
    this.files = this.files.filter((file) => file.name !== event.name);
    this.uploadForm.updateValueAndValidity();
  }

  private upload() {
    if (!this.uploadForm.valid) {
      return;
    }
    // Generate info list
    let filenames: string = this.uploadForm.get('filename').value;
    let infos: UploadFileInfo[] | null = null;
    if (filenames && filenames.trim().length > 0) {
      filenames = filenames.trim();
      const split = filenames.split(';');
      for (let i = 0; i < split.length; i++) {
        split[i] = split[i].trim();
      }
      const filtered = split.filter((str) => str.length > 0);
      if (filtered.length !== this.files.length) {
        this.error = 'Please specify same amount of names as files in left to right order';
        return;
      }
      infos = [];
      const isPublic: boolean = this.uploadForm.get('isPublic').value;
      filtered.forEach((n) => {
        const info: UploadFileInfo = {
          name: n,
          isPublic
        };
        infos.push(info);
      });
    } else {
      infos = [];
      const isPublic: boolean = this.uploadForm.get('isPublic').value;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.files.length; i++) {
        const info: UploadFileInfo = {
          isPublic
        };
        infos.push(info);
      }
    }

    const albumId: number | null = this.uploadForm.get('albumId').value;

    this.success = false;

    this.uploadService.uploadFiles(this.files, infos, albumId).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          this.uploading = true;
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log('File successfully uploaded!', event.body);
          this.fileResponses = event.body;
          this.clearDropzoneAndClearForm();
          this.progress = 0;
          this.uploading = false;
          this.success = true;
      }
    }, (err => {
      console.log('upload error', err);
      this.error = err.error;
      this.uploading = false;
    }));
  }

  private toggleIsPublic() {
    this.uploadForm.get('isPublic').setValue(!this.uploadForm.get('isPublic').value);
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
    this.error = null;
    this.success = false;
    this.uploadForm.reset({isPublic: true});
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
      this.dropzone.emit('thumbnail', file, this.defaultImagePreview);
    } else {
      console.log('text:', event.clipboardData.getData('text'));
    }
  }
}
