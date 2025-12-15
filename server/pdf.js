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

export async function generateDesignPdf(elements, name, width = 794, height = 1123, options = {}) {
  let browser = null;
  let context = null;
  let page = null;
  
  const dpi = options.dpi || 2;
  
  try {
    browser = await getBrowser();
    context = await browser.newContext({
      viewport: { width: 794, height: 1123 },
      deviceScaleFactor: dpi
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
        z-index: ${el.zIndex || 0};
      `;
      
      if (el.type === 'text') {
        css += `
          font-size: ${style.fontSize || 14}px;
          font-family: ${style.fontFamily || 'Inter'}, sans-serif;
          font-weight: ${style.fontWeight || 'normal'};
          font-style: ${style.fontStyle || 'normal'};
          color: ${style.color || '#1e293b'};
          text-align: ${style.textAlign || 'left'};
          background: ${style.backgroundColor || 'transparent'};
          padding: ${style.padding || 0}px;
          border-radius: ${style.borderRadius || 0}px;
          white-space: pre-wrap;
          word-wrap: break-word;
          line-height: 1.4;
          letter-spacing: ${style.letterSpacing || 'normal'};
        `;
        return `<div style="${css}">${(el.content || '').replace(/\n/g, '<br>')}</div>`;
      } else if (el.type === 'shape') {
        css += `
          background: ${style.backgroundColor || '#6366f1'};
          border-radius: ${style.borderRadius || 0}px;
        `;
        return `<div style="${css}"></div>`;
      } else if (el.type === 'line') {
        css += `
          background-color: ${style.color || '#e2e8f0'};
        `;
        return `<div style="${css}"></div>`;
      } else if (el.type === 'divider') {
        const dividerStyle = el.dividerStyle || 'solid';
        const thickness = el.thickness || 2;
        const color = style.color || '#e2e8f0';
        
        if (dividerStyle === 'zigzag' || dividerStyle === 'wave' || dividerStyle === 'ornate') {
          const svgPath = dividerStyle === 'zigzag' 
            ? `<path d="M0,${thickness} L10,0 L20,${thickness} L30,0 L40,${thickness} L50,0 L60,${thickness} L70,0 L80,${thickness} L90,0 L100,${thickness}" stroke="${color}" stroke-width="${thickness}" fill="none"/>`
            : dividerStyle === 'wave'
            ? `<path d="M0,${thickness/2} Q5,0 10,${thickness/2} T20,${thickness/2} T30,${thickness/2} T40,${thickness/2} T50,${thickness/2} T60,${thickness/2} T70,${thickness/2} T80,${thickness/2} T90,${thickness/2} T100,${thickness/2}" stroke="${color}" stroke-width="${thickness}" fill="none"/>`
            : `<circle cx="50" cy="${thickness/2}" r="${thickness}" fill="${color}"/>`;
          return `<div style="${css}"><svg width="100%" height="100%" viewBox="0 0 100 ${thickness*2}" preserveAspectRatio="none">${svgPath}</svg></div>`;
        }
        
        let borderStyle = 'solid';
        if (dividerStyle === 'dashed') borderStyle = 'dashed';
        if (dividerStyle === 'dotted') borderStyle = 'dotted';
        if (dividerStyle === 'double') borderStyle = 'double';
        
        css += `
          display: flex;
          align-items: center;
        `;
        return `<div style="${css}"><div style="width: 100%; height: ${thickness}px; border-top: ${thickness}px ${borderStyle} ${color};"></div></div>`;
      } else if (el.type === 'icon') {
        css += `
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${style.backgroundColor || 'transparent'};
          border-radius: ${style.borderRadius || 0}px;
          color: ${style.color || '#1e293b'};
        `;
        return `<div style="${css}"><span style="font-size: ${Math.min(el.width, el.height) * 0.6}px;">●</span></div>`;
      } else if (el.type === 'progressBar') {
        const progress = el.progress || 75;
        const bgColor = style.backgroundColor || '#e2e8f0';
        const progressColor = style.progressColor || '#6366f1';
        const borderRadius = style.borderRadius || 10;
        const showLabel = style.showLabel !== false;
        const showPercentage = style.showPercentage !== false;
        const label = el.label || '';
        
        let html = `<div style="${css}; display: flex; flex-direction: column; justify-content: center;">`;
        if (showLabel && label) {
          html += `<div style="display: flex; justify-content: space-between; font-size: ${style.labelFontSize || 12}px; color: ${style.labelColor || '#1e293b'}; margin-bottom: 4px;"><span>${label}</span>${showPercentage ? `<span>${progress}%</span>` : ''}</div>`;
        }
        html += `<div style="width: 100%; background: ${bgColor}; border-radius: ${borderRadius}px; overflow: hidden; height: ${showLabel ? 'calc(100% - 20px)' : '100%'};">`;
        html += `<div style="width: ${progress}%; height: 100%; background: ${progressColor}; border-radius: ${borderRadius}px;"></div>`;
        html += `</div></div>`;
        return html;
      } else if (el.type === 'photoPlaceholder') {
        const maskShape = el.maskShape || 'circle';
        const borderWidth = style.borderWidth || 0;
        const borderColor = style.borderColor || '#e2e8f0';
        const bgColor = style.backgroundColor || '#f1f5f9';
        
        let clipPath = 'none';
        let borderRadius = '0';
        if (maskShape === 'circle') {
          borderRadius = '50%';
        } else if (maskShape === 'rounded') {
          borderRadius = '12px';
        } else if (maskShape === 'hexagon') {
          clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
        } else if (maskShape === 'oval') {
          borderRadius = '50%';
        }
        
        css += `
          background: ${el.photoUrl ? `url(${el.photoUrl}) center/cover` : bgColor};
          border-radius: ${borderRadius};
          border: ${borderWidth}px solid ${borderColor};
          clip-path: ${clipPath};
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        return `<div style="${css}">${!el.photoUrl ? '<span style="font-size: 24px; color: #94a3b8;">📷</span>' : ''}</div>`;
      } else if (el.type === 'advancedShape') {
        const shapeType = el.shapeType || 'rectangle';
        const bgColor = style.backgroundColor || '#6366f1';
        const borderRadius = style.borderRadius || 0;
        const borderWidth = style.borderWidth || 0;
        const borderColor = style.borderColor || '#e2e8f0';
        
        if (['rectangle', 'circle', 'pill', 'rounded'].includes(shapeType)) {
          let radius = borderRadius;
          if (shapeType === 'circle') radius = '50%';
          if (shapeType === 'pill') radius = `${Math.min(el.width, el.height) / 2}px`;
          if (shapeType === 'rounded') radius = '12px';
          
          css += `
            background: ${bgColor};
            border-radius: ${radius};
            border: ${borderWidth}px solid ${borderColor};
          `;
          return `<div style="${css}"></div>`;
        }
        
        const shapePaths = {
          triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          pentagon: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
          octagon: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
          star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          heart: 'none',
          'arrow-right': 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
          'arrow-left': 'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)',
          'arrow-up': 'polygon(50% 0%, 0% 40%, 20% 40%, 20% 100%, 80% 100%, 80% 40%, 100% 40%)',
          'arrow-down': 'polygon(20% 0%, 80% 0%, 80% 60%, 100% 60%, 50% 100%, 0% 60%, 20% 60%)',
          chevron: 'polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%)',
          badge: 'polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 100%, 0% 100%)',
          shield: 'polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%)',
          bookmark: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)',
          flag: 'polygon(0% 0%, 100% 0%, 80% 50%, 100% 100%, 0% 100%)',
          burst: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
        };
        
        const clipPath = shapePaths[shapeType] || 'none';
        css += `
          background: ${bgColor};
          clip-path: ${clipPath};
        `;
        return `<div style="${css}"></div>`;
      }
      return '';
    };
    
    const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    const elementsHtml = sortedElements.map(renderElement).join('');
    
    const fonts = new Set(['Inter']);
    elements.forEach(el => {
      if (el.style?.fontFamily) fonts.add(el.style.fontFamily);
    });
    const fontImports = Array.from(fonts).map(f => f.replace(/ /g, '+')).join('&family=');
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=${fontImports}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
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
            overflow: hidden;
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

export async function generateDesignImage(elements, name, width = 794, height = 1123, options = {}) {
  let browser = null;
  let context = null;
  let page = null;
  
  const dpi = options.dpi || 2;
  const format = options.format || 'png';
  const quality = options.quality || 90;
  
  try {
    browser = await getBrowser();
    context = await browser.newContext({
      viewport: { width: 794, height: 1123 },
      deviceScaleFactor: dpi
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
        z-index: ${el.zIndex || 0};
      `;
      
      if (el.type === 'text') {
        css += `
          font-size: ${style.fontSize || 14}px;
          font-family: ${style.fontFamily || 'Inter'}, sans-serif;
          font-weight: ${style.fontWeight || 'normal'};
          font-style: ${style.fontStyle || 'normal'};
          color: ${style.color || '#1e293b'};
          text-align: ${style.textAlign || 'left'};
          background: ${style.backgroundColor || 'transparent'};
          padding: ${style.padding || 0}px;
          border-radius: ${style.borderRadius || 0}px;
          white-space: pre-wrap;
          word-wrap: break-word;
          line-height: 1.4;
        `;
        return `<div style="${css}">${(el.content || '').replace(/\n/g, '<br>')}</div>`;
      } else if (el.type === 'shape') {
        css += `background: ${style.backgroundColor || '#6366f1'}; border-radius: ${style.borderRadius || 0}px;`;
        return `<div style="${css}"></div>`;
      } else if (el.type === 'line') {
        css += `background-color: ${style.color || '#e2e8f0'};`;
        return `<div style="${css}"></div>`;
      } else if (el.type === 'divider') {
        const thickness = el.thickness || 2;
        const color = style.color || '#e2e8f0';
        css += `display: flex; align-items: center;`;
        return `<div style="${css}"><div style="width: 100%; height: ${thickness}px; background: ${color};"></div></div>`;
      } else if (el.type === 'progressBar') {
        const progress = el.progress || 75;
        const bgColor = style.backgroundColor || '#e2e8f0';
        const progressColor = style.progressColor || '#6366f1';
        css += `display: flex; align-items: center;`;
        return `<div style="${css}"><div style="width: 100%; height: 100%; background: ${bgColor}; border-radius: 10px; overflow: hidden;"><div style="width: ${progress}%; height: 100%; background: ${progressColor};"></div></div></div>`;
      } else if (el.type === 'photoPlaceholder') {
        const maskShape = el.maskShape || 'circle';
        const borderRadius = maskShape === 'circle' || maskShape === 'oval' ? '50%' : maskShape === 'rounded' ? '12px' : '0';
        css += `background: ${el.photoUrl ? `url(${el.photoUrl}) center/cover` : '#f1f5f9'}; border-radius: ${borderRadius};`;
        return `<div style="${css}"></div>`;
      } else if (el.type === 'advancedShape') {
        const bgColor = style.backgroundColor || '#6366f1';
        css += `background: ${bgColor}; border-radius: ${style.borderRadius || 0}px;`;
        return `<div style="${css}"></div>`;
      }
      return '';
    };
    
    const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    const elementsHtml = sortedElements.map(renderElement).join('');
    
    const fonts = new Set(['Inter']);
    elements.forEach(el => {
      if (el.style?.fontFamily) fonts.add(el.style.fontFamily);
    });
    const fontImports = Array.from(fonts).map(f => f.replace(/ /g, '+')).join('&family=');
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=${fontImports}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { margin: 0; padding: 0; background: white; }
          .canvas { position: relative; width: 794px; height: 1123px; background: white; overflow: hidden; }
        </style>
      </head>
      <body><div class="canvas">${elementsHtml}</div></body>
      </html>
    `;
    
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    
    const canvas = await page.$('.canvas');
    const imageBuffer = await canvas.screenshot({
      type: format === 'jpeg' ? 'jpeg' : 'png',
      quality: format === 'jpeg' ? quality : undefined
    });
    
    return imageBuffer;
  } catch (error) {
    console.error('Design image generation error:', error);
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
