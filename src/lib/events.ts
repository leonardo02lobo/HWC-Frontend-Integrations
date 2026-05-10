export type ApiErrorDetail = {
	message: string;
};

export const dispatchApiError = (message: string) => {
	window.dispatchEvent(new CustomEvent<ApiErrorDetail>("api:error", { detail: { message } }));
};
