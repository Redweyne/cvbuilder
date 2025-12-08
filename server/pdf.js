import { chromium } from 'playwright';

let browserInstance = null;

async function getBrowser() {
  if (!browserInstance) {
    browserInstance = await chromium.launch({
      headless: true,
      executablePath: '/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
  }
  return browserInstance;
}

export async function generateCVPdf(cvData, templateId = 'professional', baseUrl = 'http://localhost:5000') {
  let browser = null;
  let context = null;
  let page = null;
  
  try {
    browser = await getBrowser();
    context = await browser.newContext({
      viewport: {
        width: 794,
        height: 2000
      },
      deviceScaleFactor: 2
    });
    page = await context.newPage();
    
    const encodedData = encodeURIComponent(JSON.stringify(cvData));
    const exportUrl = `${baseUrl}/cv-export?template=${templateId}&data=${encodedData}`;
    
    console.log('Navigating to export URL...');
    
    await page.goto(exportUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    await page.waitForSelector('#cv-export-container', { timeout: 10000 });
    
    await page.evaluate(() => document.fonts.ready);
    
    await page.waitForTimeout(500);
    
    const contentHeight = await page.evaluate(() => {
      const container = document.getElementById('cv-export-container');
      return container ? container.scrollHeight : 1123;
    });
    
    if (contentHeight > 2000) {
      await page.setViewportSize({ width: 794, height: contentHeight + 100 });
      await page.waitForTimeout(200);
    }
    
    console.log('Generating PDF...');
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0'
      },
      scale: 1
    });
    
    console.log('PDF generated successfully');
    
    return pdfBuffer;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  } finally {
    if (page) await page.close().catch(() => {});
    if (context) await context.close().catch(() => {});
  }
}

export async function generateCoverLetterPdf(coverLetterContent, applicantName) {
  let browser = null;
  let context = null;
  let page = null;
  
  try {
    browser = await getBrowser();
    context = await browser.newContext({
      viewport: { width: 794, height: 1123 },
      deviceScaleFactor: 2
    });
    page = await context.newPage();
    
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
    
    await page.setContent(html, { waitUntil: 'networkidle' });
    
    await page.evaluate(() => document.fonts.ready);
    
    await page.waitForTimeout(500);
    
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
  } catch (error) {
    console.error('Cover letter PDF generation error:', error);
    throw error;
  } finally {
    if (page) await page.close().catch(() => {});
    if (context) await context.close().catch(() => {});
  }
}

export async function generateDesignPdf(elements, name, width = 794, height = 1123) {
  let browser = null;
  let context = null;
  let page = null;
  
  try {
    browser = await getBrowser();
    context = await browser.newContext({
      viewport: { width: 794, height: 1123 },
      deviceScaleFactor: 2
    });
    page = await context.newPage();
    
    const renderElement = (el) => {
      const style = el.style || {};
      let css = `
        position: absolute;
        left: ${el.x}px;
        top: ${el.y}px;
        width: ${el.width}px;
        height: ${el.height}px;
      `;
      
      if (el.type === 'text') {
        css += `
          font-size: ${style.fontSize || 14}px;
          font-family: ${style.fontFamily || 'Inter'}, sans-serif;
          font-weight: ${style.fontWeight || 'normal'};
          font-style: ${style.fontStyle || 'normal'};
          color: ${style.color || '#1e293b'};
          text-align: ${style.textAlign || 'left'};
          background-color: ${style.backgroundColor || 'transparent'};
          padding: ${style.padding || 0}px;
          white-space: pre-wrap;
          word-wrap: break-word;
        `;
        return `<div style="${css}">${(el.content || '').replace(/\n/g, '<br>')}</div>`;
      } else if (el.type === 'shape') {
        css += `
          background-color: ${style.backgroundColor || '#6366f1'};
          border-radius: ${style.borderRadius || 0}px;
        `;
        return `<div style="${css}"></div>`;
      } else if (el.type === 'line') {
        css += `
          background-color: ${style.color || '#e2e8f0'};
        `;
        return `<div style="${css}"></div>`;
      }
      return '';
    };
    
    const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    const elementsHtml = sortedElements.map(renderElement).join('');
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Georgia&family=Helvetica&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            margin: 0; 
            padding: 0;
            background: white;
          }
          .canvas {
            position: relative;
            width: 794px;
            height: 1123px;
            background: white;
          }
        </style>
      </head>
      <body>
        <div class="canvas">
          ${elementsHtml}
        </div>
      </body>
      </html>
    `;
    
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    
    return pdfBuffer;
  } catch (error) {
    console.error('Design PDF generation error:', error);
    throw error;
  } finally {
    if (page) await page.close().catch(() => {});
    if (context) await context.close().catch(() => {});
  }
}

process.on('exit', async () => {
  if (browserInstance) {
    await browserInstance.close();
  }
});

process.on('SIGTERM', async () => {
  if (browserInstance) {
    await browserInstance.close();
  }
  process.exit(0);
});
