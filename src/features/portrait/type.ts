export interface PortraitResponse {
    url: string;
    expires_in: number;
    message: string;
}

export interface PortraitDeleteResponse {
    path: string;
    message: string;
}

export interface UploadPortraitResponse {
    url: string;
    path: string;
    expires_in: number;
    message: string;
}