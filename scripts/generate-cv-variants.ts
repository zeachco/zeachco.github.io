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

  // Warm up the server with a test request to preload fonts/assets
  console.log('Warming up server...');
  try {
    const warmupStart = Date.now();
    await fetch(`${serverUrl}/print?roles=all&headless=true`);
    console.log(`Server warmed up in ${Date.now() - warmupStart}ms`);
    // Give it a moment to settle
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error) {
    console.warn('Warm-up request failed, continuing anyway:', error);
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

    // Generate variants in parallel (smaller batch in CI to avoid overwhelming resources)
    const batchSize = process.env.CI ? 2 : 4;
    const failed: string[] = [];

    for (let i = 0; i < combinations.length; i += batchSize) {
      const batch = combinations.slice(i, i + batchSize);
      console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(combinations.length / batchSize)}...`);

      const results = await Promise.allSettled(batch.map(async (variant) => {
        const filename = variantToFilename(variant);
        const rolesParam = variant.join(',');
        const url = `http://localhost:4173/print?roles=${rolesParam}&headless=true`;

        console.log(`Generating ${filename}...`);

        try {
          // Generate PDF
          await generatePDF(
            url,
            `./build/skills/olivier-rousseau_${filename}.pdf`,
            browser
          );

          // Fetch HTML for Markdown generation (already has headless=true in URL)
          const response = await fetch(url);
          const html = await response.text();

          // Generate Markdown
          await generateMarkdown(
            html,
            `./build/skills/olivier-rousseau_${filename}.md`
          );

          console.log(`✓ ${filename}`);
        } catch (error) {
          console.error(`✗ ${filename}: ${error instanceof Error ? error.message : String(error)}`);
          throw error;
        }
      }));

      // Track failures
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          failed.push(variantToFilename(batch[index]));
        }
      });
    }

    if (failed.length > 0) {
      console.error(`\nFailed to generate ${failed.length} variant(s): ${failed.join(', ')}`);
      throw new Error(`Failed to generate ${failed.length} variant(s)`);
    }
  } finally {
    await browser.close();
  }

  // Kill server
  process.kill(-server.pid!);
  console.log('Done!');
}

main().catch(console.error);
