import type { Contact, Skill } from './types';

export const contact: Contact = {
	name: 'Olivier Rousseau-Guyot',
	email: 'zeachco@gmail.com',
	phone: '438-630-0430'
};

export const skills: Skill[] = [
	{
		name: 'Javascript',
		start: new Date('2006-05-15'),
		percent: 99,
		labels: ['programing', 'client', 'server', 'hobbies', 'game'],
		note: "Passionate about quirks of this language since EMScript2, followed the good and bad parts of it's evolution over the years."
	},
	{
		name: 'NodeJS',
		start: new Date('2011-03-01'),
		percent: 80,
		labels: ['programing', 'client', 'server'],
		note: "Although I worked with Rinho engine (Server side javascript) before nodejs existed, I can't say I saw the potential until the javascript had access to system the IO. Since it's part of my dev tools, servers and machine learning tools on a daily basis."
	},
	{
		name: 'PHP',
		percent: 30,
		start: new Date('2004-03'),
		end: new Date('2013-07'),
		note: 'This was my first web language along with cPanel, MySQL and Linux (LAMP stack). Nowadays I use nodejs for my server needs. Mainly worked with versions 4.3..5.3'
	},
	{
		name: 'React',
		percent: 80,
		labels: ['library', 'programing'],
		note: "Most early project were transforming JQuery site into React sites. But along the road I've worked with lots of hybrids Reacts apps that were scoped under Angular, Backbone or vanilla JS. Biggest project were HTML Games, 3D editors (with webGL) and WYSIWYG editors with complex interfaces.",
		start: new Date('2013-08')
	},
	{
		name: 'Vue 2',
		percent: 80,
		labels: ['library', 'programing']
	},
	{
		name: 'Svelte',
		percent: 60,
		note: 'Even though Svelte is very easy to get started with, I still explore gotchas around unsupported stuff and revert to vanilla javascript'
	}
];
