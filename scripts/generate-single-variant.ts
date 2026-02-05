import { generatePDF } from './pdf-generator';
import { generateMarkdown } from './markdown-generator';
import { mkdir } from 'fs/promises';

async function main() {
  const roles = process.argv[2] || '';
  const filename = process.argv[3];

  if (!filename) {
    console.error('Usage: bun run scripts/generate-single-variant.ts <roles> <filename>');
    process.exit(1);
  }

  // Create output directory
  await mkdir('./build/skills', { recursive: true });

  const url = `http://localhost:4173/print${roles ? `?roles=${roles}` : ''}`;

  console.log(`Generating ${filename}...`);

  // Generate PDF
  await generatePDF(
    url,
    `./build/skills/olivier-rousseau_${filename}.pdf`
  );

  // Fetch HTML for Markdown generation
  const response = await fetch(url);
  const html = await response.text();

  // Generate Markdown
  await generateMarkdown(
    html,
    `./build/skills/olivier-rousseau_${filename}.md`
  );

  console.log(`✓ ${filename}`);
}

main().catch(console.error);
