import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {UploadFileResponse} from '../../../models/UploadFileInfo';

@Component({
  selector: 'app-file-grid',
  templateUrl: './file-grid.component.html',
  styleUrls: ['./file-grid.component.scss']
})
export class FileGridComponent implements OnInit {

  @Input() files: UploadFileResponse[][] = [];
  @Output() removeFileEvent = new EventEmitter<string>();

  private faTrash = faTrash;

  constructor() { }

  ngOnInit() {
  }

  removeFile(publicId: string) {
    this.removeFileEvent.emit(publicId);
  }
}
