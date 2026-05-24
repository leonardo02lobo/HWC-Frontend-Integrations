import { useEffect, useState } from "react";

const initialState = {
	name: "",
	description: "",
	repository: "",
};

export default function TeamCreateModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [values, setValues] = useState(initialState);

	useEffect(() => {
		const onOpen = () => {
			setValues(initialState);
			setIsOpen(true);
		};
		window.addEventListener("team:open-create", onOpen);
		return () => window.removeEventListener("team:open-create", onOpen);
	}, []);

	useEffect(() => {
		if (!isOpen) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setIsOpen(false);
		};
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	const close = () => setIsOpen(false);

	const update = (field: keyof typeof initialState, value: string) => {
		setValues((prev) => ({ ...prev, [field]: value }));
	};

	const trimmedName = values.name.trim();
	const canSubmit = trimmedName.length > 0;

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (!canSubmit) return;
		// eslint-disable-next-line no-console
		console.log("POST /teams", {
			name: trimmedName,
			description: values.description.trim() || null,
			repository: values.repository.trim() || null,
		});
		close();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
			role="dialog"
			aria-modal="true"
			aria-labelledby="team-create-title"
		>
			<button
				type="button"
				className="absolute inset-0 bg-[#05070f]/80 backdrop-blur-[2px]"
				onClick={close}
				aria-label="Cerrar modal"
			/>

			<form
				onSubmit={handleSubmit}
				className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-gray-800/60 bg-[#141929] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
			>
				{/* Header */}
				<header className="flex items-start justify-between gap-3 border-b border-gray-800/60 px-5 py-4 md:px-6">
					<h2 id="team-create-title" className="text-lg text-white font-[Zen_Dots,cursive] md:text-xl">
						<span className="text-[#FF4D00]">$</span>
						{"Crear equipo"}
						<span className="text-[#FF4D00]">.</span>
					</h2>
					<button
						type="button"
						onClick={close}
						aria-label="Cerrar"
						className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-800/60 text-white/60 transition-colors duration-150 hover:border-gray-700/80 hover:text-white"
					>
						<svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
							<path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
						</svg>
					</button>
				</header>

				{/* Scrollable body */}
				<div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5 md:px-6">
					<p className="text-xs text-white/40 font-[JetBrains_Mono,monospace]">
						<span className="text-[#FF4D00]">{"// "}</span>
						Podrás invitar miembros después de crear el equipo
					</p>

					{/* Nombre */}
					<label className="flex flex-col gap-1.5">
						<span className="text-sm text-white font-[JetBrains_Mono,monospace]">
							Nombre del equipo <span className="text-[#FF4D00]">*</span>
						</span>
						<input
							type="text"
							required
							value={values.name}
							onChange={(event) => update("name", event.target.value)}
							placeholder="Ej. Frontend Team"
							maxLength={64}
							autoFocus
							className="w-full rounded-lg border border-gray-800/60 bg-[rgba(11,16,32,0.6)] px-3.5 py-2.5 text-sm text-white outline-none transition duration-200 placeholder:text-white/25 focus:border-[rgba(255,77,0,0.4)] focus:ring-2 focus:ring-[rgba(255,77,0,0.6)] font-[JetBrains_Mono,monospace]"
						/>
					</label>

					{/* Descripción */}
					<label className="flex flex-col gap-1.5">
						<span className="text-sm text-white font-[JetBrains_Mono,monospace]">Descripción</span>
						<input
							type="text"
							value={values.description}
							onChange={(event) => update("description", event.target.value)}
							placeholder="Breve descripción del propósito del equipo"
							maxLength={140}
							className="w-full rounded-lg border border-gray-800/60 bg-[rgba(11,16,32,0.6)] px-3.5 py-2.5 text-sm text-white outline-none transition duration-200 placeholder:text-white/25 focus:border-[rgba(255,77,0,0.4)] focus:ring-2 focus:ring-[rgba(255,77,0,0.6)] font-[JetBrains_Mono,monospace]"
						/>
					</label>

					{/* Repositorio */}
					<label className="flex flex-col gap-1.5">
						<span className="text-sm text-white font-[JetBrains_Mono,monospace]">Repositorio</span>
						<div className="flex items-center gap-2 rounded-lg border border-gray-800/60 bg-[rgba(11,16,32,0.6)] px-3 py-2.5 transition duration-200 focus-within:border-[rgba(255,77,0,0.4)] focus-within:ring-2 focus-within:ring-[rgba(255,77,0,0.6)]">
							<svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-white/40" fill="currentColor" aria-hidden="true">
								<path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.07 3.29 9.36 7.86 10.88.57.1.78-.25.78-.55v-1.93c-3.2.7-3.87-1.54-3.87-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.95 10.95 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.12 3.05.73.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.27 5.68.42.36.79 1.07.79 2.16v3.2c0 .31.21.66.79.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
							</svg>
							<input
								type="url"
								value={values.repository}
								onChange={(event) => update("repository", event.target.value)}
								placeholder="github.com/org/repo"
								className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25 font-[JetBrains_Mono,monospace]"
								aria-label="URL del repositorio"
							/>
						</div>
						<span className="text-[11px] text-white/40 font-[JetBrains_Mono,monospace]">
							Opcional. Puedes añadirlo más tarde desde el detalle del equipo.
						</span>
					</label>
				</div>

				{/* Footer */}
				<footer className="flex flex-col gap-2 border-t border-gray-800/60 bg-[rgba(11,16,32,0.4)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
					<span className="self-start rounded-md border border-[#FF4D00]/30 bg-[#FF4D00]/[0.06] px-2 py-1 text-[11px] text-[#FF4D00] font-[JetBrains_Mono,monospace] sm:self-center">
						POST&nbsp; /teams
					</span>
					<div className="flex flex-col gap-2 sm:flex-row">
						<button
							type="button"
							onClick={close}
							className="inline-flex items-center justify-center rounded-lg border border-gray-800/60 bg-transparent px-4 py-2.5 text-sm text-white/70 transition-colors duration-200 hover:border-gray-700/80 hover:text-white font-[JetBrains_Mono,monospace]"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={!canSubmit}
							className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF4D00] px-4 py-2.5 text-sm text-white transition-all duration-200 hover:bg-orange-600 font-[JetBrains_Mono,monospace] disabled:cursor-not-allowed disabled:opacity-40"
						>
							<svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
								<path d="M8 3v10M3 8h10" strokeLinecap="round" />
							</svg>
							Crear Equipo
						</button>
					</div>
				</footer>
			</form>
		</div>
	);
}
