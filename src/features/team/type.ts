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
