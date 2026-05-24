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

const photo = (n: number) => `https://i.pravatar.cc/80?img=${n}`;

export const teams: Team[] = [
	{
		id: "fe",
		initials: "FE",
		accent: "#A78BFA",
		name: "Frontend Team",
		description: "Desarrollo frontend",
		memberPreview: [
			{ initials: "JP", photo: photo(11) },
			{ initials: "MG", photo: photo(12) },
			{ initials: "CR", photo: photo(13) },
		],
		memberOverflow: 5,
		memberCount: 8,
		repository: { label: "github.com/org/frontend", href: "https://github.com/org/frontend" },
		status: "Activo",
		publicId: "64f5a1b2c3d4e5f678901234",
	},
	{
		id: "be",
		initials: "BE",
		accent: "#60A5FA",
		name: "Backend Team",
		description: "Desarrollo backend",
		memberPreview: [
			{ initials: "AT", photo: photo(14) },
			{ initials: "LS", photo: photo(15) },
			{ initials: "DM", photo: photo(16) },
		],
		memberOverflow: 4,
		memberCount: 7,
		repository: { label: "github.com/org/backend", href: "https://github.com/org/backend" },
		status: "Activo",
		publicId: "8ab12cde3f4567890abcdef1",
	},
	{
		id: "qa",
		initials: "QA",
		accent: "#FBBF24",
		name: "QA Team",
		description: "Pruebas y calidad",
		memberPreview: [
			{ initials: "PR", photo: photo(17) },
			{ initials: "EM", photo: photo(18) },
			{ initials: "RG", photo: photo(19) },
		],
		memberOverflow: 3,
		memberCount: 6,
		repository: { label: "github.com/org/qa", href: "https://github.com/org/qa" },
		status: "Activo",
		publicId: "1cd34ef5a678901bcd23ef45",
	},
	{
		id: "ds",
		initials: "DS",
		accent: "#F472B6",
		name: "Data Science",
		description: "Ciencia de datos",
		memberPreview: [
			{ initials: "VL", photo: photo(20) },
			{ initials: "AN", photo: photo(21) },
			{ initials: "TM", photo: photo(22) },
		],
		memberOverflow: 3,
		memberCount: 6,
		repository: { label: "github.com/org/data", href: "https://github.com/org/data" },
		status: "Activo",
		publicId: "9ef01a2b3c45678def901234",
	},
	{
		id: "devops",
		initials: "DEV",
		accent: "#34D399",
		name: "DevOps Team",
		description: "Infraestructura y DevOps",
		memberPreview: [
			{ initials: "HG", photo: photo(23) },
			{ initials: "IL", photo: photo(24) },
			{ initials: "ON", photo: photo(25) },
		],
		memberOverflow: 4,
		memberCount: 7,
		repository: { label: "github.com/org/devops", href: "https://github.com/org/devops" },
		status: "Activo",
		publicId: "2bc34de5f6789012345678ab",
	},
	{
		id: "pm",
		initials: "PM",
		accent: "#22D3EE",
		name: "Product Team",
		description: "Gestión de producto",
		memberPreview: [
			{ initials: "FL", photo: photo(26) },
			{ initials: "KO", photo: photo(27) },
			{ initials: "BN", photo: photo(28) },
		],
		memberOverflow: 2,
		memberCount: 5,
		repository: { label: "github.com/org/product", href: "https://github.com/org/product" },
		status: "Activo",
		publicId: "5fa67bc89d0123456789efab",
	},
	{
		id: "mk",
		initials: "MK",
		accent: "#FB923C",
		name: "Marketing Team",
		description: "Marketing y contenido",
		memberPreview: [
			{ initials: "ZP", photo: photo(29) },
			{ initials: "QR", photo: photo(30) },
			{ initials: "ST", photo: photo(31) },
		],
		memberOverflow: 2,
		memberCount: 5,
		repository: { label: "github.com/org/marketing", href: "https://github.com/org/marketing" },
		status: "Activo",
		publicId: "7cd89ef0a1234567890abcde",
	},
];

export const selectedTeamId = "fe";

export const selectedTeamMembersPreview: MemberAvatar[] = [
	{ initials: "JP", photo: photo(11) },
	{ initials: "MG", photo: photo(12) },
	{ initials: "CR", photo: photo(13) },
	{ initials: "AT", photo: photo(32) },
	{ initials: "LS", photo: photo(33) },
	{ initials: "JG", photo: photo(34) },
];

export const selectedTeamMembersOverflow = 2;

export const invitationsReceived: Invitation[] = [
	{
		id: "i1",
		team: { initials: "BE", name: "Backend Team", accent: "#60A5FA" },
		invitedBy: "María García",
		role: "Desarrollador",
		date: "15/05/2024",
		status: "Pendiente",
	},
	{
		id: "i2",
		team: { initials: "DS", name: "Data Science", accent: "#F472B6" },
		invitedBy: "Carlos Rodríguez",
		role: "Analista",
		date: "14/05/2024",
		status: "Pendiente",
	},
	{
		id: "i3",
		team: { initials: "QA", name: "QA Team", accent: "#FBBF24" },
		invitedBy: "Juan Pérez",
		role: "QA Engineer",
		date: "12/05/2024",
		status: "Pendiente",
	},
];

export const apiFlow: ApiStep[] = [
	{ n: 1, label: "Ver todos los equipos:", method: "GET", path: "/teams", target: "teams-list" },
	{ n: 2, label: "Crear equipo:", method: "POST", path: "/teams", target: "team-detail" },
	{ n: 3, label: "Ver detalle de equipo:", method: "GET", path: "/teams/me/{team_id}", target: "team-detail" },
	{ n: 4, label: "Actualizar repositorio:", method: "PATCH", path: "/teams/me/repository-link", target: "team-detail" },
	{ n: 5, label: "Invitar miembros:", method: "POST", path: "/teams/invitations", target: "team-detail" },
	{ n: 6, label: "Ver invitaciones recibidas:", method: "GET", path: "/teams/invitations/me", target: "invitations" },
	{ n: 7, label: "Aceptar invitación:", method: "POST", path: "/teams/invitations/{id}/accept", target: "invitations" },
	{ n: 8, label: "Rechazar invitación:", method: "DELETE", path: "/teams/invitations/{id}", target: "invitations" },
];
