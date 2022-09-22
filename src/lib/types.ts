export const labels = [
	'hobbies',
	'speech',
	'programing',
	'game',
	'hardware',
	'client',
	'server',
	'concept',
	'library',
	'remote',
	'onsite'
] as const;

export type Label = keyof typeof labels;

export interface Company {
	name: string;
	note?: string;
	start: Date;
	end?: Date;
	labels?: string[];
}

export interface Project {
	name: string;
	note?: string;
	company?: Company;
	start: Date;
	end?: Date;
	labels?: string[];
}

export interface PersonalSkill {
	name: string;
	note?: string;
	percent: number;
	projects?: Project;
	start: Date;
	end?: Date;
	labels?: string[];
}

export interface Contact {
	name: string;
	phone: string;
	email: string;
	labels?: string[];
}
