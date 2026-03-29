export interface DashboardRow {
	id: string;
	teammate: string;
	repository: string;
	status: "Pendiente" | "En revisión" | "Aprobado";
	score: number;
	updatedAt: string;
	description: string;
}

export const rows: DashboardRow[] = [
	{
		id: "01",
		teammate: "Juan Pérez",
		repository: "github.com/hwc/team-alpha",
		status: "Aprobado",
		score: 98,
		updatedAt: "24 Mar 2026",
		description: "Excelente estructura y documentación.",
	},
	{
		id: "02",
		teammate: "María García",
		repository: "github.com/hwc/team-alpha-api",
		status: "En revisión",
		score: 84,
		updatedAt: "23 Mar 2026",
		description: "Falta validar cobertura de pruebas.",
	},
	{
		id: "03",
		teammate: "Carlos Rodríguez",
		repository: "github.com/hwc/team-alpha-ui",
		status: "Pendiente",
		score: 72,
		updatedAt: "22 Mar 2026",
		description: "",
	},
];