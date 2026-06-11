import { useEffect, useState } from "react";
import { getMyInvitations, acceptInvitation, rejectInvitation, type InvitationApiData } from "../services/team.service";
import { dispatchApiError } from "../../../lib/events";

export default function InvitationsPanel() {
	const [invitations, setInvitations] = useState<InvitationApiData[]>([]);
	const [loading, setLoading] = useState(true);
	const [acting, setActing] = useState<string | null>(null);

	const fetchInvitations = async () => {
		setLoading(true);
		try {
			const data = await getMyInvitations();
			setInvitations(data);
		} catch (err) {
			dispatchApiError(err instanceof Error ? err.message : "No se pudo obtener las invitaciones");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchInvitations();
	}, []);

	const handleAccept = async (id: string) => {
		setActing(id);
		try {
			await acceptInvitation(id);
			await fetchInvitations();
		} catch (err) {
			dispatchApiError(err instanceof Error ? err.message : "No se pudo aceptar la invitación");
		} finally {
			setActing(null);
		}
	};

	const handleReject = async (id: string) => {
		setActing(id);
		try {
			await rejectInvitation(id);
			await fetchInvitations();
		} catch (err) {
			dispatchApiError(err instanceof Error ? err.message : "No se pudo rechazar la invitación");
		} finally {
			setActing(null);
		}
	};

	return (
		<section
			id="invitations-card"
			data-team-section="invitations"
			className="flex flex-col gap-3 rounded-2xl border border-gray-800/60 bg-[#141929] p-4 transition-all duration-300 hover:border-gray-700/80 md:p-5"
		>
			<header className="flex flex-col gap-1">
				<h2 className="text-base text-white font-[Zen_Dots,cursive]">
					<span className="text-primary-orange">~</span> Invitaciones recibidas
				</h2>
				<p className="text-xs text-white/40 font-[JetBrains_Mono,monospace]">
					<span className="text-primary-orange">{"// "}</span>Gestiona las invitaciones que has recibido
				</p>
			</header>

			{loading ? (
				<p className="text-sm text-white/50 font-[JetBrains_Mono,monospace]">Cargando...</p>
			) : invitations.length === 0 ? (
				<p className="text-sm text-white/40 font-[JetBrains_Mono,monospace]">No tienes invitaciones pendientes.</p>
			) : (
				<>
					<div className="overflow-x-auto">
						<table className="w-full min-w-[420px] border-separate border-spacing-0" aria-label="Invitaciones recibidas">
							<thead>
								<tr>
									{["Equipo", "Invitado por", "Fecha", "Estado", "Acciones"].map((h) => (
										<th
											key={h}
											className="border-b border-gray-800/60 px-2 py-2 text-left text-[10px] uppercase tracking-wider text-white/40 font-[JetBrains_Mono,monospace]"
										>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{invitations.map((inv) => (
									<tr key={inv.id} className="transition-colors duration-150 hover:bg-white/[0.02]">
										<td className="border-b border-gray-800/40 px-2 py-3 align-middle">
											<span className="text-xs text-white font-[JetBrains_Mono,monospace] whitespace-nowrap">
												{inv.team_name ?? inv.team_id}
											</span>
										</td>
										<td className="border-b border-gray-800/40 px-2 py-3 align-middle">
											<span className="text-xs text-white/70 font-[JetBrains_Mono,monospace] whitespace-nowrap">
												{inv.invited_by ?? "—"}
											</span>
										</td>
										<td className="border-b border-gray-800/40 px-2 py-3 align-middle">
											<span className="text-xs text-white/50 font-[JetBrains_Mono,monospace] whitespace-nowrap">
												{inv.created_at ?? "—"}
											</span>
										</td>
										<td className="border-b border-gray-800/40 px-2 py-3 align-middle">
											<span className="inline-flex rounded-md border border-primary-orange/40 bg-primary-orange/10 px-1.5 py-0.5 text-[10px] text-primary-orange font-[JetBrains_Mono,monospace]">
												{inv.status ?? "Pendiente"}
											</span>
										</td>
										<td className="border-b border-gray-800/40 px-2 py-3 align-middle">
											<div className="flex items-center gap-1">
												<button
													type="button"
													disabled={acting === inv.id}
													onClick={() => handleAccept(inv.id)}
													aria-label={`Aceptar invitación de ${inv.team_name ?? inv.team_id}`}
													className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition-colors duration-150 hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-40"
												>
													<svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5}>
														<path d="M3 8.5l3.5 3.5L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</button>
												<button
													type="button"
													disabled={acting === inv.id}
													onClick={() => handleReject(inv.id)}
													aria-label={`Rechazar invitación de ${inv.team_name ?? inv.team_id}`}
													className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-rose-500/30 bg-rose-500/10 text-rose-300 transition-colors duration-150 hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-40"
												>
													<svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5}>
														<path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
													</svg>
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<p className="text-xs text-white/40 font-[JetBrains_Mono,monospace]">
						Mostrando <span className="text-white/70">1</span> a{" "}
						<span className="text-white/70">{invitations.length}</span> de{" "}
						<span className="text-white/70">{invitations.length}</span> invitaciones
					</p>
				</>
			)}
		</section>
	);
}
