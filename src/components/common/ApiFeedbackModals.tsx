import { useEffect, useMemo, useState } from "react";

type ApiErrorDetail = {
	message: string;
};

export default function ApiFeedbackModals() {
	const [error, setError] = useState<ApiErrorDetail | null>(null);

	useEffect(() => {
		const onApiError = (event: Event) => {
			const customEvent = event as CustomEvent<ApiErrorDetail>;
			if (!customEvent.detail?.message) return;
			setError(customEvent.detail);
		};

		window.addEventListener("api:error", onApiError as EventListener);

		return () => {
			window.removeEventListener("api:error", onApiError as EventListener);
		};
	}, []);

	const content = useMemo(() => {
		if (!error) return null;
		return {
			title: "Error al descargar",
			description: error.message,
		};
	}, [error]);

	if (!content) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-label={content.title}>
			<button
				type="button"
				className="absolute inset-0 bg-black/70"
				onClick={() => setError(null)}
				aria-label="Cerrar modal"
			></button>
			<div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-2xl">
				<h3 className="text-xl text-white">{content.title}</h3>
				<p className="mt-3 text-gray-300">{content.description}</p>
				<button
					type="button"
					className="mt-6 w-full rounded-lg bg-primary-orange px-4 py-3 font-semibold text-white transition duration-200 hover:bg-orange-600"
					onClick={() => setError(null)}
				>
					Entendido
				</button>
			</div>
		</div>
	);
}
