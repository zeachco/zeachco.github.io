export type Label =
	| 'hobbies'
	| 'speech'
	| 'programing'
	| 'game'
	| 'hardware'
	| 'client'
	| 'server'
	| 'concept'
	| 'library';

export interface Company {
	name: string;
	start: Date;
	end: Date;
	note?: string;
}

export interface Project {
	name: string;
	company: Company;
	start: Date;
	end: Date;
	note?: string;
}

export interface Skill {
	name: string;
	percent: number;
	projects?: Project;
	start?: Date;
	end?: Date;
	labels?: Label[];
	versionMin?: string;
	versionMax?: string;
	note?: string;
}

export interface Contact {
	name: string;
	phone: string;
	email: string;
}
