import { useEffect, useMemo, useState } from "react";

type AuthModalType = "invalid-credentials" | "register-success" | "email-verification" | "register-error";

interface AuthModalDetail {
	type: AuthModalType;
	email?: string;
}

const getEmailProviderLink = (email?: string): { label: string; href: string } => {
	const domain = email?.split("@")[1]?.toLowerCase() ?? "";
	if (domain.includes("gmail")) return { label: "Abrir Gmail", href: "https://mail.google.com" };
	if (domain.includes("outlook") || domain.includes("hotmail") || domain.includes("live"))
		return { label: "Abrir Outlook", href: "https://outlook.live.com" };
	if (domain.includes("yahoo")) return { label: "Abrir Yahoo Mail", href: "https://mail.yahoo.com" };
	return { label: "Abrir bandeja de entrada", href: `mailto:${email ?? ""}` };
};

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
				providerLink: undefined,
				isVerification: false,
			};
		}

		if (modal.type === "register-error") {
			return {
				title: "Error al registrarse",
				description:
					"No se pudo completar el registro. El servidor puede estar temporalmente no disponible. Intenta nuevamente en unos momentos.",
				providerLink: undefined,
				isVerification: false,
			};
		}

		if (modal.type === "email-verification") {
			const provider = getEmailProviderLink(modal.email);
			return {
				title: "Verifica tu correo",
				description: `Enviamos un enlace de verificación a ${modal.email ?? "tu correo electrónico"}. Haz clic en el enlace para activar tu cuenta. Si no lo encuentras, revisa tu carpeta de spam o correo no deseado.`,
				providerLink: provider,
				isVerification: true,
			};
		}

		return {
			title: "Registro exitoso",
			description: `Tu contraseña será enviada al correo ${modal.email ?? "proporcionado"}. Revisa tu bandeja de entrada.`,
			providerLink: undefined,
			isVerification: false,
		};
	}, [modal]);

	if (!modal || !content) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-label={content.title}>
			<button
				type="button"
				className="absolute inset-0 bg-black/70"
				onClick={modal?.type === "email-verification" ? undefined : () => setModal(null)}
				aria-label="Cerrar modal"
			></button>
			<div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-2xl">
				<h3 className="text-xl text-white">{content.title}</h3>
				<p className="mt-3 text-gray-300">{content.description}</p>
				{content.isVerification && content.providerLink ? (
					<>
						<a
							href={content.providerLink.href}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-4 flex items-center justify-center gap-2 w-full rounded-lg border border-primary-orange/40 bg-primary-orange/10 px-4 py-3 text-primary-orange transition duration-200 hover:bg-primary-orange/15"
						>
							{content.providerLink.label} →
						</a>
						<button
							type="button"
							className="mt-6 w-full rounded-lg bg-primary-orange px-4 py-3 font-semibold text-white transition duration-200 hover:bg-orange-600"
							onClick={() => {
								setModal(null);
								window.dispatchEvent(new CustomEvent("auth:verified"));
							}}
						>
							Ya verifiqué mi correo
						</button>
					</>
				) : (
					<button
						type="button"
						className="mt-6 w-full rounded-lg bg-primary-orange px-4 py-3 font-semibold text-white transition duration-200 hover:bg-orange-600"
						onClick={() => setModal(null)}
					>
						Entendido
					</button>
				)}
			</div>
		</div>
	);
}
