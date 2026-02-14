import type { TrainingData } from '$lib/types';

export const trainings: TrainingData[] = ([
	{
		name: 'Cégep Édouard-Montpetit Micro-edition and hypermedia',
		start: '2005-08',
		end: '2007-01',
		notes:
			'Advanced use of Word, Excel, Access, Adobe photoshop, Web design and JavaScript initiation',
	},
	{
		name: 'Certification in Entrepreneurship',
		start: '2012',
		end: '2013',
		notes:
			'Business plan and financial training, Resources management training, Business marketing anticipation training, Social networks marketing',
	},
	{
		name: 'Tyco Fire & Security Electronic training',
		start: '2006',
		end: '2007',
		notes:
			'Identify all alarm system internal components, Electric security and distress situation management',
	},
	{ name: 'W3C PHP', start: '2007', end: '2008' },
	{ name: 'W3C Javascript', start: '2007', end: '2008' },
	{ name: 'Google analytics API', start: '2008', end: '2009' },
	{ name: 'W3C HTML5', start: '2009', end: '2010' },
	{ name: 'Open GL ES 2.0', start: '2010', end: '2011' },
	{ name: 'Khronos WebGL 1.0 specification', start: '2011', end: '2012' },
] as any[]).map((s) => ({ ...s, start: new Date(s.start), end: new Date(s.end) })) as any as TrainingData[];
