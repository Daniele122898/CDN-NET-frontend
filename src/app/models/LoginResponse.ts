export interface LoginResponse {
    token: string;
    user: {
        id: number;
        username: string;
    };
}
