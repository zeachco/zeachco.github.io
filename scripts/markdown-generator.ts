import TurndownService from 'turndown';

export async function generateMarkdown(
  htmlContent: string,
  outputPath: string
): Promise<void> {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
  });

  // Remove print-specific elements
  const cleanedHtml = htmlContent
    .replace(/<[^>]*class="no-print"[^>]*>.*?<\/[^>]*>/gs, '')
    .replace(/<progress[^>]*>.*?<\/progress>/gs, '');

  const markdown = turndown.turndown(cleanedHtml);

  await Bun.write(outputPath, markdown);
}
