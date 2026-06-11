import { useEffect, useState } from "react";
import { getTeamDetail, updateRepositoryLink, sendInvitations, deleteTeam } from "../services/team.service";
import { dispatchApiError } from "../../../lib/events";

export default function TeamDetailModal() {
	const [openTeamId, setOpenTeamId] = useState<string | null>(null);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [repoUrl, setRepoUrl] = useState("");
	const [inviteQuery, setInviteQuery] = useState("");
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const onOpen = async (event: Event) => {
			const customEvent = event as CustomEvent<{ teamId: string }>;
			const id = customEvent.detail?.teamId;
			if (!id) return;
			setOpenTeamId(id);
			setInviteQuery("");
			setConfirmingDelete(false);
			setLoading(true);
			try {
				const data = await getTeamDetail(id);
				setName(data.name ?? "");
				setDescription(data.description ?? "");
				setRepoUrl(data.repository_link ?? "");
			} catch (err) {
				dispatchApiError(err instanceof Error ? err.message : "Error al cargar el equipo");
				setOpenTeamId(null);
			} finally {
				setLoading(false);
			}
		};
		window.addEventListener("team:open-detail", onOpen as EventListener);
		return () => window.removeEventListener("team:open-detail", onOpen as EventListener);
	}, []);

	useEffect(() => {
		if (!openTeamId) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpenTeamId(null);
		};
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [openTeamId]);

	const close = () => setOpenTeamId(null);

	if (!openTeamId) return null;

	const handleUpdateRepo = async () => {
		if (!openTeamId) return;
		setSubmitting(true);
		try {
			await updateRepositoryLink({ team_id: openTeamId, repository_link: repoUrl });
		} catch (err) {
			dispatchApiError(err instanceof Error ? err.message : "No se pudo actualizar el repositorio");
		} finally {
			setSubmitting(false);
		}
	};

	const handleInvite = async () => {
		if (!openTeamId || !inviteQuery.trim()) return;
		setSubmitting(true);
		try {
			await sendInvitations({ team_id: openTeamId, email: inviteQuery.trim() });
			setInviteQuery("");
		} catch (err) {
			dispatchApiError(err instanceof Error ? err.message : "No se pudo enviar la invitación");
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (!openTeamId) return;
		setSubmitting(true);
		try {
			await deleteTeam(openTeamId);
			setConfirmingDelete(false);
			close();
		} catch (err) {
			dispatchApiError(err instanceof Error ? err.message : "No se pudo eliminar el equipo");
		} finally {
			setSubmitting(false);
		}
	};

	const handleSave = async () => {
		console.warn("TODO: endpoint de actualización de nombre no disponible");
		close();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
			role="dialog"
			aria-modal="true"
			aria-labelledby="team-detail-title"
		>
			<button
				type="button"
				className="absolute inset-0 bg-[#05070f]/80 backdrop-blur-[2px]"
				onClick={close}
				aria-label="Cerrar modal"
			/>

			<div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-800/60 bg-[#141929] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
				{/* Header */}
				<header className="flex items-start justify-between gap-3 border-b border-gray-800/60 px-5 py-4 md:px-6">
					<h2 id="team-detail-title" className="text-lg text-white font-[Zen_Dots,cursive] md:text-xl">
						<span className="text-[#FF4D00]">$</span>
						{"Detalle del equipo"}
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
					{loading ? (
						<p className="text-sm text-white/50 font-[JetBrains_Mono,monospace]">Cargando...</p>
					) : (
						<>
							{/* Editable team info */}
							<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
								<label className="flex flex-col gap-1.5">
									<span className="text-sm text-white font-[JetBrains_Mono,monospace]">Nombre del equipo</span>
									<input
										type="text"
										value={name}
										onChange={(event) => setName(event.target.value)}
										className="w-full rounded-lg border border-gray-800/60 bg-[rgba(11,16,32,0.6)] px-3.5 py-2.5 text-sm text-white outline-none transition duration-200 focus:border-[rgba(255,77,0,0.4)] focus:ring-2 focus:ring-[rgba(255,77,0,0.6)] font-[JetBrains_Mono,monospace]"
									/>
								</label>
								<label className="flex flex-col gap-1.5">
									<span className="text-sm text-white font-[JetBrains_Mono,monospace]">Descripción</span>
									<input
										type="text"
										value={description}
										onChange={(event) => setDescription(event.target.value)}
										className="w-full rounded-lg border border-gray-800/60 bg-[rgba(11,16,32,0.6)] px-3.5 py-2.5 text-sm text-white outline-none transition duration-200 focus:border-[rgba(255,77,0,0.4)] focus:ring-2 focus:ring-[rgba(255,77,0,0.6)] font-[JetBrains_Mono,monospace]"
									/>
								</label>
							</div>

							{/* Editable repository */}
							<div className="flex flex-col gap-2">
								<span className="text-sm text-white font-[JetBrains_Mono,monospace]">Repositorio</span>
								<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
									<label className="flex flex-1 items-center gap-2 rounded-lg border border-gray-800/60 bg-[rgba(11,16,32,0.6)] px-3 py-2.5 min-w-0">
										<svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-white/40" fill="currentColor" aria-hidden="true">
											<path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.07 3.29 9.36 7.86 10.88.57.1.78-.25.78-.55v-1.93c-3.2.7-3.87-1.54-3.87-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.95 10.95 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.12 3.05.73.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.27 5.68.42.36.79 1.07.79 2.16v3.2c0 .31.21.66.79.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
										</svg>
										<input
											type="text"
											value={repoUrl}
											onChange={(event) => setRepoUrl(event.target.value)}
											className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none font-[JetBrains_Mono,monospace]"
											aria-label="URL del repositorio"
										/>
									</label>
									<button
										type="button"
										disabled={submitting}
										onClick={handleUpdateRepo}
										className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#FF4D00]/40 bg-[#FF4D00]/10 px-3 py-2.5 text-xs text-[#FF4D00] transition-colors duration-200 hover:bg-[#FF4D00]/15 font-[JetBrains_Mono,monospace] disabled:cursor-not-allowed disabled:opacity-40"
									>
										{submitting ? "Guardando..." : "Actualizar enlace"}
									</button>
								</div>
							</div>

							{/* Invitar miembro */}
							<div className="flex flex-col gap-2">
								<h4 className="text-sm text-white font-[Zen_Dots,cursive]">Invitar miembro</h4>
								<p className="text-xs text-white/40 font-[JetBrains_Mono,monospace]">Busca usuarios activos para invitarlos a este equipo</p>
								<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
									<label className="flex flex-1 items-center gap-2 rounded-lg border border-gray-800/60 bg-[rgba(11,16,32,0.6)] px-3 py-2.5 min-w-0">
										<svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-white/40" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
											<circle cx="7" cy="7" r="5" />
											<path d="M11 11l3 3" strokeLinecap="round" />
										</svg>
										<input
											type="search"
											value={inviteQuery}
											onChange={(event) => setInviteQuery(event.target.value)}
											placeholder="Correo del usuario..."
											className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25 font-[JetBrains_Mono,monospace]"
											aria-label="Correo del usuario a invitar"
										/>
									</label>
									<button
										type="button"
										disabled={!inviteQuery.trim() || submitting}
										onClick={handleInvite}
										className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#FF4D00] px-3.5 py-2.5 text-xs text-white transition-all duration-200 hover:bg-orange-600 font-[JetBrains_Mono,monospace] disabled:cursor-not-allowed disabled:opacity-40"
									>
										<svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
											<circle cx="9" cy="8" r="3.25" />
											<path d="M2.75 19c.5-3 3-5 6.25-5s5.75 2 6.25 5" strokeLinecap="round" />
											<path d="M19 8v6M16 11h6" strokeLinecap="round" />
										</svg>
										{submitting ? "Enviando..." : "Invitar miembro"}
									</button>
								</div>
							</div>

							{/* Acciones del equipo */}
							<div className="flex flex-col gap-2 rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-3">
								<h4 className="text-sm text-rose-200 font-[Zen_Dots,cursive]">Acciones del equipo</h4>
								<p className="text-xs text-white/50 font-[JetBrains_Mono,monospace]">
									Esta acción es permanente. Todos los datos del equipo se eliminarán.
								</p>
								{confirmingDelete ? (
									<div className="flex flex-col gap-2 sm:flex-row">
										<button
											type="button"
											onClick={() => setConfirmingDelete(false)}
											disabled={submitting}
											className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-800/60 bg-transparent px-4 py-2.5 text-sm text-white/70 transition-colors duration-200 hover:border-gray-700/80 hover:text-white font-[JetBrains_Mono,monospace]"
										>
											Cancelar
										</button>
										<button
											type="button"
											disabled={submitting}
											onClick={handleDelete}
											className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-500 px-4 py-2.5 text-sm text-white transition-colors duration-200 hover:bg-rose-600 font-[JetBrains_Mono,monospace] disabled:cursor-not-allowed disabled:opacity-40"
										>
											{submitting ? "Eliminando..." : "Confirmar eliminación"}
											<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
												<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</button>
									</div>
								) : (
									<button
										type="button"
										onClick={() => setConfirmingDelete(true)}
										className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300 transition-colors duration-200 hover:bg-rose-500/15 hover:text-rose-200 font-[JetBrains_Mono,monospace]"
									>
										Eliminar Equipo
										<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
											<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</button>
								)}
							</div>
						</>
					)}
				</div>

				{/* Footer */}
				<footer className="flex flex-col gap-2 border-t border-gray-800/60 bg-[rgba(11,16,32,0.4)] px-5 py-4 sm:flex-row sm:items-center sm:justify-end md:px-6">
					<button
						type="button"
						onClick={close}
						className="inline-flex items-center justify-center rounded-lg border border-gray-800/60 bg-transparent px-4 py-2.5 text-sm text-white/70 transition-colors duration-200 hover:border-gray-700/80 hover:text-white font-[JetBrains_Mono,monospace]"
					>
						Cancelar
					</button>
					<button
						type="button"
						disabled={submitting || loading}
						onClick={handleSave}
						className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF4D00] px-4 py-2.5 text-sm text-white transition-all duration-200 hover:bg-orange-600 font-[JetBrains_Mono,monospace] disabled:cursor-not-allowed disabled:opacity-40"
					>
						<svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5}>
							<path d="M3 8.5l3.5 3.5L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						Guardar cambios
					</button>
				</footer>
			</div>
		</div>
	);
}
