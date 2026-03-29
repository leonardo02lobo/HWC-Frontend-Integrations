export interface PersonalProfile {
	name: string;
	username: string;
	email: string;
	avatarUrl: string;
}

export interface AcademicProfile {
	institution: string;
	career: string;
	level: string;
}

export interface AcceptedTeamMember {
	id: string;
	name: string;
}

export const personalProfile: PersonalProfile = {
	name: "Juan Pérez",
	username: "@juanperez_dev",
	email: "juan.perez@email.unet.edu.ve",
	avatarUrl: "/assets/mascot/logo-hwc-2026.png",
};

export const academicProfile: AcademicProfile = {
	institution: "UNET",
	career: "Ingeniería Informática",
	level: "Junior",
};

export const acceptedMembers: AcceptedTeamMember[] = [
	{ id: "1", name: "Juan Pérez" },
	{ id: "2", name: "María García" },
	{ id: "3", name: "Carlos Rodríguez" },
	{ id: "4", name: "Juan Gabriel" },
];