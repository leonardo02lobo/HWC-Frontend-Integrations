import { api, type ApiResponse } from "../../lib/api";
import type { PortraitResponse, UploadPortraitResponse, PortraitDeleteResponse } from "./type";
import { getAuthHeaders } from "../auth/services/auth.service";

const TEST_USER_ID = "1";

export const getPortrait = async (userId: string = TEST_USER_ID): Promise<PortraitResponse> => {
    const response = await api.get<ApiResponse<PortraitResponse>>(`/bucket/portrait/${userId}`, getAuthHeaders());

    if (!response.success) {
        throw new Error(response.error || "Error al obtener el portrait");
    }

    if (!response.data) {
        throw new Error("No se pudo obtener el portrait");
    }

    return response.data;
};

export const uploadPortrait = async (file: File, userId: string = TEST_USER_ID): Promise<UploadPortraitResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);

    const response = await api.upload<ApiResponse<UploadPortraitResponse>>("/bucket/portrait", formData, getAuthHeaders());

    if (!response.success) {
        throw new Error(response.error || "Error al subir el portrait");
    }

    if (!response.data) {
        throw new Error("No se pudo subir el portrait");
    }

    return response.data;
};

export const deletePortrait = async (userId: string = TEST_USER_ID): Promise<PortraitDeleteResponse> => {
    const response = await api.delete<ApiResponse<PortraitDeleteResponse>>(`/bucket/portrait/${userId}`, getAuthHeaders());

    if (!response.success) {
        throw new Error(response.error || "Error al eliminar el portrait");
    }

    if (!response.data) {
        throw new Error("No se pudo eliminar el portrait");
    }

    return response.data;
};