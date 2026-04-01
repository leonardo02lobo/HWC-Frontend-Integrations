import { useEffect, useMemo, useState } from "react";

type AuthModalType = "invalid-credentials" | "register-success";

interface AuthModalDetail {
	type: AuthModalType;
	email?: string;
}

export default function AuthFeedbackModals() {
	const [modal, setModal] = useState<AuthModalDetail | null>(null);

	useEffect(() => {
		const onOpenModal = (event: Event) => {
			const customEvent = event as CustomEvent<AuthModalDetail>;
			if (!customEvent.detail?.type) return;
			setModal(customEvent.detail);
		};

		window.addEventListener("auth:modal", onOpenModal as EventListener);

		return () => {
			window.removeEventListener("auth:modal", onOpenModal as EventListener);
		};
	}, []);

	const content = useMemo(() => {
		if (!modal) return null;

		if (modal.type === "invalid-credentials") {
			return {
				title: "Credenciales incorrectas",
				description:
					"El correo o la contraseña no son válidos. Verifica tus datos e intenta nuevamente.",
			};
		}

		return {
			title: "Registro exitoso",
			description: `Tu contraseña será enviada al correo ${modal.email ?? "proporcionado"}. Revisa tu bandeja de entrada.`,
		};
	}, [modal]);

	if (!modal || !content) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-label={content.title}>
			<button
				type="button"
				className="absolute inset-0 bg-black/70"
				onClick={() => setModal(null)}
				aria-label="Cerrar modal"
			></button>
			<div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-2xl">
				<h3 className="text-xl text-white">{content.title}</h3>
				<p className="mt-3 text-gray-300">{content.description}</p>
				<button
					type="button"
					className="mt-6 w-full rounded-lg bg-primary-orange px-4 py-3 font-semibold text-white transition duration-200 hover:bg-orange-600"
					onClick={() => setModal(null)}
				>
					Entendido
				</button>
			</div>
		</div>
	);
}