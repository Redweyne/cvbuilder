import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const SIDEBAR_WIDTH = 200;
const MAIN_START_X = SIDEBAR_WIDTH;
const MAIN_WIDTH = PAGE_WIDTH - SIDEBAR_WIDTH;
const PADDING = 20;
const SIDEBAR_PADDING = 18;

const COLORS = {
  sidebarDark: rgb(0.075, 0.075, 0.18),
  sidebarMid: rgb(0.1, 0.1, 0.23),
  sidebarLight: rgb(0.12, 0.12, 0.25),
  accent: rgb(0.39, 0.4, 0.95),
  accentLight: rgb(0.51, 0.55, 0.97),
  white: rgb(1, 1, 1),
  white90: rgb(0.9, 0.9, 0.9),
  white70: rgb(0.7, 0.7, 0.7),
  white50: rgb(0.5, 0.5, 0.5),
  white40: rgb(0.4, 0.4, 0.4),
  white30: rgb(0.3, 0.3, 0.3),
  mainBg: rgb(0.973, 0.976, 0.984),
  cardBg: rgb(1, 1, 1),
  cardBorder: rgb(0.93, 0.94, 0.96),
  textDark: rgb(0.15, 0.15, 0.15),
  textGray: rgb(0.35, 0.35, 0.35),
  textLight: rgb(0.5, 0.5, 0.5),
  datePillBg: rgb(0.95, 0.95, 1),
  primary: rgb(0.1, 0.1, 0.18)
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

function wrapText(text, font, fontSize, maxWidth) {
  if (!text) return [];
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    
    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawRoundedRect(page, x, y, width, height, radius, color) {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color,
    borderRadius: radius
  });
}

class TwoColumnPDFBuilder {
  constructor(pdfDoc, fonts, customization = {}) {
    this.pdfDoc = pdfDoc;
    this.fonts = fonts;
    this.page = null;
    this.sidebarY = 0;
    this.mainY = 0;
    
    this.accentColor = customization?.accent_color 
      ? (hexToRgb(customization.accent_color) || COLORS.accent)
      : COLORS.accent;
    this.primaryColor = customization?.primary_color
      ? (hexToRgb(customization.primary_color) || COLORS.sidebarDark)
      : COLORS.sidebarDark;
  }

  addPage() {
    this.page = this.pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.sidebarY = PAGE_HEIGHT - 30;
    this.mainY = PAGE_HEIGHT - 30;
    this.drawBackgrounds();
  }

  drawBackgrounds() {
    const bandHeight = PAGE_HEIGHT / 5;
    const gradientColors = [
      rgb(0.12, 0.12, 0.25),
      rgb(0.1, 0.1, 0.22),
      rgb(0.08, 0.08, 0.18),
      rgb(0.07, 0.07, 0.16),
      rgb(0.05, 0.05, 0.12)
    ];
    
    for (let i = 0; i < 5; i++) {
      this.page.drawRectangle({
        x: 0,
        y: PAGE_HEIGHT - (i + 1) * bandHeight,
        width: SIDEBAR_WIDTH,
        height: bandHeight + 1,
        color: gradientColors[i]
      });
    }

    this.page.drawRectangle({
      x: SIDEBAR_WIDTH,
      y: 0,
      width: MAIN_WIDTH,
      height: PAGE_HEIGHT,
      color: COLORS.mainBg
    });
  }

  checkSidebarSpace(needed) {
    if (this.sidebarY < needed + 30) {
      return false;
    }
    return true;
  }

  checkMainSpace(needed) {
    if (this.mainY < needed + 40) {
      this.addPage();
      return true;
    }
    return false;
  }

  drawSidebarText(text, options = {}) {
    const {
      font = this.fonts.helvetica,
      size = 10,
      color = COLORS.white90,
      x = SIDEBAR_PADDING,
      centered = false,
      maxWidth = SIDEBAR_WIDTH - SIDEBAR_PADDING * 2
    } = options;

    const lines = wrapText(text, font, size, maxWidth);
    
    for (const line of lines) {
      let xPos = x;
      if (centered) {
        const textWidth = font.widthOfTextAtSize(line, size);
        xPos = (SIDEBAR_WIDTH - textWidth) / 2;
      }
      
      this.page.drawText(line, {
        x: xPos,
        y: this.sidebarY,
        size,
        font,
        color
      });
      this.sidebarY -= size + 4;
    }
  }

  drawMainText(text, options = {}) {
    const {
      font = this.fonts.helvetica,
      size = 10,
      color = COLORS.textDark,
      x = MAIN_START_X + PADDING,
      maxWidth = MAIN_WIDTH - PADDING * 2
    } = options;

    const lines = wrapText(text, font, size, maxWidth);
    
    for (const line of lines) {
      this.page.drawText(line, {
        x,
        y: this.mainY,
        size,
        font,
        color
      });
      this.mainY -= size + 4;
    }
  }

  drawSidebarSectionHeader(title, iconType = 'default') {
    this.page.drawRectangle({
      x: SIDEBAR_PADDING,
      y: this.sidebarY - 4,
      width: 16,
      height: 16,
      color: rgb(this.accentColor.red * 0.3, this.accentColor.green * 0.3, this.accentColor.blue * 0.5)
    });

    const iconSymbols = {
      profile: 'P',
      contact: 'C',
      skills: 'S',
      languages: 'L',
      default: '*'
    };
    
    this.page.drawText(iconSymbols[iconType] || '*', {
      x: SIDEBAR_PADDING + 5,
      y: this.sidebarY - 1,
      size: 8,
      font: this.fonts.helveticaBold,
      color: COLORS.accentLight
    });

    this.page.drawText(title.toUpperCase(), {
      x: SIDEBAR_PADDING + 22,
      y: this.sidebarY,
      size: 8,
      font: this.fonts.helveticaBold,
      color: COLORS.white90
    });
    
    this.sidebarY -= 20;
  }

  drawMainSectionHeader(title) {
    this.checkMainSpace(80);
    
    this.page.drawRectangle({
      x: MAIN_START_X + PADDING,
      y: this.mainY - 8,
      width: 28,
      height: 28,
      color: this.accentColor
    });

    const iconSymbols = {
      'EDUCATION': 'E',
      'EXPERIENCES': 'W',
      'EXPERIENCE': 'W',
      'CERTIFICATIONS': 'C',
      'PROJECTS': 'P'
    };
    
    this.page.drawText(iconSymbols[title.toUpperCase()] || 'S', {
      x: MAIN_START_X + PADDING + 9,
      y: this.mainY - 2,
      size: 12,
      font: this.fonts.helveticaBold,
      color: COLORS.white
    });

    this.page.drawText(title.toUpperCase(), {
      x: MAIN_START_X + PADDING + 38,
      y: this.mainY,
      size: 13,
      font: this.fonts.helveticaBold,
      color: COLORS.primary
    });

    this.page.drawRectangle({
      x: MAIN_START_X + PADDING + 38,
      y: this.mainY - 14,
      width: 35,
      height: 2,
      color: this.accentColor
    });
    
    this.mainY -= 35;
  }

  drawProfilePhoto(hasPhoto = false) {
    const centerX = SIDEBAR_WIDTH / 2;
    const photoSize = 70;
    const photoY = this.sidebarY - photoSize;
    
    this.page.drawCircle({
      x: centerX,
      y: photoY + photoSize / 2,
      size: photoSize / 2 + 4,
      color: rgb(this.accentColor.red * 0.5, this.accentColor.green * 0.5, this.accentColor.blue * 0.7),
      borderWidth: 0
    });
    
    this.page.drawCircle({
      x: centerX,
      y: photoY + photoSize / 2,
      size: photoSize / 2,
      color: rgb(0.15, 0.15, 0.25),
      borderWidth: 0
    });

    this.page.drawText('U', {
      x: centerX - 8,
      y: photoY + photoSize / 2 - 10,
      size: 28,
      font: this.fonts.helvetica,
      color: COLORS.white50
    });
    
    this.sidebarY = photoY - 15;
  }

  drawName(firstName, lastName) {
    const centerX = SIDEBAR_WIDTH / 2;
    
    let firstWidth = this.fonts.helveticaBold.widthOfTextAtSize(firstName, 24);
    this.page.drawText(firstName, {
      x: centerX - firstWidth / 2,
      y: this.sidebarY,
      size: 24,
      font: this.fonts.helveticaBold,
      color: COLORS.white
    });
    this.sidebarY -= 28;

    let lastWidth = this.fonts.helvetica.widthOfTextAtSize(lastName.toUpperCase(), 18);
    this.page.drawText(lastName.toUpperCase(), {
      x: centerX - lastWidth / 2,
      y: this.sidebarY,
      size: 18,
      font: this.fonts.helvetica,
      color: COLORS.white70
    });
    this.sidebarY -= 25;
  }

  drawTitle(title) {
    const centerX = SIDEBAR_WIDTH / 2;
    
    this.page.drawLine({
      start: { x: centerX - 30, y: this.sidebarY + 5 },
      end: { x: centerX - 8, y: this.sidebarY + 5 },
      thickness: 0.5,
      color: COLORS.white30
    });
    
    this.page.drawRectangle({
      x: centerX - 3,
      y: this.sidebarY + 2,
      width: 6,
      height: 6,
      color: rgb(0.85, 0.65, 0.2)
    });
    
    this.page.drawLine({
      start: { x: centerX + 8, y: this.sidebarY + 5 },
      end: { x: centerX + 30, y: this.sidebarY + 5 },
      thickness: 0.5,
      color: COLORS.white30
    });
    
    this.sidebarY -= 12;
    
    const titleWidth = this.fonts.helveticaBold.widthOfTextAtSize(title.toUpperCase(), 7);
    this.page.drawText(title.toUpperCase(), {
      x: centerX - titleWidth / 2,
      y: this.sidebarY,
      size: 7,
      font: this.fonts.helveticaBold,
      color: COLORS.accentLight
    });
    
    this.sidebarY -= 20;
  }

  drawContactItem(label, value) {
    this.page.drawText(label.toUpperCase(), {
      x: SIDEBAR_PADDING,
      y: this.sidebarY,
      size: 6,
      font: this.fonts.helvetica,
      color: COLORS.white40
    });
    this.sidebarY -= 10;
    
    const lines = wrapText(value, this.fonts.helvetica, 9, SIDEBAR_WIDTH - SIDEBAR_PADDING * 2);
    for (const line of lines) {
      this.page.drawText(line, {
        x: SIDEBAR_PADDING,
        y: this.sidebarY,
        size: 9,
        font: this.fonts.helvetica,
        color: COLORS.white90
      });
      this.sidebarY -= 12;
    }
    this.sidebarY -= 4;
  }

  drawSkillItem(skill) {
    this.page.drawCircle({
      x: SIDEBAR_PADDING + 3,
      y: this.sidebarY + 3,
      size: 2,
      color: COLORS.accentLight
    });
    
    const lines = wrapText(skill, this.fonts.helvetica, 9, SIDEBAR_WIDTH - SIDEBAR_PADDING * 2 - 12);
    for (const line of lines) {
      this.page.drawText(line, {
        x: SIDEBAR_PADDING + 10,
        y: this.sidebarY,
        size: 9,
        font: this.fonts.helvetica,
        color: COLORS.white70
      });
      this.sidebarY -= 12;
    }
  }

  drawLanguageBar(language, proficiency) {
    const barWidth = SIDEBAR_WIDTH - SIDEBAR_PADDING * 2;
    const barHeight = 5;
    
    const levels = {
      'Native': 100,
      'Fluent': 100,
      'Advanced': 90,
      'Proficient': 80,
      'Intermediate': 65,
      'Elementary': 45,
      'Basic': 25
    };
    const percent = levels[proficiency] || 60;
    
    this.page.drawText(language, {
      x: SIDEBAR_PADDING,
      y: this.sidebarY,
      size: 9,
      font: this.fonts.helvetica,
      color: COLORS.white90
    });
    
    const percentText = `${percent}%`;
    const percentWidth = this.fonts.helvetica.widthOfTextAtSize(percentText, 7);
    this.page.drawText(percentText, {
      x: SIDEBAR_WIDTH - SIDEBAR_PADDING - percentWidth,
      y: this.sidebarY,
      size: 7,
      font: this.fonts.helvetica,
      color: COLORS.accentLight
    });
    
    this.sidebarY -= 14;

    this.page.drawRectangle({
      x: SIDEBAR_PADDING,
      y: this.sidebarY,
      width: barWidth,
      height: barHeight,
      color: COLORS.white30
    });

    this.page.drawRectangle({
      x: SIDEBAR_PADDING,
      y: this.sidebarY,
      width: barWidth * (percent / 100),
      height: barHeight,
      color: this.accentColor
    });
    
    this.sidebarY -= 15;
  }

  drawTimelineItem(data, isLast = false) {
    const timelineX = MAIN_START_X + PADDING;
    const cardX = timelineX + 22;
    const cardWidth = MAIN_WIDTH - PADDING * 2 - 30;
    
    const dotSize = 5;
    this.page.drawCircle({
      x: timelineX + 6,
      y: this.mainY - 8,
      size: dotSize + 2,
      color: COLORS.cardBg
    });
    this.page.drawCircle({
      x: timelineX + 6,
      y: this.mainY - 8,
      size: dotSize,
      color: this.accentColor
    });

    const cardStartY = this.mainY;
    
    let estimatedHeight = 50;
    if (data.bullets && data.bullets.length > 0) {
      estimatedHeight += data.bullets.length * 14;
    }
    if (data.achievements && data.achievements.length > 0) {
      estimatedHeight += 15;
    }

    this.page.drawRectangle({
      x: cardX,
      y: cardStartY - estimatedHeight,
      width: cardWidth,
      height: estimatedHeight + 8,
      color: COLORS.cardBg
    });
    
    this.page.drawLine({
      start: { x: cardX, y: cardStartY - estimatedHeight },
      end: { x: cardX + cardWidth, y: cardStartY - estimatedHeight },
      thickness: 0.5,
      color: COLORS.cardBorder
    });
    this.page.drawLine({
      start: { x: cardX, y: cardStartY + 8 },
      end: { x: cardX + cardWidth, y: cardStartY + 8 },
      thickness: 0.5,
      color: COLORS.cardBorder
    });
    this.page.drawLine({
      start: { x: cardX, y: cardStartY - estimatedHeight },
      end: { x: cardX, y: cardStartY + 8 },
      thickness: 0.5,
      color: COLORS.cardBorder
    });
    this.page.drawLine({
      start: { x: cardX + cardWidth, y: cardStartY - estimatedHeight },
      end: { x: cardX + cardWidth, y: cardStartY + 8 },
      thickness: 0.5,
      color: COLORS.cardBorder
    });

    const textX = cardX + 10;
    let textY = cardStartY;
    const textMaxWidth = cardWidth - 20;

    if (data.dateRange) {
      const dateText = data.dateRange;
      const dateWidth = this.fonts.helveticaBold.widthOfTextAtSize(dateText, 7) + 16;
      
      this.page.drawRectangle({
        x: textX,
        y: textY - 8,
        width: dateWidth,
        height: 14,
        color: COLORS.datePillBg
      });
      
      this.page.drawText(dateText, {
        x: textX + 8,
        y: textY - 4,
        size: 7,
        font: this.fonts.helveticaBold,
        color: this.accentColor
      });
      textY -= 22;
    }

    if (data.title) {
      const titleLines = wrapText(data.title, this.fonts.helveticaBold, 11, textMaxWidth);
      for (const line of titleLines) {
        this.page.drawText(line, {
          x: textX,
          y: textY,
          size: 11,
          font: this.fonts.helveticaBold,
          color: COLORS.textDark
        });
        textY -= 14;
      }
    }

    if (data.subtitle) {
      const subtitleLines = wrapText(data.subtitle, this.fonts.helvetica, 9, textMaxWidth);
      for (const line of subtitleLines) {
        this.page.drawText(line, {
          x: textX,
          y: textY,
          size: 9,
          font: this.fonts.helvetica,
          color: COLORS.textLight
        });
        textY -= 12;
      }
    }

    if (data.bullets && data.bullets.length > 0) {
      textY -= 4;
      for (const bullet of data.bullets.filter(b => b && b.trim()).slice(0, 5)) {
        this.page.drawCircle({
          x: textX + 3,
          y: textY + 3,
          size: 1.5,
          color: this.accentColor
        });
        
        const bulletLines = wrapText(bullet, this.fonts.helvetica, 9, textMaxWidth - 12);
        for (let i = 0; i < bulletLines.length; i++) {
          this.page.drawText(bulletLines[i], {
            x: textX + 10,
            y: textY,
            size: 9,
            font: this.fonts.helvetica,
            color: COLORS.textGray
          });
          textY -= 12;
        }
      }
    }

    if (data.achievements && data.achievements.length > 0) {
      const achievementText = data.achievements.filter(a => a && a.trim()).join(' | ');
      if (achievementText) {
        const achieveLines = wrapText(achievementText, this.fonts.helvetica, 8, textMaxWidth);
        for (const line of achieveLines.slice(0, 1)) {
          this.page.drawText(line, {
            x: textX,
            y: textY,
            size: 8,
            font: this.fonts.helvetica,
            color: this.accentColor
          });
          textY -= 10;
        }
      }
    }

    const actualHeight = cardStartY - textY + 15;
    
    if (!isLast) {
      this.page.drawLine({
        start: { x: timelineX + 6, y: this.mainY - 8 - dotSize - 2 },
        end: { x: timelineX + 6, y: this.mainY - actualHeight - 5 },
        thickness: 1.5,
        color: rgb(this.accentColor.red * 0.3, this.accentColor.green * 0.3, this.accentColor.blue * 0.5)
      });
    }

    this.mainY -= actualHeight + 10;
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

  const builder = new TwoColumnPDFBuilder(pdfDoc, fonts, cvData.customization);
  builder.addPage();

  const personalInfo = cvData.personal_info || {};
  const experiences = cvData.experiences || [];
  const education = cvData.education || [];
  const skills = cvData.skills || [];
  const certifications = cvData.certifications || [];
  const languages = cvData.languages || [];
  const projects = cvData.projects || [];

  builder.drawProfilePhoto(!!personalInfo.photo_url);

  const nameParts = (personalInfo.full_name || 'Your Name').split(' ');
  const firstName = nameParts[0] || 'Your';
  const lastName = nameParts.slice(1).join(' ') || 'Name';
  builder.drawName(firstName, lastName);

  if (personalInfo.title) {
    builder.drawTitle(personalInfo.title);
  }

  if (personalInfo.summary) {
    builder.sidebarY -= 5;
    builder.drawSidebarSectionHeader('Profile', 'profile');
    
    const summaryLines = wrapText(
      personalInfo.summary, 
      fonts.helvetica, 
      9, 
      SIDEBAR_WIDTH - SIDEBAR_PADDING * 2
    );
    for (const line of summaryLines) {
      builder.page.drawText(line, {
        x: SIDEBAR_PADDING,
        y: builder.sidebarY,
        size: 9,
        font: fonts.helvetica,
        color: COLORS.white70
      });
      builder.sidebarY -= 12;
    }
    builder.sidebarY -= 10;
  }

  const hasContact = personalInfo.full_name || personalInfo.location || 
                     personalInfo.phone || personalInfo.email;
  if (hasContact) {
    builder.drawSidebarSectionHeader('Contact', 'contact');
    
    if (personalInfo.full_name) {
      builder.drawContactItem('Name', personalInfo.full_name);
    }
    if (personalInfo.location) {
      builder.drawContactItem('Address', personalInfo.location);
    }
    if (personalInfo.phone) {
      builder.drawContactItem('Phone', personalInfo.phone);
    }
    if (personalInfo.email) {
      builder.drawContactItem('Email', personalInfo.email);
    }
    builder.sidebarY -= 10;
  }

  if (skills.length > 0) {
    builder.drawSidebarSectionHeader('Competences', 'skills');
    
    for (const skillCategory of skills) {
      const items = skillCategory.items || [];
      for (const skill of items) {
        if (builder.checkSidebarSpace(15)) {
          builder.drawSkillItem(skill);
        }
      }
    }
    builder.sidebarY -= 10;
  }

  if (languages.length > 0 && builder.checkSidebarSpace(40)) {
    builder.drawSidebarSectionHeader('Languages', 'languages');
    
    for (const lang of languages) {
      if (builder.checkSidebarSpace(30)) {
        const langName = lang.language || lang.name || lang;
        const proficiency = lang.proficiency || 'Intermediate';
        builder.drawLanguageBar(langName, proficiency);
      }
    }
  }

  if (education.length > 0) {
    builder.drawMainSectionHeader('Education');
    
    for (let i = 0; i < education.length; i++) {
      const edu = education[i];
      builder.checkMainSpace(100);
      
      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
          const date = new Date(dateStr + '-01');
          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } catch {
          return dateStr;
        }
      };
      
      let dateRange = '';
      if (edu.start_date || edu.graduation_date) {
        const start = formatDate(edu.start_date);
        const end = formatDate(edu.graduation_date);
        dateRange = start && end ? `${start} - ${end}` : (end || start);
      }
      
      builder.drawTimelineItem({
        dateRange,
        title: edu.degree + (edu.field ? ` in ${edu.field}` : ''),
        subtitle: edu.institution,
        achievements: edu.achievements
      }, i === education.length - 1);
    }
    builder.mainY -= 10;
  }

  if (experiences.length > 0) {
    builder.drawMainSectionHeader('Experiences');
    
    for (let i = 0; i < experiences.length; i++) {
      const exp = experiences[i];
      builder.checkMainSpace(100);
      
      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
          const date = new Date(dateStr + '-01');
          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } catch {
          return dateStr;
        }
      };
      
      let dateRange = '';
      if (exp.start_date) {
        const start = formatDate(exp.start_date);
        const end = exp.is_current ? 'Present' : formatDate(exp.end_date);
        dateRange = `${start} - ${end}`;
      }
      
      const jobTitle = exp.job_title || exp.title || 'Position';
      const companyLocation = [exp.company, exp.location].filter(Boolean).join(' | ');
      
      builder.drawTimelineItem({
        dateRange,
        title: `${jobTitle} - ${exp.company || ''}`,
        subtitle: exp.location || '',
        bullets: exp.bullet_points
      }, i === experiences.length - 1);
    }
    builder.mainY -= 10;
  }

  if (certifications && certifications.length > 0) {
    builder.drawMainSectionHeader('Certifications');
    
    for (const cert of certifications.slice(0, 5)) {
      builder.checkMainSpace(30);
      const certName = cert.name || cert;
      const certText = cert.issuer ? `${certName} - ${cert.issuer}` : certName;
      const dateText = cert.date ? ` (${cert.date})` : '';
      
      builder.page.drawCircle({
        x: MAIN_START_X + PADDING + 3,
        y: builder.mainY + 3,
        size: 2,
        color: builder.accentColor
      });
      
      builder.page.drawText(`${certText}${dateText}`, {
        x: MAIN_START_X + PADDING + 12,
        y: builder.mainY,
        size: 9,
        font: fonts.helvetica,
        color: COLORS.textGray
      });
      builder.mainY -= 16;
    }
    builder.mainY -= 10;
  }

  if (projects && projects.length > 0) {
    builder.drawMainSectionHeader('Projects');
    
    for (const project of projects.slice(0, 3)) {
      builder.checkMainSpace(50);
      
      builder.page.drawText(project.name || 'Project', {
        x: MAIN_START_X + PADDING,
        y: builder.mainY,
        size: 10,
        font: fonts.helveticaBold,
        color: COLORS.textDark
      });
      builder.mainY -= 14;
      
      if (project.description) {
        const descLines = wrapText(project.description, fonts.helvetica, 9, MAIN_WIDTH - PADDING * 2);
        for (const line of descLines.slice(0, 2)) {
          builder.page.drawText(line, {
            x: MAIN_START_X + PADDING + 8,
            y: builder.mainY,
            size: 9,
            font: fonts.helvetica,
            color: COLORS.textGray
          });
          builder.mainY -= 12;
        }
      }
      
      if (project.technologies && project.technologies.length > 0) {
        const techText = 'Tech: ' + project.technologies.join(', ');
        builder.page.drawText(techText, {
          x: MAIN_START_X + PADDING + 8,
          y: builder.mainY,
          size: 8,
          font: fonts.helvetica,
          color: builder.accentColor
        });
        builder.mainY -= 16;
      }
      builder.mainY -= 8;
    }
  }

  return await pdfDoc.save();
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
    color: COLORS.textLight
  });
  yPosition -= 40;
  
  const paragraphs = coverLetterContent.split('\n\n');
  
  for (const paragraph of paragraphs) {
    const lines = wrapText(paragraph.trim(), helvetica, 11, width - margin * 2);
    for (const line of lines) {
      checkPage();
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: 11,
        font: helvetica,
        color: COLORS.textDark
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
    color: COLORS.textDark
  });
  yPosition -= 30;
  
  if (applicantName) {
    checkPage();
    page.drawText(applicantName, {
      x: margin,
      y: yPosition,
      size: 12,
      font: helveticaBold,
      color: COLORS.textDark
    });
  }
  
  return await pdfDoc.save();
}
