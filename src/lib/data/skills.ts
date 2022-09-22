import type { PersonalSkill } from '$lib/types';

export const skills: PersonalSkill[] = [
	{
		name: 'Javascript',
		start: '2006-05-15',
		percent: 99,
		labels: ['programing', 'client', 'server', 'hobbies', 'game'],
		note: "Passionate about quirks of this language since EMScript2, followed the good and bad parts of it's evolution over the years.",
	},
	{
		name: 'NodeJS',
		start: '2011-03-01',
		percent: 80,
		labels: ['programing', 'client', 'server'],
		note: "Although I worked with Rinho engine (Server side javascript) before nodejs existed, I can't say I saw the potential until the javascript had access to system the IO. Since it's part of my dev tools, servers and machine learning tools on a daily basis.",
	},
	{
		name: 'PHP',
		percent: 30,
		start: '2004-03',
		end: '2013-07',
		note: 'This was my first web language along with cPanel, MySQL and Linux (LAMP stack). Nowadays I use nodejs for my server needs. Mainly worked with versions 4.x .. 5.3',
	},
	{
		name: 'React',
		percent: 90,
		labels: ['library', 'programing'],
		note: "Most early project were transforming JQuery site into React sites. But along the road I've worked with lots of hybrids Reacts apps that were scoped under Angular, Backbone or vanilla JS. Biggest project were HTML Games, 3D editors (with webGL) and WYSIWYG editors with complex interfaces.",
		start: '2013-08',
	},
	{
		name: 'Vue',
		percent: 30,
		labels: ['library', 'programing'],
		start: '2018',
		end: '2020',
	},
	{
		name: 'AngularJS',
		percent: 99,
		labels: ['library', 'programing'],
		start: '2011',
		end: '2016',
		note: 'Worked on the original Angular library before it refactored into Angular 2. Quick app developments and refactoring existing ones with technical debts accumulated because it was the next jQuery back then',
	},
	{
		name: 'JQuery',
		percent: 99,
		labels: ['library', 'programing'],
		start: '2008',
		end: '2018',
		note: 'Maintaining old apps built with jQuery and converting them into more scalable frameworks or libraries',
	},
	{
		name: 'Svelte',
		percent: 60,
		note: 'Even though Svelte is very easy to get started with, I still explore gotchas around unsupported stuff and revert to vanilla javascript',
		start: '2020',
	},
	{
		name: 'Basic',
		percent: 80,
		note: 'Started of TI-83 devices making videos games at school for other students. Followed up quickly with the equivalent on PC',
		start: '2003-05',
		end: '2007-03',
	},
	{
		name: 'Debian systems',
		percent: 90,
		note: 'Primary OS at home for work, games, servers, devops, medias and personal life, first tryied it out when Windows Vista was announced. Quite functional with WLS nowadays',
		start: '2007-05',
	},
	{
		name: 'Ruby on Rails',
		percent: 30,
		start: '2019-08',
	},
].map((s) => {
	return {
		...s,
		start: new Date(s.start),
		end: s.end ? new Date(s.end) : new Date(),
	};
});
