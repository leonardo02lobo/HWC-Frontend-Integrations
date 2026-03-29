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

	return (
		<>
			<div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
				<table className="w-full table-fixed border-separate border-spacing-0" aria-label="Tabla de seguimiento del equipo">
					<thead>
						<tr>
							<th className="sticky top-0 z-10 border-b border-white/10 bg-[#101834] px-4 py-3 text-left text-xs uppercase tracking-wide text-white/70">
								ID
							</th>
							<th className="sticky top-0 z-10 border-b border-white/10 bg-[#101834] px-4 py-3 text-left text-xs uppercase tracking-wide text-white/70">
								Miembro
							</th>
							<th className="sticky top-0 z-10 break-all border-b border-white/10 bg-[#101834] px-4 py-3 text-left text-xs uppercase tracking-wide text-white/70">
								Repositorio
							</th>
							<th className="sticky top-0 z-10 border-b border-white/10 bg-[#101834] px-4 py-3 text-left text-xs uppercase tracking-wide text-white/70">
								Estado
							</th>
							<th className="sticky top-0 z-10 border-b border-white/10 bg-[#101834] px-4 py-3 text-left text-xs uppercase tracking-wide text-white/70">
								Puntaje
							</th>
							<th className="sticky top-0 z-10 break-all border-b border-white/10 bg-[#101834] px-4 py-3 text-left text-xs uppercase tracking-wide text-white/70">
								Descripción
							</th>
							<th className="sticky top-0 z-10 border-b border-white/10 bg-[#101834] px-4 py-3 text-left text-xs uppercase tracking-wide text-white/70">
								Última actualización
							</th>
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
								className="cursor-pointer outline-none transition [&:focus-visible>td]:bg-white/10 [&:hover>td]:bg-white/5"
								tabIndex={0}
							>
								<td className="border-b border-white/10 px-4 py-3 text-sm text-white/90">{row.id}</td>
								<td className="border-b border-white/10 px-4 py-3 text-sm text-white/90">{row.teammate}</td>
								<td className="break-all border-b border-white/10 px-4 py-3 text-sm text-white/90">
									<a
										href={`https://${row.repository}`}
										target="_blank"
										rel="noreferrer"
										onClick={(event) => event.stopPropagation()}
										className="text-primary-orange transition hover:text-white"
									>
										{row.repository}
									</a>
								</td>
								<td className="border-b border-white/10 px-4 py-3 text-sm text-white/90">
									<span
										className={[
											"inline-flex rounded-full border px-2 py-1 text-xs",
											row.status === "Aprobado" && "border-primary-orange/50 bg-primary-orange/15 text-primary-orange",
											row.status === "En revisión" && "border-white/25 bg-white/10 text-white",
											row.status === "Pendiente" && "border-white/20 bg-transparent text-white/80",
										]
											.filter(Boolean)
											.join(" ")}
									>
										{row.status}
									</span>
								</td>
								<td className="border-b border-white/10 px-4 py-3 text-sm text-white/90">{row.score}</td>
								<td className="break-all border-b border-white/10 px-4 py-3 text-sm text-white/90">{row.description || "-"}</td>
								<td className="border-b border-white/10 px-4 py-3 text-sm text-white/90">{row.updatedAt}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{selectedRow && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Editar fila">
					<div className="absolute inset-0 bg-[#05070f]/75 backdrop-blur-[2px]" onClick={closeModal}></div>
					<div className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(24,34,66,0.98),rgba(11,16,32,0.99)_58%)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-6">
						<header className="mb-4 flex items-center justify-between gap-3">
							<h3 className="text-lg text-white sm:text-2xl">
								<span className="text-primary-orange">&lt;</span>
								Detalle de registro
								<span className="text-primary-orange">/&gt;</span>
							</h3>
							<button
								type="button"
								onClick={closeModal}
								className="inline-flex rounded-xl border border-white/15 px-3 py-1.5 text-sm text-white/80 transition hover:border-primary-orange/40 hover:text-white"
							>
								Cerrar
							</button>
						</header>

						<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
							<div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
								<span className="text-xs uppercase tracking-wide text-white/55">ID</span>
								<p className="wrap-break-word text-sm text-white">{selectedRow.id}</p>
							</div>
							<div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
								<span className="text-xs uppercase tracking-wide text-white/55">Miembro</span>
								<p className="wrap-break-word text-sm text-white">{selectedRow.teammate}</p>
							</div>
							<div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
								<span className="text-xs uppercase tracking-wide text-white/55">Repositorio</span>
								<p className="wrap-break-word text-sm text-white">{selectedRow.repository}</p>
							</div>
							<div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
								<span className="text-xs uppercase tracking-wide text-white/55">Puntaje</span>
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
									className="w-full rounded-xl border border-white/15 bg-[#0d1428] px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/25"
								/>
							</div>
							<div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
								<span className="text-xs uppercase tracking-wide text-white/55">Última actualización</span>
								<p className="break-words text-sm text-white">{selectedRow.updatedAt}</p>
							</div>

							<div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
								<span className="text-xs uppercase tracking-wide text-white/55">Estado</span>
								<p className="break-words text-sm text-white">{selectedRow.status}</p>
							</div>

							<label className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 md:col-span-2" htmlFor="modal-description">
								<span className="text-xs uppercase tracking-wide text-white/55">Descripción</span>
								<textarea
									id="modal-description"
									value={selectedRow.description}
									onChange={(event) => updateSelectedRow({ description: event.target.value })}
									placeholder="Agrega una descripción para este registro"
									rows={4}
									className="w-full rounded-xl border border-white/15 bg-[#0d1428] px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/25"
								/>
							</label>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
