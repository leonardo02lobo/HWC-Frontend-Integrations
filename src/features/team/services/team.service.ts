import { api, type ApiResponse } from "../../../lib/api";
import { getAuthHeaders } from "../../auth/services/auth.service";

export interface TeamApiData {
    id: string;
    name: string;
    description: string;
    repository_link: string | null;
    status: string;
    member_count?: number;
}

export interface TeamDisplayData {
    id: number;
    name: string;
    cloud_repo_link: string | null;
    status: number;
    feedback: string | null;
    evaluation_file_url: string | null;
}

export interface UserTeamItem {
    team: TeamDisplayData;
    leader: null;
    members_count: number;
}

export interface InvitationApiData {
    id: string;
    team_id: string;
    team_name?: string;
    invited_by?: string;
    role?: string;
    created_at?: string;
    status?: string;
}

export async function getTeams(): Promise<TeamApiData[]> {
    const res = await api.get<ApiResponse<TeamApiData[]>>("/teams", getAuthHeaders());
    if (!res.success || !res.data) throw new Error(res.error ?? "No se pudo obtener los equipos");
    return res.data;
}

export async function getUserTeam(): Promise<UserTeamItem[]> {
    const res = await api.get<ApiResponse<{ message: string; teams: UserTeamItem[] }>>("/teams/me", getAuthHeaders());
    if (!res.success || !res.data) throw new Error(res.error ?? "No se pudo obtener tu equipo");
    return res.data.teams;
}

export async function createTeam(payload: { name: string; description?: string | null; repository?: string | null }) {
    const res = await api.post<ApiResponse<TeamApiData>>("/teams", payload, getAuthHeaders());
    if (!res.success || !res.data) throw new Error(res.error ?? "No se pudo crear el equipo");
    return res.data;
}

export async function getTeamDetail(teamId: string) {
    const res = await api.get<ApiResponse<TeamApiData>>(`/teams/me/${teamId}`, getAuthHeaders());
    if (!res.success || !res.data) throw new Error(res.error ?? "No se pudo obtener el equipo");
    return res.data;
}

export async function updateRepositoryLink(payload: { team_id: string; repository_link: string }) {
    const res = await api.patch<ApiResponse<unknown>>("/teams/me/repository-link", payload, getAuthHeaders());
    if (!res.success) throw new Error(res.error ?? "No se pudo actualizar el repositorio");
    return res.data;
}

export async function sendInvitations(payload: { team_id: string; email: string }) {
    const res = await api.post<ApiResponse<unknown>>("/teams/invitations", payload, getAuthHeaders());
    if (!res.success) throw new Error(res.error ?? "No se pudo enviar la invitación");
    return res.data;
}

export async function getMyInvitations(): Promise<InvitationApiData[]> {
    const res = await api.get<ApiResponse<InvitationApiData[]>>("/teams/invitations/me", getAuthHeaders());
    if (!res.success || !res.data) throw new Error(res.error ?? "No se pudo obtener las invitaciones");
    return res.data;
}

export async function acceptInvitation(invitationId: string) {
    const res = await api.post<ApiResponse<unknown>>(`/teams/invitations/${invitationId}/accept`, {}, getAuthHeaders());
    if (!res.success) throw new Error(res.error ?? "No se pudo aceptar la invitación");
    return res.data;
}

export async function rejectInvitation(invitationId: string) {
    const res = await api.delete<ApiResponse<unknown>>(`/teams/invitations/${invitationId}`, getAuthHeaders());
    if (!res.success) throw new Error(res.error ?? "No se pudo rechazar la invitación");
    return res.data;
}

export async function deleteTeam(teamId: string) {
    const res = await api.delete<ApiResponse<unknown>>(`/teams/${teamId}`, getAuthHeaders());
    if (!res.success) throw new Error(res.error ?? "No se pudo eliminar el equipo");
    return res.data;
}
