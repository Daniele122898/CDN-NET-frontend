import {UploadFileResponse} from './UploadFileInfo';

export interface AlbumSparse {
    id: number;
    isPublic: boolean;
    name: string;
    dateAdded: string;
    ownerId: number;
}

export interface Album extends AlbumSparse {
    files: UploadFileResponse[];
}
