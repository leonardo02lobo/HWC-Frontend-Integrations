export type TeamRole =
	| "Desarrollador"
	| "Diseñador"
	| "QA Engineer"
	| "Product Manager"
	| "DevOps"
	| "Analista";

export interface MemberAvatar {
	initials: string;
	photo: string;
}

export interface Team {
	id: string;
	initials: string;
	accent: string;
	name: string;
	description: string;
	memberPreview: MemberAvatar[];
	memberOverflow: number;
	memberCount: number;
	repository: { label: string; href: string };
	status: "Activo" | "Pausado" | "Archivado";
	publicId: string;
}

export interface Invitation {
	id: string;
	team: { initials: string; name: string; accent: string };
	invitedBy: string;
	role: TeamRole;
	date: string;
	status: "Pendiente" | "Aceptada" | "Rechazada";
}

export type TeamSection = "teams-list" | "team-detail" | "invitations";

export interface ApiStep {
	n: number;
	label: string;
	method: "GET" | "POST" | "PATCH" | "DELETE";
	path: string;
	target: TeamSection;
}
