const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const defaultHeaders = {
	Accept: "application/json",
};

const buildUrl = (path: string) => {
	if (!API_BASE_URL) return path;
	return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export type ApiResponse<T> = {
	success: boolean;
	status_code: string;
	error: string | null;
	data: T | null;
};

const parseJson = async <T>(response: Response): Promise<T> => {
	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(errorText || "Request failed");
	}
	return (await response.json()) as T;
};

export const api = {
	get: async <T>(path: string, headers: Record<string, string> = {}): Promise<T> => {
		const response = await fetch(buildUrl(path), {
			method: "GET",
			headers: { ...defaultHeaders, ...headers },
			credentials: "include",
		});
		return parseJson<T>(response);
	},

	delete: async <T>(path: string, headers: Record<string, string> = {}): Promise<T> => {
		const response = await fetch(buildUrl(path), {
			method: "DELETE",
			headers: { ...defaultHeaders, ...headers },
			credentials: "include",
		});
		return parseJson<T>(response);
	},

	upload: async <T>(path: string, formData: FormData): Promise<T> => {
		const response = await fetch(buildUrl(path), {
			method: "POST",
			headers: { Accept: "application/json" },
			credentials: "include",
			body: formData,
		});
		return parseJson<T>(response);
	},
};
