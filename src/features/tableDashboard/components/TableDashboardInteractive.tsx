import { useMemo, useState } from "react";
import type { DashboardRow } from "../data";

interface Props {
	initialRows: DashboardRow[];
}

export default function TableDashboardInteractive({ initialRows }: Props) {
	const [rows, setRows] = useState<DashboardRow[]>(initialRows);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const selectedRow = useMemo(
		() => rows.find((row) => row.id === selectedId) ?? null,
		[rows, selectedId],
	);

	const closeModal = () => setSelectedId(null);

	const updateSelectedRow = (partial: Partial<DashboardRow>) => {
		if (!selectedId) return;
		setRows((current) =>
			current.map((row) => (row.id === selectedId ? { ...row, ...partial } : row)),
		);
	};

	const statusClass = (status: DashboardRow["status"]) => {
		switch (status) {
			case "Aprobado":
				return "border-primary-orange/40 bg-primary-orange/10 text-primary-orange";
			case "En revisión":
				return "border-white/20 bg-white/5 text-white/70";
			case "Pendiente":
				return "border-white/10 bg-transparent text-white/50";
		}
	};

	return (
		<>
			<div className="overflow-x-auto rounded-2xl bg-[#141929] border border-gray-800/60">
				<table className="w-full min-w-[700px] border-separate border-spacing-0" aria-label="Status de competidores">
					<thead>
						<tr>
							{["ID", "Miembro", "Repositorio", "Estado", "Puntaje", "Actualización"].map((h) => (
								<th
									key={h}
									className="sticky top-0 z-10 border-b border-gray-800/60 bg-primary-ark-blue/80 px-4 py-3 text-left text-xs uppercase tracking-wide text-white/40 font-jetbrains first:rounded-tl-2xl last:rounded-tr-2xl"
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => (
							<tr
								key={row.id}
								onClick={() => setSelectedId(row.id)}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										setSelectedId(row.id);
									}
								}}
								className="cursor-pointer outline-none transition-colors duration-150 [&:hover>td]:bg-white/[0.03] [&:focus-visible>td]:bg-white/[0.05]"
								tabIndex={0}
							>
								<td className="border-b border-gray-800/40 px-4 py-3 text-sm text-white/40 font-jetbrains">{row.id}</td>
								<td className="border-b border-gray-800/40 px-4 py-3 text-sm text-white font-jetbrains whitespace-nowrap">{row.teammate}</td>
								<td className="border-b border-gray-800/40 px-4 py-3 text-sm font-jetbrains">
									<a
										href={`https://${row.repository}`}
										target="_blank"
										rel="noreferrer"
										onClick={(event) => event.stopPropagation()}
										className="text-primary-orange transition-colors duration-200 hover:text-orange-400"
									>
										{row.repository}
									</a>
								</td>
								<td className="border-b border-gray-800/40 px-4 py-3 text-sm font-jetbrains">
									<span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs ${statusClass(row.status)}`}>
										{row.status}
									</span>
								</td>
								<td className="border-b border-gray-800/40 px-4 py-3 text-sm text-white font-jetbrains tabular-nums">{row.score}</td>
								<td className="border-b border-gray-800/40 px-4 py-3 text-sm text-white/50 font-jetbrains whitespace-nowrap">{row.updatedAt}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Detail Modal */}
			{selectedRow && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Detalle de registro">
					<div className="absolute inset-0 bg-[#05070f]/80 backdrop-blur-[2px]" onClick={closeModal}></div>
					<div className="relative z-10 w-full max-w-2xl bg-[#141929] border border-gray-800/60 rounded-2xl p-5 md:p-6">
						<header className="mb-5 flex items-center justify-between gap-3">
							<h3 className="text-lg text-white font-[Zen_Dots,cursive]">
								<span className="text-[#FF4D00]">~</span> Detalle de Registro
							</h3>
							<button
								type="button"
								onClick={closeModal}
								className="rounded-lg border border-gray-800/60 px-3 py-1.5 text-sm text-white/50 transition-colors duration-200 hover:border-gray-700/80 hover:text-white font-[JetBrains_Mono,monospace]"
							>
								Cerrar
							</button>
						</header>

						<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
							<div className="flex flex-col gap-1.5 rounded-lg border border-gray-800/60 bg-[rgba(11,16,32,0.6)] p-3">
								<span className="text-xs uppercase tracking-wide text-white/40 font-[JetBrains_Mono,monospace]">ID</span>
								<p className="text-sm text-white font-[JetBrains_Mono,monospace]">{selectedRow.id}</p>
							</div>
							<div className="flex flex-col gap-1.5 rounded-lg border border-gray-800/60 bg-[rgba(11,16,32,0.6)] p-3">
								<span className="text-xs uppercase tracking-wide text-white/40 font-[JetBrains_Mono,monospace]">Miembro</span>
								<p className="text-sm text-white font-[JetBrains_Mono,monospace]">{selectedRow.teammate}</p>
							</div>
							<div className="flex flex-col gap-1.5 rounded-lg border border-gray-800/60 bg-[rgba(11,16,32,0.6)] p-3">
								<span className="text-xs uppercase tracking-wide text-white/40 font-[JetBrains_Mono,monospace]">Repositorio</span>
								<a
									href={`https://${selectedRow.repository}`}
									target="_blank"
									rel="noreferrer"
									className="text-sm text-[#FF4D00] hover:text-orange-400 transition-colors duration-200 font-[JetBrains_Mono,monospace] break-all"
								>
									{selectedRow.repository}
								</a>
							</div>
							<div className="flex flex-col gap-1.5 rounded-lg border border-gray-800/60 bg-[rgba(11,16,32,0.6)] p-3">
								<span className="text-xs uppercase tracking-wide text-white/40 font-[JetBrains_Mono,monospace]">Estado</span>
								<span className={`inline-flex w-fit rounded-lg border px-2.5 py-1 text-xs font-[JetBrains_Mono,monospace] ${statusClass(selectedRow.status)}`}>
									{selectedRow.status}
								</span>
							</div>
							<div className="flex flex-col gap-1.5 rounded-lg border border-gray-800/60 bg-[rgba(11,16,32,0.6)] p-3">
								<span className="text-xs uppercase tracking-wide text-white/40 font-[JetBrains_Mono,monospace]">Puntaje</span>
								<input
									type="number"
									min={0}
									max={100}
									value={selectedRow.score}
									onChange={(event) => {
										const value = Number(event.target.value);
										if (Number.isNaN(value)) return;
										updateSelectedRow({ score: value });
									}}
									className="w-full rounded-lg border border-gray-800/60 bg-[rgba(11,16,32,0.6)] px-3 py-2 text-sm text-white outline-none transition duration-200 placeholder:text-white/25 focus:ring-2 focus:ring-[rgba(255,77,0,0.6)] focus:border-[rgba(255,77,0,0.4)] font-[JetBrains_Mono,monospace]"
								/>
							</div>
							<div className="flex flex-col gap-1.5 rounded-lg border border-gray-800/60 bg-[rgba(11,16,32,0.6)] p-3">
								<span className="text-xs uppercase tracking-wide text-white/40 font-[JetBrains_Mono,monospace]">Actualización</span>
								<p className="text-sm text-white/50 font-[JetBrains_Mono,monospace]">{selectedRow.updatedAt}</p>
							</div>

							<label className="flex flex-col gap-1.5 rounded-lg border border-gray-800/60 bg-[rgba(11,16,32,0.6)] p-3 md:col-span-2" htmlFor="modal-description">
								<span className="text-xs uppercase tracking-wide text-white/40 font-[JetBrains_Mono,monospace]">Descripción</span>
								<textarea
									id="modal-description"
									value={selectedRow.description}
									onChange={(event) => updateSelectedRow({ description: event.target.value })}
									placeholder="Agrega una descripción para este registro"
									rows={3}
									className="w-full rounded-lg border border-gray-800/60 bg-[rgba(11,16,32,0.6)] px-3 py-2 text-sm text-white outline-none transition duration-200 placeholder:text-white/25 focus:ring-2 focus:ring-[rgba(255,77,0,0.6)] focus:border-[rgba(255,77,0,0.4)] font-[JetBrains_Mono,monospace] resize-none"
								/>
							</label>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
