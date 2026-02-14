import { generateCombinations, variantToFilename } from './variant-combinations';
import puppeteer from 'puppeteer';
import { generatePDF } from './pdf-generator';
import { generateMarkdown } from './markdown-generator';
import { spawn } from 'child_process';
import { mkdir } from 'fs/promises';

async function main() {
  // Create output directory
  await mkdir('./build/skills', { recursive: true });

  // Start preview server
  console.log('Starting preview server...');
  const server = spawn('bun', ['run', 'preview'], { detached: true, stdio: 'ignore' });

  // Wait for server to be ready (up to 30 seconds)
  const serverUrl = 'http://localhost:4173';
  for (let i = 0; i < 30; i++) {
    try {
      await fetch(serverUrl);
      console.log('Server is ready');
      break;
    } catch {
      if (i === 29) throw new Error('Server failed to start within 30 seconds');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Launch browser once
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // Important for CI
    ]
  });

  try {
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
          `./build/skills/olivier-rousseau_${filename}.pdf`,
          browser
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
  } finally {
    await browser.close();
  }

  // Kill server
  process.kill(-server.pid!);
  console.log('Done!');
}

main().catch(console.error);
