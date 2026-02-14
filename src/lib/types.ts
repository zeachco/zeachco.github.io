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
	'onsite',
] as const;

export const roles = ['frontend', 'backend', 'techlead', 'management'] as const;

export type Role = typeof roles[number];

interface BaseData {
	name: string;
	note?: string;
	start: Date;
	end?: Date;
	span?: string;
	labels?: string[];
	score: Record<Role, number>;
}

export type Label = keyof typeof labels;

export interface CompanyData extends BaseData {
	role?: string;
}

export interface ProjectData extends BaseData {
	company?: CompanyData;
}

export interface SkillData extends BaseData {
	percent: number;
	softskill?: boolean;
	peak_date?: Date;
	projects?: ProjectData;
}

export interface TrainingData extends BaseData {
	language?: string;
}

export interface Contact {
	name: string;
	phone: string;
	email: string;
	labels?: string[];
}
