import { api, type ApiResponse } from "../../lib/api";

export type ExerciseDownloadResponse = {
    url: string;
    filename?: string;
};

const EXERCISE_ID = "16";

export const getExerciseDownload = async (): Promise<ExerciseDownloadResponse> => {
    const response = await api.get<ApiResponse<ExerciseDownloadResponse>>(
        `/bucket/exercises/${EXERCISE_ID}`,
    );

    if (!response.success) {
        throw new Error(response.error || "Error al obtener el archivo del ejercicio");
    }

    if (!response.data) {
        throw new Error("No se pudo obtener la URL de descarga del ejercicio");
    }

    return response.data;
};
