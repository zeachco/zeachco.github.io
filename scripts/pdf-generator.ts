import puppeteer, { type Browser } from 'puppeteer';

export async function generatePDF(
  url: string,
  outputPath: string,
  browser?: Browser,
  retries: number = 2
): Promise<void> {
  const browserInstance = browser || await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // Important for CI
    ]
  });

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    let page;
    try {
      if (attempt > 0) {
        console.log(`Retry ${attempt}/${retries} for ${url}`);
      }

      const startTime = Date.now();

      // Create a fresh page for each attempt
      page = await browserInstance.newPage();
      const pageCreated = Date.now();

      // Use domcontentloaded instead of networkidle2 to avoid waiting for print() dialog
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const pageLoaded = Date.now();

      // Wait for the page's onMount animation delay (PAGE_TRANSITION_TIME + 1 = 1001ms)
      // plus extra time for animations to settle
      await new Promise(resolve => setTimeout(resolve, 2000));

      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: false, // Disable backgrounds for clean black/white PDFs
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
      });
      const pdfGenerated = Date.now();

      console.log(`  Timings: page=${pageCreated - startTime}ms, load=${pageLoaded - pageCreated}ms, pdf=${pdfGenerated - pageLoaded}ms, total=${pdfGenerated - startTime}ms`);

      await page.close();

      if (!browser) {
        await browserInstance.close();
      }
      return; // Success
    } catch (error) {
      lastError = error as Error;

      // Ensure page is closed even on error
      if (page) {
        try {
          await page.close();
        } catch (closeError) {
          console.error('Failed to close page:', closeError);
        }
      }

      if (attempt < retries) {
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  if (!browser) {
    try {
      await browserInstance.close();
    } catch (closeError) {
      console.error('Failed to close browser:', closeError);
    }
  }

  throw lastError;
}
