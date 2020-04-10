import {ChangeDetectorRef, Component, HostBinding, OnInit} from '@angular/core';
import {AlertService} from '../../../../services/alert.service';
import {UploadFileResponse} from '../../../models/UploadFileInfo';
import {FileService} from '../../services/file.service';
import {PaginatedResult} from '../../../models/Pagination';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-all-uploads',
  templateUrl: './all-uploads-page.component.html',
  styleUrls: ['./all-uploads-page.component.scss'],
})
export class AllUploadsPageComponent implements OnInit {

  public files: UploadFileResponse[][] = [];
  public error: string = null;

  public pageNumber = 1;
  public pageSize = 15;
  public totalNumberOfFiles = 0;

  private filesBeforeStacking: UploadFileResponse[] = [];

  constructor(
      private alert: AlertService,
      private fileService: FileService
  ) { }

  ngOnInit() {
    this.getNewPageResults();
  }

  public pageChangedEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageNumber = e.pageIndex + 1;
    this.getNewPageResults();
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

  private getNewPageResults() {
    this.fileService.getAllFilesPaginated(this.pageNumber, this.pageSize).subscribe((resp: PaginatedResult<UploadFileResponse[]>) => {
      this.filesBeforeStacking = resp.result;
      this.totalNumberOfFiles = resp.pagination.totalItems;
      this.setupSeparatedFilesArray(resp.result);
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
}
