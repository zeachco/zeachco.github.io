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

interface BaseData {
	name: string;
	note?: string;
	start: Date;
	end?: Date;
	span?: string;
	labels?: string[];
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
