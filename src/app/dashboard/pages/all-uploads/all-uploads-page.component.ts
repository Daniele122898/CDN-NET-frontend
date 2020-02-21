import {ChangeDetectorRef, Component, HostBinding, OnInit} from '@angular/core';
import {AlertService} from '../../../../services/alert.service';
import {UploadFileResponse} from '../../../models/UploadFileInfo';
import {FileService} from '../../services/file.service';

@Component({
  selector: 'app-all-uploads',
  templateUrl: './all-uploads-page.component.html',
  styleUrls: ['./all-uploads-page.component.scss'],
})
export class AllUploadsPageComponent implements OnInit {

  public files: UploadFileResponse[][] = [];
  public error: string = null;

  private filesBeforeStacking: UploadFileResponse[] = [];

  constructor(
      private alert: AlertService,
      private fileService: FileService
  ) { }

  ngOnInit() {
    this.fileService.getAllFiles().subscribe((resp: any) => {
      this.filesBeforeStacking = resp;
      this.setupSeparatedFilesArray(resp);
    }, (err) => {
      console.log(err);
      this.error = err.error;
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

  removeFile(publicId: string) {
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
}
