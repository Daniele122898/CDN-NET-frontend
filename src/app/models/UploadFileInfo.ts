export interface UploadFileInfo {
    name?: string;
    isPublic: boolean;
}

export interface UploadFileResponse {
    id: number;
    publicId: string;
    isPublic: boolean;
    fileExtension: string;
    contentType: string;
    name: string;
    dateAdded: string;
    ownerId: number;
    albumId?: number;
    url: string;
}
