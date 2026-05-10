// src/features/auth/services/auth.service.ts

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

export interface AuthResponse<T> {
    success: boolean;
    status_code: string;
    error: string | null;
    data: T | null;
}

type LoginResponse = AuthResponse<unknown> | Record<string, unknown> | null;

const API_URL =
    import.meta.env.PUBLIC_API_BASE_URL ??
    import.meta.env.PUBLIC_API_URL ??
    "http://localhost:8000";

const AUTH_TOKEN_KEY = "auth:token";

const parseResponse = async (response: Response, fallbackMessage: string) => {
    const body = response.status === 204 ? null : await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(body?.message ?? body?.detail ?? body?.error ?? fallbackMessage);
    }

    return body;
};

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

export const saveAuthSession = (response: LoginResponse) => {
    localStorage.setItem("auth:user", JSON.stringify(response));

    const token = findToken(response);
    if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
};

const getAuthHeaders = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    return {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export async function registerUser(payload: RegisterPayload) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return parseResponse(response, "No se pudo registrar el usuario");
}

export async function loginUser(payload: LoginPayload) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    return parseResponse(response, "No se pudo iniciar sesión");
}

export async function getCurrentUser() {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
    });

    const body = await parseResponse(response, "No se pudo obtener el perfil") as AuthResponse<AuthUser>;

    if (!body.success || !body.data) {
        throw new Error(body.error ?? "No se pudo obtener el perfil");
    }

    return body.data;
}
