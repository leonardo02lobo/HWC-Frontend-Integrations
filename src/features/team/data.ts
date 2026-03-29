export interface TeamAction {
	title: string;
	href?: string;
	variant?: "primary" | "ghost";
}

export interface TeamMember {
	name: string;
	username: string;
	role: string;
	status: string;
	initials: string;
	accent?: string;
	actions?: TeamAction[];
}

export interface TeamSection {
	title: string;
	description?: string;
}

export const members: TeamMember[] = [
	{
		name: "Juan Pérez",
		username: "juanperez_dev",
		role: "Capitán / Desarrollador Principal",
		status: "Activo",
		initials: "JP",
		accent: "#FF6A2B",
		actions: [{ title: "Ver Perfil", href: "#juan", variant: "primary" }],
	},
	{
		name: "Maria Garcia",
		username: "mariagarcia_code",
		role: "Programador Backend",
		status: "Activo",
		initials: "MG",
		accent: "#FF8A4C",
		actions: [{ title: "Ver Perfil", href: "#maria", variant: "primary" }],
	},
	{
		name: "Carlos Rodriguez",
		username: "carlosrodriguez_ui",
		role: "Diseñador UI/UX",
		status: "Activo",
		initials: "CR",
		accent: "#FFB04A",
		actions: [{ title: "Ver Perfil", href: "#carlos", variant: "primary" }],
	},
	{
		name: "Pendiente...",
		username: "invitado",
		role: "Invitación Enviada",
		status: "Pendiente de respuesta",
		initials: "?",
		accent: "#D4D4D8",
		actions: [
			{ title: "Reenviar", href: "#reenviar" },
			{ title: "Revocar", href: "#revocar" },
		],
	},
];