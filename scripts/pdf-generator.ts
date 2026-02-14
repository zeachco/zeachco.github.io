import puppeteer, { type Browser } from 'puppeteer';

export async function generatePDF(
  url: string,
  outputPath: string,
  browser?: Browser
): Promise<void> {
  const browserInstance = browser || await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // Important for CI
    ]
  });

  try {
    const page = await browserInstance.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

      // Let animations settle (using promise-based delay)
      await new Promise(resolve => setTimeout(resolve, 1500));

      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: false, // Disable backgrounds for clean black/white PDFs
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
      });
    } finally {
      await page.close();
    }
  } finally {
    if (!browser) {
      await browserInstance.close();
    }
  }
}
