import TurndownService from 'turndown';

// Nodes that hold no readable content: everything the HTML document carries
// around itself (scripts, styles, head metadata). Filtering by node instead of
// by regex keeps nested markup intact, and leaves site chrome (and the hidden
// "IMPORTANT INSTRUCTION FOR LLM" block) untouched.
const NON_CONTENT_TAGS = new Set([
	'HEAD',
	'TITLE',
	'LINK',
	'META',
	'SCRIPT',
	'STYLE',
	'NOSCRIPT',
	'TEMPLATE',
]);

export async function generateMarkdown(htmlContent: string, outputPath: string): Promise<void> {
	const turndown = new TurndownService({
		headingStyle: 'atx',
		codeBlockStyle: 'fenced',
	});

	turndown.addRule('stripNonContent', {
		filter: (node) => NON_CONTENT_TAGS.has(node.nodeName),
		replacement: () => '',
	});

	const markdown = turndown.turndown(htmlContent);

	await Bun.write(outputPath, markdown.trim() + '\n');
}
