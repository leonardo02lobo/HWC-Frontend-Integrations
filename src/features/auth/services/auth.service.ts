import { api, type ApiResponse } from "../../../lib/api";

export interface RegisterPayload {
    name: string;
    email: string;
    programming_language: string;
    github_profile: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthUser {
    id: number;
    username: string;
    role_id: number;
    name: string;
    email: string;
    programming_language: string;
    github_profile: string;
    portrait: string | null;
    status: number;
    category_id: number | null;
}

const AUTH_TOKEN_KEY = "auth:token";
const AUTH_USER_KEY = "auth:user";

const findToken = (value: unknown): string | null => {
    if (!value || typeof value !== "object") return null;

    const record = value as Record<string, unknown>;
    const directToken =
        record.access_token ??
        record.token ??
        record.jwt ??
        record.accessToken;

    if (typeof directToken === "string" && directToken.trim()) {
        return directToken;
    }

    return findToken(record.data);
};

export const saveAuthSession = (response: ApiResponse<unknown> | Record<string, unknown> | null) => {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response));

    const token = findToken(response);
    if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
};

export const clearAuthSession = () => {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const getAuthHeaders = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    return {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export async function registerUser(payload: RegisterPayload) {
    const response = await api.post<ApiResponse<unknown>>("/auth/register", payload);
    if (!response.success) {
        throw new Error(response.error ?? "No se pudo registrar el usuario");
    }
    return response;
}

export async function loginUser(payload: LoginPayload) {
    const response = await api.post<ApiResponse<unknown>>("/auth/login", payload);
    if (!response.success) {
        throw new Error(response.error ?? "No se pudo iniciar sesión");
    }
    return response;
}

export async function getCurrentUser(): Promise<AuthUser> {
    const response = await api.get<ApiResponse<AuthUser>>("/auth/me", getAuthHeaders());
    if (!response.success || !response.data) {
        throw new Error(response.error ?? "No se pudo obtener el perfil");
    }
    return response.data;
}

export async function signOutUser() {
    const response = await api.post<ApiResponse<unknown>>("/auth/signout", {}, getAuthHeaders());
    if (!response.success) {
        throw new Error(response.error ?? "No se pudo cerrar sesión");
    }
    return response;
}
