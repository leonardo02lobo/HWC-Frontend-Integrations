export interface DashboardRow {
	id: string;
	teammate: string;
	repository: string;
	status: "Pendiente" | "En revisión" | "Aprobado";
	score: number;
	updatedAt: string;
	description: string;
}
