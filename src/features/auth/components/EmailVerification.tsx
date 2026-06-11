import { useEffect, useState } from "react";
import { api, type ApiResponse } from "../../../lib/api";

type VerifyState = "loading" | "success" | "error";

function LoadingView() {
	return (
		<>
			<div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-700 bg-gray-900/60">
				<svg
					className="h-8 w-8 animate-spin text-primary-orange"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden="true"
				>
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					/>
				</svg>
			</div>
			<div className="flex flex-col gap-2">
				<h2 className="text-xl text-white font-[Zen_Dots,cursive]">
					<span className="text-primary-orange">$</span>Verificando<span className="text-primary-orange">.</span>
				</h2>
				<p className="text-sm text-white/60 font-[JetBrains_Mono,monospace]">
					Validando tu correo electrónico...
				</p>
			</div>
		</>
	);
}

function SuccessView() {
	return (
		<>
			<div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary-orange/40 bg-primary-orange/10 text-primary-orange">
				<svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
					<path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
			<div className="flex flex-col gap-2">
				<h2 className="text-xl text-white font-[Zen_Dots,cursive]">
					<span className="text-primary-orange">$</span>Verificado<span className="text-primary-orange">.</span>
				</h2>
				<p className="text-sm text-white/60 font-[JetBrains_Mono,monospace]">
					Tu cuenta ha sido activada exitosamente. Ya puedes iniciar sesión.
				</p>
			</div>
			<a
				href="/register"
				className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-orange px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-orange-600 font-[JetBrains_Mono,monospace]"
			>
				Ir al inicio de sesión
				<svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
					<path d="M3 8h10M9 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</a>
		</>
	);
}

function ErrorView({ message }: { message: string }) {
	return (
		<>
			<div className="flex h-16 w-16 items-center justify-center rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-300">
				<svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
					<path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
				</svg>
			</div>
			<div className="flex flex-col gap-2">
				<h2 className="text-xl text-white font-[Zen_Dots,cursive]">
					<span className="text-rose-400">$</span>Error<span className="text-rose-400">.</span>
				</h2>
				<p className="text-sm text-white/60 font-[JetBrains_Mono,monospace]">
					{message}
				</p>
			</div>
			<a
				href="/register"
				className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-700 bg-transparent px-4 py-3 text-sm text-white/70 transition duration-200 hover:border-gray-600 hover:text-white font-[JetBrains_Mono,monospace]"
			>
				Volver al registro
			</a>
		</>
	);
}

export default function EmailVerification() {
	const [state, setState] = useState<VerifyState>("loading");
	const [errorMsg, setErrorMsg] = useState("");

	useEffect(() => {
		const token = new URLSearchParams(window.location.search).get("token");

		if (!token) {
			setErrorMsg("No se encontró un token de verificación en el enlace. Vuelve a registrarte para recibir uno nuevo.");
			setState("error");
			return;
		}

		api.get<ApiResponse<unknown>>(`/auth/verify?token=${encodeURIComponent(token)}`)
			.then((res) => {
				if (res.success) {
					setState("success");
				} else {
					setErrorMsg(res.error ?? "El enlace de verificación no es válido o ha expirado.");
					setState("error");
				}
			})
			.catch(() => {
				setErrorMsg("No se pudo conectar con el servidor. Intenta nuevamente en unos momentos.");
				setState("error");
			});
	}, []);

	return (
		<section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
			<div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800/80 p-8 shadow-2xl flex flex-col items-center gap-6 text-center">
				{state === "loading" && <LoadingView />}
				{state === "success" && <SuccessView />}
				{state === "error" && <ErrorView message={errorMsg} />}
			</div>
		</section>
	);
}
