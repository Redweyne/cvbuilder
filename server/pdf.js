import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const TEMPLATE_COLORS = {
  professional: {
    primary: rgb(0.12, 0.25, 0.69),
    secondary: rgb(0.12, 0.25, 0.69),
    accent: rgb(0.12, 0.25, 0.69)
  },
  modern: {
    primary: rgb(0.39, 0.4, 0.95),
    secondary: rgb(0.49, 0.45, 0.95),
    accent: rgb(0.39, 0.4, 0.95)
  },
  minimal: {
    primary: rgb(0.07, 0.09, 0.15),
    secondary: rgb(0.3, 0.3, 0.35),
    accent: rgb(0.07, 0.09, 0.15)
  },
  executive: {
    primary: rgb(0.11, 0.1, 0.09),
    secondary: rgb(0.71, 0.33, 0.04),
    accent: rgb(0.71, 0.33, 0.04)
  },
  tech: {
    primary: rgb(0.06, 0.72, 0.51),
    secondary: rgb(0.06, 0.09, 0.16),
    accent: rgb(0.06, 0.72, 0.51)
  },
  creative: {
    primary: rgb(0.93, 0.27, 0.6),
    secondary: rgb(0.55, 0.36, 0.96),
    accent: rgb(0.93, 0.27, 0.6)
  },
  academic: {
    primary: rgb(0.49, 0.23, 0.93),
    secondary: rgb(0.49, 0.23, 0.93),
    accent: rgb(0.49, 0.23, 0.93)
  },
  compact: {
    primary: rgb(0.23, 0.51, 0.96),
    secondary: rgb(0.12, 0.16, 0.22),
    accent: rgb(0.23, 0.51, 0.96)
  }
};

const COLORS = {
  text: rgb(0.1, 0.1, 0.1),
  gray: rgb(0.4, 0.4, 0.4),
  lightGray: rgb(0.6, 0.6, 0.6),
  white: rgb(1, 1, 1),
  black: rgb(0, 0, 0),
  divider: rgb(0.9, 0.9, 0.9)
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
    this.baseFontSize = this.isCompact ? 9 : 10;
    this.headerSize = this.isCompact ? 20 : 24;
    this.sectionHeaderSize = this.isCompact ? 10 : 12;
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

  drawLine(thickness = 1, color = COLORS.divider) {
    this.page.drawLine({
      start: { x: this.margin, y: this.yPosition },
      end: { x: this.width - this.margin, y: this.yPosition },
      thickness,
      color
    });
  }

  moveDown(amount) {
    this.yPosition -= amount;
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

  if (personalInfo.full_name) {
    builder.drawText(personalInfo.full_name, {
      font: builder.fontBold,
      size: builder.headerSize,
      color: colors.primary,
      centered: builder.isMinimal
    });
    builder.moveDown(builder.headerSize + 6);
  }
  
  if (personalInfo.title) {
    const titleSize = builder.isCompact ? 10 : 12;
    builder.drawText(personalInfo.title, {
      font: builder.font,
      size: titleSize,
      color: colors.secondary,
      centered: builder.isMinimal
    });
    builder.moveDown(titleSize + 8);
  }
  
  const contactParts = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  
  if (contactParts.length > 0) {
    const contactText = contactParts.join('  |  ');
    builder.drawText(contactText, {
      size: builder.baseFontSize,
      color: COLORS.gray,
      centered: builder.isMinimal
    });
    builder.moveDown(builder.baseFontSize + 5);
  }
  
  const linkParts = [];
  if (personalInfo.linkedin) linkParts.push('LinkedIn');
  if (personalInfo.website) linkParts.push('Portfolio');
  
  if (linkParts.length > 0) {
    const linkText = linkParts.join('  |  ');
    builder.drawText(linkText, {
      size: builder.baseFontSize - 1,
      color: colors.accent,
      centered: builder.isMinimal
    });
    builder.moveDown(builder.baseFontSize + 10);
  }
  
  builder.drawLine(
    templateId === 'executive' ? 2 : 1,
    templateId === 'executive' ? colors.accent : COLORS.divider
  );
  builder.moveDown(15);
  
  if (personalInfo.summary) {
    builder.checkSpace(80);
    const summaryHeader = templateId === 'executive' ? 'EXECUTIVE PROFILE' : 
                         templateId === 'academic' ? 'RESEARCH STATEMENT' :
                         templateId === 'tech' ? '/* SUMMARY */' :
                         'PROFESSIONAL SUMMARY';
    
    builder.drawText(summaryHeader, {
      font: builder.fontBold,
      size: builder.sectionHeaderSize,
      color: colors.primary,
      centered: builder.isMinimal
    });
    builder.moveDown(builder.sectionHeaderSize + 8);
    
    const summaryLines = wrapText(personalInfo.summary, builder.isCompact ? 90 : 80);
    for (const line of summaryLines) {
      builder.checkSpace(20);
      builder.drawText(line, {
        size: builder.baseFontSize,
        color: COLORS.text
      });
      builder.moveDown(builder.baseFontSize + 4);
    }
    builder.moveDown(8);
  }
  
  if (experiences.length > 0) {
    builder.checkSpace(80);
    const expHeader = templateId === 'tech' ? '// EXPERIENCE' :
                      templateId === 'academic' ? 'RESEARCH & PROFESSIONAL EXPERIENCE' :
                      'EXPERIENCE';
    
    builder.drawText(expHeader, {
      font: builder.fontBold,
      size: builder.sectionHeaderSize,
      color: colors.primary
    });
    builder.moveDown(builder.sectionHeaderSize + 8);
    
    for (const exp of experiences) {
      builder.checkSpace(60);
      
      builder.drawText(exp.job_title || 'Position', {
        font: builder.fontBold,
        size: builder.baseFontSize + 1,
        color: COLORS.text
      });
      builder.moveDown(builder.baseFontSize + 5);
      
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
        builder.moveDown(builder.baseFontSize + 5);
      }
      
      if (exp.bullet_points && exp.bullet_points.length > 0) {
        const maxBullets = builder.isCompact ? 3 : 5;
        for (const bullet of exp.bullet_points.filter(b => b && b.trim()).slice(0, maxBullets)) {
          builder.checkSpace(25);
          const bulletSymbol = templateId === 'tech' ? '→ ' : '• ';
          const bulletLines = wrapText(bulletSymbol + bullet, builder.isCompact ? 85 : 75);
          for (const line of bulletLines) {
            builder.checkSpace(15);
            builder.page.drawText(line, {
              x: builder.margin + 10,
              y: builder.yPosition,
              size: builder.baseFontSize - 1,
              font: builder.font,
              color: COLORS.text
            });
            builder.moveDown(builder.baseFontSize + 2);
          }
        }
      }
      builder.moveDown(8);
    }
  }
  
  if (education.length > 0) {
    builder.checkSpace(70);
    const eduHeader = templateId === 'tech' ? '// EDUCATION' : 'EDUCATION';
    
    builder.drawText(eduHeader, {
      font: builder.fontBold,
      size: builder.sectionHeaderSize,
      color: colors.primary
    });
    builder.moveDown(builder.sectionHeaderSize + 8);
    
    for (const edu of education) {
      builder.checkSpace(50);
      
      const degreeText = edu.field ? `${edu.degree} in ${edu.field}` : (edu.degree || 'Degree');
      builder.drawText(degreeText, {
        font: builder.fontBold,
        size: builder.baseFontSize + 1,
        color: COLORS.text
      });
      builder.moveDown(builder.baseFontSize + 5);
      
      const eduLine = [edu.institution, edu.location].filter(Boolean).join(', ');
      if (eduLine) {
        builder.drawText(eduLine, {
          size: builder.baseFontSize,
          color: COLORS.gray
        });
        
        if (edu.graduation_date) {
          const dateWidth = builder.font.widthOfTextAtSize(edu.graduation_date, builder.baseFontSize - 1);
          builder.page.drawText(edu.graduation_date, {
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
        builder.moveDown(builder.baseFontSize + 2);
      }

      if (edu.achievements && edu.achievements.length > 0) {
        for (const achievement of edu.achievements.filter(a => a && a.trim()).slice(0, 3)) {
          builder.checkSpace(15);
          builder.page.drawText(`• ${achievement}`, {
            x: builder.margin + 10,
            y: builder.yPosition,
            size: builder.baseFontSize - 1,
            font: builder.font,
            color: COLORS.text
          });
          builder.moveDown(builder.baseFontSize + 2);
        }
      }
      builder.moveDown(6);
    }
  }
  
  if (skills.length > 0) {
    builder.checkSpace(60);
    const skillsHeader = templateId === 'tech' ? 'const techStack = {' :
                         templateId === 'executive' ? 'CORE COMPETENCIES' :
                         'SKILLS';
    
    builder.drawText(skillsHeader, {
      font: builder.fontBold,
      size: builder.sectionHeaderSize,
      color: colors.primary
    });
    builder.moveDown(builder.sectionHeaderSize + 8);
    
    for (const skillCategory of skills) {
      builder.checkSpace(25);
      
      const categoryItems = skillCategory.items || [];
      const skillLine = `${skillCategory.category}: ${categoryItems.join(', ')}`;
      const skillLines = wrapText(skillLine, builder.isCompact ? 90 : 85);
      
      for (const line of skillLines) {
        builder.checkSpace(15);
        builder.drawText(line, {
          size: builder.baseFontSize,
          color: COLORS.text
        });
        builder.moveDown(builder.baseFontSize + 3);
      }
      builder.moveDown(2);
    }
    
    if (templateId === 'tech') {
      builder.drawText('}', {
        font: builder.fontBold,
        size: builder.sectionHeaderSize,
        color: colors.primary
      });
      builder.moveDown(builder.sectionHeaderSize + 5);
    }
  }

  if (certifications && certifications.length > 0) {
    builder.checkSpace(50);
    builder.drawText('CERTIFICATIONS', {
      font: builder.fontBold,
      size: builder.sectionHeaderSize,
      color: colors.primary
    });
    builder.moveDown(builder.sectionHeaderSize + 6);
    
    for (const cert of certifications.slice(0, 6)) {
      builder.checkSpace(15);
      const certText = cert.issuer ? `${cert.name} - ${cert.issuer}` : cert.name;
      builder.drawText(`• ${certText}`, {
        size: builder.baseFontSize - 1,
        color: COLORS.text
      });
      builder.moveDown(builder.baseFontSize + 2);
    }
    builder.moveDown(5);
  }

  if (languages && languages.length > 0) {
    builder.checkSpace(40);
    builder.drawText('LANGUAGES', {
      font: builder.fontBold,
      size: builder.sectionHeaderSize,
      color: colors.primary
    });
    builder.moveDown(builder.sectionHeaderSize + 6);
    
    const langText = languages.map(l => 
      l.proficiency ? `${l.language} (${l.proficiency})` : l.language
    ).join(', ');
    
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
