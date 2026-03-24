import { useMemo, useState } from "react";
import type { DashboardRow } from "../type";

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
			<div className="table-dashboard-shell__table-wrap">
				<table className="table-dashboard-table" aria-label="Tabla de seguimiento del equipo">
					<thead>
						<tr>
							<th>ID</th>
							<th>Miembro</th>
							<th>Repositorio</th>
							<th>Estado</th>
							<th>Puntaje</th>
							<th>Descripción</th>
							<th>Última actualización</th>
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
								className="table-dashboard-table__row"
								tabIndex={0}
							>
								<td>{row.id}</td>
								<td>{row.teammate}</td>
								<td>
									<a
										href={`https://${row.repository}`}
										target="_blank"
										rel="noreferrer"
										onClick={(event) => event.stopPropagation()}
									>
										{row.repository}
									</a>
								</td>
								<td>
									<span
										className={[
											"table-dashboard-table__status",
											row.status === "Aprobado" && "table-dashboard-table__status--approved",
											row.status === "En revisión" && "table-dashboard-table__status--review",
											row.status === "Pendiente" && "table-dashboard-table__status--pending",
										]
											.filter(Boolean)
											.join(" ")}
									>
										{row.status}
									</span>
								</td>
								<td>{row.score}</td>
								<td>{row.description || "-"}</td>
								<td>{row.updatedAt}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{selectedRow && (
				<div className="table-dashboard-modal" role="dialog" aria-modal="true" aria-label="Editar fila">
					<div className="table-dashboard-modal__backdrop" onClick={closeModal}></div>
					<div className="table-dashboard-modal__card">
						<header className="table-dashboard-modal__header">
							<h3>
								<span className="text-primary-orange">&lt;</span>
								Detalle de registro
								<span className="text-primary-orange">/&gt;</span>
							</h3>
							<button type="button" onClick={closeModal} className="table-dashboard-modal__close">
								Cerrar
							</button>
						</header>

						<div className="table-dashboard-modal__grid">
							<div className="table-dashboard-modal__field">
								<span>ID</span>
								<p>{selectedRow.id}</p>
							</div>
							<div className="table-dashboard-modal__field">
								<span>Miembro</span>
								<p>{selectedRow.teammate}</p>
							</div>
							<div className="table-dashboard-modal__field">
								<span>Repositorio</span>
								<p>{selectedRow.repository}</p>
							</div>
							<div className="table-dashboard-modal__field">
								<span>Puntaje</span>
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
								/>
							</div>
							<div className="table-dashboard-modal__field">
								<span>Última actualización</span>
								<p>{selectedRow.updatedAt}</p>
							</div>

							<div className="table-dashboard-modal__field">
								<span>Estado</span>
								<p>{selectedRow.status}</p>
							</div>

							<label className="table-dashboard-modal__field table-dashboard-modal__field--full" htmlFor="modal-description">
								<span>Descripción</span>
								<textarea
									id="modal-description"
									value={selectedRow.description}
									onChange={(event) => updateSelectedRow({ description: event.target.value })}
									placeholder="Agrega una descripción para este registro"
									rows={4}
								/>
							</label>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
