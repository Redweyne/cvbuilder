import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const TEMPLATE_COLORS = {
  professional: {
    primary: rgb(0.12, 0.25, 0.69),
    secondary: rgb(0.12, 0.25, 0.69),
    accent: rgb(0.12, 0.25, 0.69),
    headerBg: null,
    headerText: null
  },
  modern: {
    primary: rgb(0.39, 0.4, 0.95),
    secondary: rgb(0.49, 0.45, 0.95),
    accent: rgb(0.39, 0.4, 0.95),
    headerBg: rgb(0.39, 0.4, 0.95),
    headerText: rgb(1, 1, 1)
  },
  minimal: {
    primary: rgb(0.07, 0.09, 0.15),
    secondary: rgb(0.3, 0.3, 0.35),
    accent: rgb(0.07, 0.09, 0.15),
    headerBg: null,
    headerText: null
  },
  executive: {
    primary: rgb(0.11, 0.1, 0.09),
    secondary: rgb(0.71, 0.53, 0.26),
    accent: rgb(0.71, 0.53, 0.26),
    headerBg: rgb(0.11, 0.1, 0.09),
    headerText: rgb(1, 1, 1)
  },
  tech: {
    primary: rgb(0.06, 0.72, 0.51),
    secondary: rgb(0.06, 0.09, 0.16),
    accent: rgb(0.06, 0.72, 0.51),
    headerBg: rgb(0.06, 0.09, 0.16),
    headerText: rgb(1, 1, 1)
  },
  creative: {
    primary: rgb(0.93, 0.27, 0.6),
    secondary: rgb(0.55, 0.36, 0.96),
    accent: rgb(0.93, 0.27, 0.6),
    headerBg: rgb(0.93, 0.27, 0.6),
    headerText: rgb(1, 1, 1)
  },
  academic: {
    primary: rgb(0.49, 0.23, 0.93),
    secondary: rgb(0.49, 0.23, 0.93),
    accent: rgb(0.49, 0.23, 0.93),
    headerBg: null,
    headerText: null
  },
  compact: {
    primary: rgb(0.23, 0.51, 0.96),
    secondary: rgb(0.12, 0.16, 0.22),
    accent: rgb(0.23, 0.51, 0.96),
    headerBg: null,
    headerText: null
  }
};

const COLORS = {
  text: rgb(0.1, 0.1, 0.1),
  gray: rgb(0.4, 0.4, 0.4),
  lightGray: rgb(0.6, 0.6, 0.6),
  white: rgb(1, 1, 1),
  black: rgb(0, 0, 0),
  divider: rgb(0.85, 0.85, 0.85),
  lightBg: rgb(0.97, 0.97, 0.98)
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return rgb(
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    );
  }
  return null;
}

function getTemplateColors(templateId, customization = {}) {
  const baseColors = TEMPLATE_COLORS[templateId] || TEMPLATE_COLORS.professional;
  
  if (customization?.primary_color) {
    const customPrimary = hexToRgb(customization.primary_color);
    if (customPrimary) {
      return {
        ...baseColors,
        primary: customPrimary,
        accent: customPrimary
      };
    }
  }
  
  return baseColors;
}

class PDFBuilder {
  constructor(pdfDoc, templateId, fonts, colors) {
    this.pdfDoc = pdfDoc;
    this.templateId = templateId;
    this.fonts = fonts;
    this.colors = colors;
    this.width = 595.28;
    this.height = 841.89;
    this.margin = templateId === 'compact' ? 40 : 50;
    this.page = pdfDoc.addPage([this.width, this.height]);
    this.yPosition = this.height - this.margin;
    
    this.isSerif = ['professional', 'executive', 'academic'].includes(templateId);
    this.isMinimal = templateId === 'minimal';
    this.isCompact = templateId === 'compact';
    this.isTech = templateId === 'tech';
    this.isModern = templateId === 'modern';
    this.isCreative = templateId === 'creative';
    this.isExecutive = templateId === 'executive';
    
    this.baseFontSize = this.isCompact ? 9 : 10;
    this.headerSize = this.isCompact ? 20 : (this.isTech || this.isModern ? 26 : 24);
    this.sectionHeaderSize = this.isCompact ? 11 : 12;
  }

  get font() {
    return this.isSerif ? this.fonts.timesRoman : this.fonts.helvetica;
  }

  get fontBold() {
    return this.isSerif ? this.fonts.timesRomanBold : this.fonts.helveticaBold;
  }

  checkSpace(needed = 50) {
    if (this.yPosition < needed) {
      this.page = this.pdfDoc.addPage([this.width, this.height]);
      this.yPosition = this.height - this.margin;
      return true;
    }
    return false;
  }

  drawText(text, options = {}) {
    const {
      font = this.font,
      size = this.baseFontSize,
      color = COLORS.text,
      x = this.margin,
      centered = false
    } = options;

    let xPos = x;
    if (centered) {
      const textWidth = font.widthOfTextAtSize(text, size);
      xPos = (this.width - textWidth) / 2;
    }

    this.page.drawText(text, {
      x: xPos,
      y: this.yPosition,
      size,
      font,
      color
    });
  }

  drawLine(thickness = 1, color = COLORS.divider, startX = null, endX = null) {
    this.page.drawLine({
      start: { x: startX || this.margin, y: this.yPosition },
      end: { x: endX || (this.width - this.margin), y: this.yPosition },
      thickness,
      color
    });
  }

  drawRect(x, y, width, height, color) {
    this.page.drawRectangle({
      x,
      y,
      width,
      height,
      color
    });
  }

  moveDown(amount) {
    this.yPosition -= amount;
  }

  drawSectionHeader(text) {
    this.checkSpace(60);
    
    if (this.isTech) {
      const prefix = '// ';
      this.drawText(prefix + text.toUpperCase(), {
        font: this.fonts.helveticaBold,
        size: this.sectionHeaderSize,
        color: this.colors.accent
      });
    } else if (this.isModern || this.isCreative) {
      this.drawRect(this.margin, this.yPosition - 3, 4, this.sectionHeaderSize + 6, this.colors.primary);
      this.page.drawText(text.toUpperCase(), {
        x: this.margin + 12,
        y: this.yPosition,
        size: this.sectionHeaderSize,
        font: this.fonts.helveticaBold,
        color: this.colors.primary
      });
    } else if (this.isExecutive) {
      this.drawText(text.toUpperCase(), {
        font: this.fontBold,
        size: this.sectionHeaderSize,
        color: this.colors.primary
      });
      this.moveDown(4);
      this.drawLine(2, this.colors.accent);
      this.moveDown(this.sectionHeaderSize);
    } else if (this.isMinimal) {
      this.drawText(text.toUpperCase(), {
        font: this.fontBold,
        size: this.sectionHeaderSize,
        color: this.colors.primary,
        centered: true
      });
    } else {
      this.drawText(text.toUpperCase(), {
        font: this.fontBold,
        size: this.sectionHeaderSize,
        color: this.colors.primary
      });
    }
    
    this.moveDown(this.sectionHeaderSize + 10);
  }
}

export async function generateCVPdf(cvData, templateId = 'professional') {
  const pdfDoc = await PDFDocument.create();
  
  const fonts = {
    helvetica: await pdfDoc.embedFont(StandardFonts.Helvetica),
    helveticaBold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    timesRoman: await pdfDoc.embedFont(StandardFonts.TimesRoman),
    timesRomanBold: await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
  };
  
  const colors = getTemplateColors(templateId, cvData.customization);
  const builder = new PDFBuilder(pdfDoc, templateId, fonts, colors);
  
  const personalInfo = cvData.personal_info || {};
  const experiences = cvData.experiences || [];
  const education = cvData.education || [];
  const skills = cvData.skills || [];
  const certifications = cvData.certifications || [];
  const languages = cvData.languages || [];
  const projects = cvData.projects || [];

  const hasHeaderBg = ['tech', 'modern', 'creative', 'executive'].includes(templateId);
  
  if (hasHeaderBg && colors.headerBg) {
    const headerHeight = 120;
    builder.drawRect(0, builder.height - headerHeight, builder.width, headerHeight, colors.headerBg);
    builder.yPosition = builder.height - 35;
  }

  const nameColor = hasHeaderBg && colors.headerText ? colors.headerText : colors.primary;
  const contactColor = hasHeaderBg && colors.headerText ? colors.headerText : COLORS.gray;

  if (personalInfo.full_name) {
    let nameText = personalInfo.full_name;
    if (builder.isTech) {
      nameText = `<${personalInfo.full_name}/>`;
    }
    
    builder.drawText(nameText, {
      font: builder.fontBold,
      size: builder.headerSize,
      color: nameColor,
      centered: builder.isMinimal
    });
    builder.moveDown(builder.headerSize + 8);
  }
  
  if (personalInfo.title) {
    const titleSize = builder.isCompact ? 10 : 13;
    const titleColor = hasHeaderBg ? (colors.headerText || colors.accent) : colors.secondary;
    builder.drawText(personalInfo.title, {
      font: builder.font,
      size: titleSize,
      color: titleColor,
      centered: builder.isMinimal
    });
    builder.moveDown(titleSize + 10);
  }
  
  const contactParts = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  
  if (contactParts.length > 0) {
    const separator = builder.isTech ? '  |  ' : '   •   ';
    const contactText = contactParts.join(separator);
    builder.drawText(contactText, {
      size: builder.baseFontSize,
      color: contactColor,
      centered: builder.isMinimal
    });
    builder.moveDown(builder.baseFontSize + 6);
  }
  
  const linkParts = [];
  if (personalInfo.linkedin) linkParts.push('LinkedIn');
  if (personalInfo.website) linkParts.push('Portfolio');
  
  if (linkParts.length > 0) {
    const linkText = linkParts.join('  |  ');
    const linkColor = hasHeaderBg ? colors.accent : colors.accent;
    builder.drawText(linkText, {
      size: builder.baseFontSize - 1,
      color: linkColor,
      centered: builder.isMinimal
    });
    builder.moveDown(builder.baseFontSize + 12);
  }
  
  if (hasHeaderBg) {
    builder.yPosition = builder.height - 140;
  }
  
  if (!hasHeaderBg) {
    if (builder.isExecutive) {
      builder.drawLine(2, colors.accent);
    } else if (!builder.isMinimal) {
      builder.drawLine(1, COLORS.divider);
    }
    builder.moveDown(18);
  } else {
    builder.moveDown(10);
  }
  
  if (personalInfo.summary) {
    builder.checkSpace(80);
    
    let summaryHeader = 'Professional Summary';
    if (builder.isExecutive) summaryHeader = 'Executive Profile';
    if (builder.isTech) summaryHeader = 'Summary';
    if (templateId === 'academic') summaryHeader = 'Research Statement';
    
    builder.drawSectionHeader(summaryHeader);
    
    if (builder.isTech || builder.isModern) {
      builder.drawRect(builder.margin, builder.yPosition - 5, builder.width - (builder.margin * 2), 1, colors.accent);
      builder.page.drawRectangle({
        x: builder.margin,
        y: builder.yPosition - 60,
        width: 3,
        height: 55,
        color: colors.accent
      });
    }
    
    const summaryLines = wrapText(personalInfo.summary, builder.isCompact ? 90 : 80);
    const indent = (builder.isTech || builder.isModern) ? builder.margin + 10 : builder.margin;
    
    for (const line of summaryLines) {
      builder.checkSpace(20);
      builder.page.drawText(line, {
        x: indent,
        y: builder.yPosition,
        size: builder.baseFontSize,
        font: builder.font,
        color: COLORS.text
      });
      builder.moveDown(builder.baseFontSize + 5);
    }
    builder.moveDown(12);
  }
  
  if (experiences.length > 0) {
    builder.drawSectionHeader('Experience');
    
    for (const exp of experiences) {
      builder.checkSpace(70);
      
      const jobTitle = exp.job_title || exp.title || 'Position';
      builder.drawText(jobTitle, {
        font: builder.fontBold,
        size: builder.baseFontSize + 1,
        color: builder.isTech ? colors.accent : COLORS.text
      });
      builder.moveDown(builder.baseFontSize + 6);
      
      const companyLine = [exp.company, exp.location].filter(Boolean).join(', ');
      const dateRange = [exp.start_date, exp.is_current ? 'Present' : exp.end_date].filter(Boolean).join(' - ');
      
      if (companyLine) {
        builder.drawText(companyLine, {
          size: builder.baseFontSize,
          color: colors.secondary
        });
        
        if (dateRange) {
          const dateWidth = builder.font.widthOfTextAtSize(dateRange, builder.baseFontSize - 1);
          builder.page.drawText(dateRange, {
            x: builder.width - builder.margin - dateWidth,
            y: builder.yPosition,
            size: builder.baseFontSize - 1,
            font: builder.font,
            color: COLORS.lightGray
          });
        }
        builder.moveDown(builder.baseFontSize + 6);
      }
      
      if (exp.bullet_points && exp.bullet_points.length > 0) {
        const maxBullets = builder.isCompact ? 3 : 5;
        const bulletSymbol = builder.isTech ? '→ ' : '• ';
        
        for (const bullet of exp.bullet_points.filter(b => b && b.trim()).slice(0, maxBullets)) {
          builder.checkSpace(25);
          const bulletLines = wrapText(bulletSymbol + bullet, builder.isCompact ? 82 : 72);
          
          for (let i = 0; i < bulletLines.length; i++) {
            builder.checkSpace(15);
            const line = i === 0 ? bulletLines[i] : '   ' + bulletLines[i];
            builder.page.drawText(line, {
              x: builder.margin + 8,
              y: builder.yPosition,
              size: builder.baseFontSize - 1,
              font: builder.font,
              color: COLORS.text
            });
            builder.moveDown(builder.baseFontSize + 3);
          }
        }
      }
      builder.moveDown(10);
    }
  }
  
  if (education.length > 0) {
    builder.drawSectionHeader('Education');
    
    for (const edu of education) {
      builder.checkSpace(55);
      
      const degreeText = edu.field ? `${edu.degree} in ${edu.field}` : (edu.degree || 'Degree');
      builder.drawText(degreeText, {
        font: builder.fontBold,
        size: builder.baseFontSize + 1,
        color: builder.isTech ? colors.accent : COLORS.text
      });
      builder.moveDown(builder.baseFontSize + 5);
      
      const eduLine = [edu.institution, edu.location].filter(Boolean).join(', ');
      if (eduLine) {
        builder.drawText(eduLine, {
          size: builder.baseFontSize,
          color: colors.secondary
        });
        
        const dateText = edu.graduation_date || edu.end_date || '';
        if (dateText) {
          const dateWidth = builder.font.widthOfTextAtSize(dateText, builder.baseFontSize - 1);
          builder.page.drawText(dateText, {
            x: builder.width - builder.margin - dateWidth,
            y: builder.yPosition,
            size: builder.baseFontSize - 1,
            font: builder.font,
            color: COLORS.lightGray
          });
        }
        builder.moveDown(builder.baseFontSize + 5);
      }
      
      if (edu.gpa) {
        builder.drawText(`GPA: ${edu.gpa}`, {
          size: builder.baseFontSize - 1,
          color: COLORS.gray
        });
        builder.moveDown(builder.baseFontSize + 3);
      }

      if (edu.achievements && edu.achievements.length > 0) {
        for (const achievement of edu.achievements.filter(a => a && a.trim()).slice(0, 2)) {
          builder.checkSpace(15);
          builder.page.drawText(`• ${achievement}`, {
            x: builder.margin + 8,
            y: builder.yPosition,
            size: builder.baseFontSize - 1,
            font: builder.font,
            color: COLORS.text
          });
          builder.moveDown(builder.baseFontSize + 3);
        }
      }
      builder.moveDown(8);
    }
  }
  
  if (skills.length > 0) {
    let skillsHeader = 'Skills';
    if (builder.isTech) skillsHeader = 'Tech Stack';
    if (builder.isExecutive) skillsHeader = 'Core Competencies';
    
    builder.drawSectionHeader(skillsHeader);
    
    for (const skillCategory of skills) {
      builder.checkSpace(25);
      
      const categoryItems = skillCategory.items || [];
      if (categoryItems.length === 0) continue;
      
      if (builder.isTech) {
        const categoryName = (skillCategory.category || 'Skills').toLowerCase().replace(/\s+/g, '_');
        const skillLine = `${categoryName}: [${categoryItems.map(s => `"${s}"`).join(', ')}]`;
        const skillLines = wrapText(skillLine, builder.isCompact ? 85 : 80);
        
        for (const line of skillLines) {
          builder.checkSpace(15);
          builder.drawText(line, {
            size: builder.baseFontSize,
            color: COLORS.text
          });
          builder.moveDown(builder.baseFontSize + 4);
        }
      } else {
        builder.drawText(`${skillCategory.category}:`, {
          font: builder.fontBold,
          size: builder.baseFontSize,
          color: colors.secondary
        });
        builder.moveDown(builder.baseFontSize + 3);
        
        const skillText = categoryItems.join(builder.isCreative ? ' • ' : ', ');
        const skillLines = wrapText(skillText, builder.isCompact ? 85 : 80);
        
        for (const line of skillLines) {
          builder.checkSpace(15);
          builder.page.drawText(line, {
            x: builder.margin + 8,
            y: builder.yPosition,
            size: builder.baseFontSize - 1,
            font: builder.font,
            color: COLORS.text
          });
          builder.moveDown(builder.baseFontSize + 3);
        }
      }
      builder.moveDown(4);
    }
  }

  if (certifications && certifications.length > 0) {
    builder.drawSectionHeader('Certifications');
    
    for (const cert of certifications.slice(0, 5)) {
      builder.checkSpace(18);
      const certName = cert.name || cert;
      const certText = cert.issuer ? `${certName} - ${cert.issuer}` : certName;
      const dateText = cert.date ? ` (${cert.date})` : '';
      
      builder.page.drawText(`• ${certText}${dateText}`, {
        x: builder.margin + 5,
        y: builder.yPosition,
        size: builder.baseFontSize - 1,
        font: builder.font,
        color: COLORS.text
      });
      builder.moveDown(builder.baseFontSize + 4);
    }
    builder.moveDown(6);
  }

  if (projects && projects.length > 0) {
    builder.drawSectionHeader(builder.isTech ? 'Projects' : 'Key Projects');
    
    for (const project of projects.slice(0, 3)) {
      builder.checkSpace(40);
      
      builder.drawText(project.name || 'Project', {
        font: builder.fontBold,
        size: builder.baseFontSize,
        color: builder.isTech ? colors.accent : COLORS.text
      });
      builder.moveDown(builder.baseFontSize + 4);
      
      if (project.description) {
        const descLines = wrapText(project.description, 75);
        for (const line of descLines.slice(0, 2)) {
          builder.checkSpace(15);
          builder.page.drawText(line, {
            x: builder.margin + 8,
            y: builder.yPosition,
            size: builder.baseFontSize - 1,
            font: builder.font,
            color: COLORS.gray
          });
          builder.moveDown(builder.baseFontSize + 3);
        }
      }
      
      if (project.technologies && project.technologies.length > 0) {
        const techText = 'Tech: ' + project.technologies.join(', ');
        builder.page.drawText(techText, {
          x: builder.margin + 8,
          y: builder.yPosition,
          size: builder.baseFontSize - 1,
          font: builder.font,
          color: colors.accent
        });
        builder.moveDown(builder.baseFontSize + 5);
      }
      builder.moveDown(6);
    }
  }

  if (languages && languages.length > 0) {
    builder.checkSpace(45);
    builder.drawSectionHeader('Languages');
    
    const langText = languages.map(l => {
      const name = l.language || l.name || l;
      const prof = l.proficiency ? ` (${l.proficiency})` : '';
      return name + prof;
    }).join(builder.isCreative ? ' • ' : ', ');
    
    builder.drawText(langText, {
      size: builder.baseFontSize,
      color: COLORS.text
    });
  }
  
  return await pdfDoc.save();
}

function wrapText(text, maxChars) {
  if (!text) return [];
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxChars) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  return lines;
}

export async function generateCoverLetterPdf(coverLetterContent, applicantName) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]);
  
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const width = 595.28;
  const height = 841.89;
  const margin = 60;
  let yPosition = height - margin;
  
  const checkPage = () => {
    if (yPosition < margin) {
      page = pdfDoc.addPage([width, height]);
      yPosition = height - margin;
    }
  };
  
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
  
  page.drawText(today, {
    x: margin,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: COLORS.gray
  });
  yPosition -= 40;
  
  const paragraphs = coverLetterContent.split('\n\n');
  
  for (const paragraph of paragraphs) {
    const lines = wrapText(paragraph.trim(), 75);
    for (const line of lines) {
      checkPage();
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: 11,
        font: helvetica,
        color: COLORS.text
      });
      yPosition -= 16;
    }
    yPosition -= 10;
  }
  
  yPosition -= 20;
  checkPage();
  page.drawText('Sincerely,', {
    x: margin,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: COLORS.text
  });
  yPosition -= 30;
  
  if (applicantName) {
    checkPage();
    page.drawText(applicantName, {
      x: margin,
      y: yPosition,
      size: 12,
      font: helveticaBold,
      color: COLORS.text
    });
  }
  
  return await pdfDoc.save();
}
