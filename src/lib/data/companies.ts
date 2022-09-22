import type { Company } from '$lib/types';

export const companies: Company[] = [
	{
		name: 'Independent game development',
		start: '2004-09',
		end: '2008-06',
		note: `Blitz basic, blitz max, dark basic pro, dark physics for 3d games. JavaScript MySQL and PHP for web games and game web portals.
    `,
	},
	{
		name: 'Tyco fire & security + ADT',
		start: '2006-05',
		end: '2007-08',
		note: `Alarm system support and service dispatch, Alarm monitoring and 911 dispatch. Phone troubleshooting alarm systems and installations.`,
	},
	{
		name: 'Decision One',
		start: '2007-03',
		end: '2008-05',
		note: 'Computer help-desk support and technician dispatch. Support for Solaris servers, Sun Microsystems, Oracle, UAPNapa, American Airlines Saber systems (printers)',
	},
	{
		name: 'Apiken',
		start: '2008-06',
		end: '2011-10',
		note: `Open source technologies and home hosting over linux servers. PHP4, 5, MySQL, Oracle, Python, JQuery, HTML5, Gimp`,
	},
	{
		name: 'Videotron',
		start: '2009-05',
		end: '2011-08',
		note: `Technical support & electronic communications for videotron.com.
    Window and Mac technical support for residential customers
    Phone, cable, digital TV, Internet troubleshooting over phone, mail , and chat
    I managed to analyze the web applications for chat communication
    with customer and optimize it in order to increase operation effectiveness by 20% over more than 200 employees
    `,
	},
	{
		name: 'Vidéotron & Québecor',
		start: '2011-08',
		end: '2013-08',
		note: `
        Enterprise solutions with software AG products (Trading Network, MyWebmethods, Integration Server 6.1 to 8.2)
Environment Support and management (Dev, Test, Acc, Pre-prod, Prod)
Java / C technology integration, with SQL Oracle, Broker, ESB and EAI
Business process design and support
I would like to highlight a tool that I created on my free time at first to administrate and centralize all operations and produce reports on operation activities for TI departments

    `,
	},
	{
		name: 'Staples',
		start: '2009-05',
		end: '2009-09',
		note: 'Computer repair center, troubleshooting with window and Linux personal computers',
	},
	{
		name: 'Rock Plus inc.',
		start: '2008-07',
		end: '2010-03',
		note: `Website development and support. Order management and websites conception PHP development and architect of 2 external websites and internal advanced administrative tool as an independent contractor
    `,
	},
	{
		name: 'Premières Loges & White Label Tickets',
		start: '2013-10',
		end: '2014-09',
		note: `Software development (Java 6-7-8, SWT, Vaadin, GWT) with Spring and Tomcat 5-6-7
        Ticketpro website maintenance (PHP and Java)
        SWT software for ticket selling
        Eclipse, Atom, Sublime Text, NetBeans, KomodoEdit, PyCharm, Git

        Front end development of Festival International d'été de Québec 2013	`,
	},
	{
		name: 'Morgan Stanley',
		start: '2014-10',
		end: '2015-03',
		note: `
        Software development in vanilla javascript compatible with internet explorer 7 and edge browsers.
        Splunk front-end reverse engineering and R&D
        Team support and UX design
        Javascript formation / review of other employee and projects
        Trading certification, Business Process certification, Anti-Corruption certification`,
	},
	{
		name: 'AppDirect',
		start: '2015-03',
		end: '2016-12',
		note: `Whitelabel software marketplace and flexible CMS with Backbone & Marionnette
Served under the Tomcat, Wicket, Spring, Hibernate and MySQL stack
Builded a node.js proxy server and a node.js command line interface to help automation of most tasks in the company. Also worked on a parallel project using angularJS that provides an interface to manage LDAP users, permissions and roles. `,
	},
	{
		name: 'Playtika',
		start: '2017-01',
		end: '2019-11',
		note: `Development of the World Series of Poker game. JavaScript engineering with nodejs, webpack, threejs, React-Redux, pixi.js for canvas rendering, less, sass,three.js, immutable.js. Scrum master, release management, software architecture, build and deployments processes (team city). Enforce code quality and good practices through hand made tailored eslint, typescript and vscode extensions configuration.`,
	},
	{
		name: 'Shopify',
		start: '2019-11',
		end: '2022-11',
		note: `
Senior developer (current employment) Since 2019/11
Development of internal libraries to handle Shopify Payments infinite forms variation including legal, banking, product information, business details and additional owners' information. Wrote, maintained and deployed many tested solutions and participated in training other devs and enforcing good coding practices. Enforcing security and good practice methods around React and NodeJS envs.`,
	},
].map((s) => {
	return {
		...s,
		start: new Date(s.start),
		end: s.end ? new Date(s.end) : undefined,
	};
});
