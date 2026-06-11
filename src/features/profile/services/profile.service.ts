import { api, type ApiResponse } from "../../../lib/api";
import { getAuthHeaders, getCurrentUser, type AuthUser } from "../../auth/services/auth.service";

export async function getProfile(): Promise<AuthUser> {
    return getCurrentUser();
}

export async function updateProfile(payload: {
    name: string;
    username?: string | null;
    email: string;
    programming_language?: string | null;
    github_profile?: string | null;
}): Promise<AuthUser> {
    const res = await api.patch<ApiResponse<AuthUser>>("/auth/me", payload, getAuthHeaders());
    if (!res.success || !res.data) throw new Error(res.error ?? "No se pudo actualizar el perfil");
    return res.data;
}
