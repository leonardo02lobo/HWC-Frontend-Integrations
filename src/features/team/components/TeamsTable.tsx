import { useEffect, useState } from "react";
import { getTeams, type TeamApiData } from "../services/team.service";
import { dispatchApiError } from "../../../lib/events";

export default function TeamsTable() {
	const [teams, setTeams] = useState<TeamApiData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTeams = async () => {
			setLoading(true);
			try {
				const data = await getTeams();
				setTeams(data);
			} catch (err) {
				dispatchApiError(err instanceof Error ? err.message : "No se pudo obtener los equipos");
			} finally {
				setLoading(false);
			}
		};
		fetchTeams();

		const onCreated = () => fetchTeams();
		window.addEventListener("team:created", onCreated);
		return () => window.removeEventListener("team:created", onCreated);
	}, []);

	const dispatchDetail = (teamId: string) => {
		window.dispatchEvent(new CustomEvent("team:open-detail", { detail: { teamId } }));
	};

	return (
		<section
			data-team-section="teams-list"
			className="flex min-w-0 flex-1 flex-col gap-4 rounded-2xl border border-gray-800/60 bg-[#141929] p-4 md:p-5 transition-all duration-300 hover:border-gray-700/80"
		>
			<nav aria-label="Filtrar equipos" className="-mx-1 overflow-x-auto scrollbar-thin">
				<ul className="flex min-w-fit items-center gap-1 border-b border-gray-800/60 px-1">
					<li className="shrink-0">
						<button
							type="button"
							role="tab"
							aria-selected="true"
							className="relative inline-flex items-center px-4 py-3 text-sm text-primary-orange font-[JetBrains_Mono,monospace] whitespace-nowrap"
						>
							Todos los equipos
							<span
								className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-primary-orange via-primary-orange to-primary-orange/40"
								aria-hidden="true"
							></span>
						</button>
					</li>
				</ul>
			</nav>

			{loading ? (
				<p className="text-sm text-white/50 font-[JetBrains_Mono,monospace]">Cargando...</p>
			) : teams.length === 0 ? (
				<p className="text-sm text-white/40 font-[JetBrains_Mono,monospace]">No hay equipos disponibles.</p>
			) : (
				<>
					<div className="overflow-x-auto">
						<table className="w-full min-w-[680px] border-separate border-spacing-0" aria-label="Lista de equipos">
							<thead>
								<tr>
									{["Equipo", "Descripción", "Repositorio", "Estado", "Acciones"].map((h) => (
										<th
											key={h}
											scope="col"
											className="border-b border-gray-800/60 px-3 py-3 text-left text-xs uppercase tracking-wider text-white/40 font-[JetBrains_Mono,monospace]"
										>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{teams.map((team) => (
									<tr key={team.id} className="group transition-colors duration-150 hover:bg-white/[0.02]">
										<td className="border-b border-gray-800/40 px-3 py-3.5 align-middle">
											<span className="text-sm text-white font-[JetBrains_Mono,monospace] whitespace-nowrap">
												{team.name}
											</span>
										</td>
										<td className="border-b border-gray-800/40 px-3 py-3.5 align-middle">
											<span className="text-sm text-white/60 font-[JetBrains_Mono,monospace]">
												{team.description}
											</span>
										</td>
										<td className="border-b border-gray-800/40 px-3 py-3.5 align-middle">
											{team.repository_link ? (
												<a
													href={team.repository_link}
													target="_blank"
													rel="noreferrer"
													className="text-sm text-primary-orange hover:text-orange-400 transition-colors duration-200 font-[JetBrains_Mono,monospace]"
												>
													{team.repository_link}
												</a>
											) : (
												<span className="text-sm text-white/30 font-[JetBrains_Mono,monospace]">—</span>
											)}
										</td>
										<td className="border-b border-gray-800/40 px-3 py-3.5 align-middle">
											<span className="text-sm text-white/60 font-[JetBrains_Mono,monospace]">
												{team.status}
											</span>
										</td>
										<td className="border-b border-gray-800/40 px-3 py-3.5 align-middle">
											<div className="flex items-center gap-1">
												<button
													type="button"
													onClick={() => dispatchDetail(team.id)}
													aria-label={`Ver ${team.name}`}
													className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/50 transition-colors duration-150 hover:bg-white/5 hover:text-white"
												>
													<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.75}>
														<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
														<circle cx="12" cy="12" r="3" />
													</svg>
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<footer className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<p className="text-xs text-white/40 font-[JetBrains_Mono,monospace]">
							Mostrando <span className="text-white/70">1</span> a{" "}
							<span className="text-white/70">{teams.length}</span> de{" "}
							<span className="text-white/70">{teams.length}</span> equipos
						</p>
					</footer>
				</>
			)}
		</section>
	);
}
