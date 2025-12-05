import puppeteer from 'puppeteer';

let browserInstance = null;

async function getBrowser() {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: true,
      executablePath: process.env.CHROMIUM_PATH || '/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--single-process',
        '--font-render-hinting=none'
      ]
    });
  }
  return browserInstance;
}

export async function generateCVPdf(cvData, templateId = 'professional', baseUrl = 'http://localhost:5000') {
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  try {
    const encodedData = encodeURIComponent(JSON.stringify(cvData));
    const exportUrl = `${baseUrl}/cv-export?template=${templateId}&data=${encodedData}`;
    
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2
    });
    
    await page.goto(exportUrl, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });
    
    await page.waitForSelector('#cv-export-container', { timeout: 15000 });
    
    await page.evaluate(() => {
      return document.fonts.ready;
    });
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0'
      },
      preferCSSPageSize: true,
      scale: 1
    });
    
    return pdfBuffer;
  } finally {
    await page.close();
  }
}

export async function generateCoverLetterPdf(coverLetterContent, applicantName) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  try {
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Inter', 'Georgia', 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #333;
            padding: 60px;
          }
          .date {
            color: #666;
            margin-bottom: 40px;
          }
          .content {
            margin-bottom: 40px;
          }
          .content p {
            margin-bottom: 16px;
            text-align: justify;
          }
          .closing {
            margin-top: 30px;
          }
          .signature {
            margin-top: 30px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="date">${today}</div>
        <div class="content">
          ${coverLetterContent.split('\n\n').map(p => `<p>${p}</p>`).join('')}
        </div>
        <div class="closing">Sincerely,</div>
        <div class="signature">${applicantName || ''}</div>
      </body>
      </html>
    `;
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    await page.evaluate(() => {
      return document.fonts.ready;
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0'
      }
    });
    
    return pdfBuffer;
  } finally {
    await page.close();
  }
}

process.on('exit', async () => {
  if (browserInstance) {
    await browserInstance.close();
  }
});
