import { generateCombinations, variantToFilename } from './variant-combinations';
import { generatePDF } from './pdf-generator';
import { generateMarkdown } from './markdown-generator';
import { spawn } from 'child_process';
import { mkdir } from 'fs/promises';

async function main() {
  // Create output directory
  await mkdir('./build/skills', { recursive: true });

  // Start preview server
  console.log('Starting preview server...');
  const server = spawn('bun', ['run', 'preview'], { detached: true });
  await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for server

  const combinations = generateCombinations();
  console.log(`Generating ${combinations.length} variants...`);

  // Generate variants in parallel (4 at a time to avoid overwhelming CI)
  const batchSize = 4;
  for (let i = 0; i < combinations.length; i += batchSize) {
    const batch = combinations.slice(i, i + batchSize);

    await Promise.all(batch.map(async (variant) => {
      const filename = variantToFilename(variant);
      const rolesParam = variant.join(',');
      const url = `http://localhost:4173/print?roles=${rolesParam}`;

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
    }));
  }

  // Kill server
  process.kill(-server.pid!);
  console.log('Done!');
}

main().catch(console.error);
