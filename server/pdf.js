import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const SIDEBAR_WIDTH = 195;
const MAIN_START_X = SIDEBAR_WIDTH;
const MAIN_WIDTH = PAGE_WIDTH - SIDEBAR_WIDTH;
const PADDING = 24;
const SIDEBAR_PADDING = 16;

const COLORS = {
  sidebarDark: rgb(0.06, 0.06, 0.14),
  sidebarMid: rgb(0.08, 0.08, 0.18),
  sidebarLight: rgb(0.10, 0.10, 0.22),
  accent: rgb(0.39, 0.40, 0.95),
  accentLight: rgb(0.55, 0.58, 0.98),
  accentSoft: rgb(0.75, 0.77, 0.99),
  gold: rgb(0.85, 0.68, 0.25),
  white: rgb(1, 1, 1),
  white95: rgb(0.95, 0.95, 0.95),
  white90: rgb(0.90, 0.90, 0.92),
  white80: rgb(0.80, 0.80, 0.82),
  white70: rgb(0.70, 0.70, 0.72),
  white60: rgb(0.60, 0.60, 0.62),
  white50: rgb(0.50, 0.50, 0.52),
  white40: rgb(0.40, 0.40, 0.42),
  white30: rgb(0.30, 0.30, 0.32),
  white20: rgb(0.20, 0.20, 0.22),
  mainBg: rgb(0.965, 0.970, 0.980),
  cardBg: rgb(1, 1, 1),
  cardBorder: rgb(0.90, 0.91, 0.93),
  cardShadow: rgb(0.85, 0.86, 0.88),
  textDark: rgb(0.12, 0.12, 0.14),
  textMid: rgb(0.30, 0.30, 0.32),
  textGray: rgb(0.42, 0.42, 0.44),
  textLight: rgb(0.55, 0.55, 0.57),
  datePillBg: rgb(0.94, 0.94, 0.99),
  datePillBorder: rgb(0.88, 0.88, 0.96),
  primary: rgb(0.08, 0.08, 0.16)
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
    this.accentLight = rgb(
      Math.min(1, this.accentColor.red + 0.15),
      Math.min(1, this.accentColor.green + 0.15),
      Math.min(1, this.accentColor.blue + 0.05)
    );
    this.primaryColor = customization?.primary_color
      ? (hexToRgb(customization.primary_color) || COLORS.sidebarDark)
      : COLORS.sidebarDark;
  }

  addPage() {
    this.page = this.pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.sidebarY = PAGE_HEIGHT - 28;
    this.mainY = PAGE_HEIGHT - 28;
    this.drawBackgrounds();
  }

  drawBackgrounds() {
    const numBands = 8;
    const bandHeight = PAGE_HEIGHT / numBands;
    
    for (let i = 0; i < numBands; i++) {
      const t = i / (numBands - 1);
      const r = 0.12 - t * 0.06;
      const g = 0.12 - t * 0.06;
      const b = 0.26 - t * 0.12;
      
      this.page.drawRectangle({
        x: 0,
        y: PAGE_HEIGHT - (i + 1) * bandHeight,
        width: SIDEBAR_WIDTH,
        height: bandHeight + 1,
        color: rgb(Math.max(0.04, r), Math.max(0.04, g), Math.max(0.10, b))
      });
    }

    this.page.drawRectangle({
      x: SIDEBAR_WIDTH,
      y: 0,
      width: MAIN_WIDTH,
      height: PAGE_HEIGHT,
      color: COLORS.mainBg
    });

    this.page.drawCircle({
      x: SIDEBAR_WIDTH - 20,
      y: PAGE_HEIGHT - 60,
      size: 80,
      color: rgb(this.accentColor.red * 0.15, this.accentColor.green * 0.15, this.accentColor.blue * 0.25),
      opacity: 0.3
    });
  }

  checkSidebarSpace(needed) {
    return this.sidebarY >= needed + 30;
  }

  checkMainSpace(needed) {
    if (this.mainY < needed + 45) {
      this.addNewMainPage();
      return true;
    }
    return false;
  }

  addNewMainPage() {
    this.page = this.pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.mainY = PAGE_HEIGHT - 28;
    
    this.page.drawRectangle({
      x: SIDEBAR_WIDTH,
      y: 0,
      width: MAIN_WIDTH,
      height: PAGE_HEIGHT,
      color: COLORS.mainBg
    });
    
    this.page.drawRectangle({
      x: 0,
      y: 0,
      width: SIDEBAR_WIDTH,
      height: PAGE_HEIGHT,
      color: rgb(0.07, 0.07, 0.15)
    });
  }

  drawSidebarSectionHeader(title, iconLetter = '*') {
    this.page.drawRectangle({
      x: SIDEBAR_PADDING,
      y: this.sidebarY - 5,
      width: 18,
      height: 18,
      color: rgb(this.accentColor.red * 0.25, this.accentColor.green * 0.25, this.accentColor.blue * 0.4)
    });
    
    this.page.drawText(iconLetter, {
      x: SIDEBAR_PADDING + 6,
      y: this.sidebarY - 1,
      size: 9,
      font: this.fonts.helveticaBold,
      color: this.accentLight
    });

    this.page.drawText(title.toUpperCase(), {
      x: SIDEBAR_PADDING + 24,
      y: this.sidebarY,
      size: 9,
      font: this.fonts.helveticaBold,
      color: COLORS.white90
    });
    
    this.sidebarY -= 22;
  }

  drawMainSectionHeader(title, iconLetter = 'S') {
    this.checkMainSpace(85);
    
    this.page.drawRectangle({
      x: MAIN_START_X + PADDING,
      y: this.mainY - 10,
      width: 32,
      height: 32,
      color: this.accentColor
    });
    
    this.page.drawRectangle({
      x: MAIN_START_X + PADDING + 1,
      y: this.mainY - 9,
      width: 30,
      height: 30,
      color: this.accentLight
    });
    
    this.page.drawRectangle({
      x: MAIN_START_X + PADDING + 2,
      y: this.mainY - 8,
      width: 28,
      height: 28,
      color: this.accentColor
    });
    
    this.page.drawText(iconLetter, {
      x: MAIN_START_X + PADDING + 10,
      y: this.mainY - 3,
      size: 14,
      font: this.fonts.helveticaBold,
      color: COLORS.white
    });

    this.page.drawText(title.toUpperCase(), {
      x: MAIN_START_X + PADDING + 42,
      y: this.mainY - 2,
      size: 14,
      font: this.fonts.helveticaBold,
      color: COLORS.primary
    });

    this.page.drawRectangle({
      x: MAIN_START_X + PADDING + 42,
      y: this.mainY - 18,
      width: 40,
      height: 3,
      color: this.accentColor
    });
    
    this.page.drawRectangle({
      x: MAIN_START_X + PADDING + 82,
      y: this.mainY - 18,
      width: 20,
      height: 3,
      color: this.accentLight
    });
    
    this.mainY -= 42;
  }

  drawProfilePhoto() {
    const centerX = SIDEBAR_WIDTH / 2;
    const photoSize = 72;
    const photoY = this.sidebarY - photoSize;
    
    this.page.drawCircle({
      x: centerX,
      y: photoY + photoSize / 2,
      size: photoSize / 2 + 6,
      color: rgb(this.accentColor.red * 0.4, this.accentColor.green * 0.4, this.accentColor.blue * 0.6)
    });
    
    this.page.drawCircle({
      x: centerX,
      y: photoY + photoSize / 2,
      size: photoSize / 2 + 3,
      color: rgb(this.accentColor.red * 0.6, this.accentColor.green * 0.6, this.accentColor.blue * 0.8)
    });
    
    this.page.drawCircle({
      x: centerX,
      y: photoY + photoSize / 2,
      size: photoSize / 2,
      color: rgb(0.12, 0.12, 0.22)
    });

    this.page.drawCircle({
      x: centerX,
      y: photoY + photoSize / 2 + 8,
      size: 12,
      color: COLORS.white50
    });
    
    this.page.drawCircle({
      x: centerX,
      y: photoY + photoSize / 2 - 8,
      size: 18,
      color: COLORS.white50
    });
    
    this.sidebarY = photoY - 18;
  }

  drawName(firstName, lastName) {
    const centerX = SIDEBAR_WIDTH / 2;
    
    const firstWidth = this.fonts.helveticaBold.widthOfTextAtSize(firstName, 26);
    this.page.drawText(firstName, {
      x: centerX - firstWidth / 2,
      y: this.sidebarY,
      size: 26,
      font: this.fonts.helveticaBold,
      color: COLORS.white
    });
    this.sidebarY -= 30;

    const lastWidth = this.fonts.helvetica.widthOfTextAtSize(lastName.toUpperCase(), 18);
    this.page.drawText(lastName.toUpperCase(), {
      x: centerX - lastWidth / 2,
      y: this.sidebarY,
      size: 18,
      font: this.fonts.helvetica,
      color: COLORS.white70
    });
    this.sidebarY -= 28;
  }

  drawTitle(title) {
    const centerX = SIDEBAR_WIDTH / 2;
    
    this.page.drawLine({
      start: { x: centerX - 35, y: this.sidebarY + 6 },
      end: { x: centerX - 10, y: this.sidebarY + 6 },
      thickness: 0.5,
      color: COLORS.white30
    });
    
    this.page.drawRectangle({
      x: centerX - 4,
      y: this.sidebarY + 2,
      width: 8,
      height: 8,
      color: COLORS.gold
    });
    
    this.page.drawLine({
      start: { x: centerX + 10, y: this.sidebarY + 6 },
      end: { x: centerX + 35, y: this.sidebarY + 6 },
      thickness: 0.5,
      color: COLORS.white30
    });
    
    this.sidebarY -= 16;
    
    const titleWidth = this.fonts.helveticaBold.widthOfTextAtSize(title.toUpperCase(), 7);
    this.page.drawText(title.toUpperCase(), {
      x: centerX - titleWidth / 2,
      y: this.sidebarY,
      size: 7,
      font: this.fonts.helveticaBold,
      color: this.accentLight
    });
    
    this.sidebarY -= 24;
  }

  drawContactItem(label, value) {
    this.page.drawText(label.toUpperCase(), {
      x: SIDEBAR_PADDING,
      y: this.sidebarY,
      size: 6,
      font: this.fonts.helvetica,
      color: COLORS.white40
    });
    this.sidebarY -= 11;
    
    const lines = wrapText(value, this.fonts.helvetica, 9.5, SIDEBAR_WIDTH - SIDEBAR_PADDING * 2);
    for (const line of lines) {
      this.page.drawText(line, {
        x: SIDEBAR_PADDING,
        y: this.sidebarY,
        size: 9.5,
        font: this.fonts.helvetica,
        color: COLORS.white90
      });
      this.sidebarY -= 13;
    }
    this.sidebarY -= 5;
  }

  drawSkillItem(skill) {
    this.page.drawCircle({
      x: SIDEBAR_PADDING + 4,
      y: this.sidebarY + 4,
      size: 3,
      color: this.accentLight
    });
    this.page.drawCircle({
      x: SIDEBAR_PADDING + 4,
      y: this.sidebarY + 4,
      size: 1.5,
      color: COLORS.white
    });
    
    const lines = wrapText(skill, this.fonts.helvetica, 9.5, SIDEBAR_WIDTH - SIDEBAR_PADDING * 2 - 14);
    for (const line of lines) {
      this.page.drawText(line, {
        x: SIDEBAR_PADDING + 12,
        y: this.sidebarY,
        size: 9.5,
        font: this.fonts.helvetica,
        color: COLORS.white80
      });
      this.sidebarY -= 13;
    }
  }

  drawLanguageBar(language, proficiency) {
    const barWidth = SIDEBAR_WIDTH - SIDEBAR_PADDING * 2;
    const barHeight = 6;
    
    const levels = {
      'Native': 100, 'Fluent': 100, 'Advanced': 90, 'Proficient': 80,
      'Intermediate': 65, 'Elementary': 45, 'Basic': 25
    };
    const percent = levels[proficiency] || 60;
    
    this.page.drawText(language, {
      x: SIDEBAR_PADDING,
      y: this.sidebarY,
      size: 10,
      font: this.fonts.helvetica,
      color: COLORS.white90
    });
    
    const percentText = `${percent}%`;
    const percentWidth = this.fonts.helvetica.widthOfTextAtSize(percentText, 8);
    this.page.drawText(percentText, {
      x: SIDEBAR_WIDTH - SIDEBAR_PADDING - percentWidth,
      y: this.sidebarY,
      size: 8,
      font: this.fonts.helvetica,
      color: this.accentLight
    });
    
    this.sidebarY -= 16;

    this.page.drawRectangle({
      x: SIDEBAR_PADDING,
      y: this.sidebarY,
      width: barWidth,
      height: barHeight,
      color: COLORS.white20
    });

    const fillWidth = barWidth * (percent / 100);
    this.page.drawRectangle({
      x: SIDEBAR_PADDING,
      y: this.sidebarY,
      width: fillWidth,
      height: barHeight,
      color: this.accentColor
    });
    
    this.page.drawRectangle({
      x: SIDEBAR_PADDING,
      y: this.sidebarY + barHeight - 2,
      width: fillWidth,
      height: 2,
      color: this.accentLight
    });
    
    this.sidebarY -= 18;
  }

  estimateTimelineItemHeight(data) {
    const cardWidth = MAIN_WIDTH - PADDING * 2 - 32;
    const textMaxWidth = cardWidth - 24;
    
    let height = 40;
    
    if (data.dateRange) height += 24;
    
    if (data.title) {
      const titleLines = wrapText(data.title, this.fonts.helveticaBold, 11.5, textMaxWidth);
      height += titleLines.length * 15;
    }
    
    if (data.subtitle) {
      const subtitleLines = wrapText(data.subtitle, this.fonts.helvetica, 9.5, textMaxWidth);
      height += subtitleLines.length * 13;
    }
    
    if (data.bullets && data.bullets.length > 0) {
      height += 6;
      for (const bullet of data.bullets.filter(b => b && b.trim()).slice(0, 5)) {
        const bulletLines = wrapText(bullet, this.fonts.helvetica, 9.5, textMaxWidth - 14);
        height += bulletLines.length * 13;
      }
    }
    
    if (data.achievements && data.achievements.length > 0) {
      height += 18;
    }
    
    return height + 22;
  }

  drawTimelineItem(data, isLast = false) {
    const timelineX = MAIN_START_X + PADDING;
    const cardX = timelineX + 24;
    const cardWidth = MAIN_WIDTH - PADDING * 2 - 32;
    
    const estimatedHeight = this.estimateTimelineItemHeight(data);
    this.checkMainSpace(estimatedHeight);
    
    this.page.drawCircle({
      x: timelineX + 6,
      y: this.mainY - 10,
      size: 8,
      color: COLORS.cardBg
    });
    this.page.drawCircle({
      x: timelineX + 6,
      y: this.mainY - 10,
      size: 6,
      color: this.accentColor
    });
    this.page.drawCircle({
      x: timelineX + 6,
      y: this.mainY - 10,
      size: 3,
      color: COLORS.white
    });

    const cardStartY = this.mainY;

    this.page.drawRectangle({
      x: cardX + 2,
      y: cardStartY - estimatedHeight - 2,
      width: cardWidth,
      height: estimatedHeight + 8,
      color: COLORS.cardShadow
    });

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
      thickness: 1,
      color: COLORS.cardBorder
    });
    this.page.drawLine({
      start: { x: cardX, y: cardStartY + 8 },
      end: { x: cardX + cardWidth, y: cardStartY + 8 },
      thickness: 1,
      color: COLORS.cardBorder
    });
    this.page.drawLine({
      start: { x: cardX, y: cardStartY - estimatedHeight },
      end: { x: cardX, y: cardStartY + 8 },
      thickness: 1,
      color: COLORS.cardBorder
    });
    this.page.drawLine({
      start: { x: cardX + cardWidth, y: cardStartY - estimatedHeight },
      end: { x: cardX + cardWidth, y: cardStartY + 8 },
      thickness: 1,
      color: COLORS.cardBorder
    });

    const textX = cardX + 12;
    let textY = cardStartY;
    const textMaxWidth = cardWidth - 24;

    if (data.dateRange) {
      const dateText = data.dateRange;
      const dateWidth = this.fonts.helveticaBold.widthOfTextAtSize(dateText, 8) + 18;
      
      this.page.drawRectangle({
        x: textX,
        y: textY - 10,
        width: dateWidth,
        height: 16,
        color: COLORS.datePillBg
      });
      
      this.page.drawLine({
        start: { x: textX, y: textY - 10 },
        end: { x: textX + dateWidth, y: textY - 10 },
        thickness: 0.5,
        color: COLORS.datePillBorder
      });
      this.page.drawLine({
        start: { x: textX, y: textY + 6 },
        end: { x: textX + dateWidth, y: textY + 6 },
        thickness: 0.5,
        color: COLORS.datePillBorder
      });
      this.page.drawLine({
        start: { x: textX, y: textY - 10 },
        end: { x: textX, y: textY + 6 },
        thickness: 0.5,
        color: COLORS.datePillBorder
      });
      this.page.drawLine({
        start: { x: textX + dateWidth, y: textY - 10 },
        end: { x: textX + dateWidth, y: textY + 6 },
        thickness: 0.5,
        color: COLORS.datePillBorder
      });
      
      this.page.drawText(dateText, {
        x: textX + 9,
        y: textY - 5,
        size: 8,
        font: this.fonts.helveticaBold,
        color: this.accentColor
      });
      textY -= 26;
    }

    if (data.title) {
      const titleLines = wrapText(data.title, this.fonts.helveticaBold, 11.5, textMaxWidth);
      for (const line of titleLines) {
        this.page.drawText(line, {
          x: textX,
          y: textY,
          size: 11.5,
          font: this.fonts.helveticaBold,
          color: COLORS.textDark
        });
        textY -= 15;
      }
    }

    if (data.subtitle) {
      const subtitleLines = wrapText(data.subtitle, this.fonts.helvetica, 9.5, textMaxWidth);
      for (const line of subtitleLines) {
        this.page.drawText(line, {
          x: textX,
          y: textY,
          size: 9.5,
          font: this.fonts.helvetica,
          color: COLORS.textLight
        });
        textY -= 13;
      }
    }

    if (data.bullets && data.bullets.length > 0) {
      textY -= 6;
      for (const bullet of data.bullets.filter(b => b && b.trim()).slice(0, 5)) {
        this.page.drawCircle({
          x: textX + 4,
          y: textY + 4,
          size: 2.5,
          color: this.accentColor
        });
        this.page.drawCircle({
          x: textX + 4,
          y: textY + 4,
          size: 1,
          color: COLORS.white
        });
        
        const bulletLines = wrapText(bullet, this.fonts.helvetica, 9.5, textMaxWidth - 14);
        for (let i = 0; i < bulletLines.length; i++) {
          this.page.drawText(bulletLines[i], {
            x: textX + 12,
            y: textY,
            size: 9.5,
            font: this.fonts.helvetica,
            color: COLORS.textMid
          });
          textY -= 13;
        }
      }
    }

    if (data.achievements && data.achievements.length > 0) {
      const achievementText = data.achievements.filter(a => a && a.trim()).join(' | ');
      if (achievementText) {
        textY -= 4;
        const achieveLines = wrapText(achievementText, this.fonts.helvetica, 8.5, textMaxWidth);
        for (const line of achieveLines.slice(0, 1)) {
          this.page.drawText(line, {
            x: textX,
            y: textY,
            size: 8.5,
            font: this.fonts.helvetica,
            color: this.accentColor
          });
          textY -= 12;
        }
      }
    }

    const actualHeight = cardStartY - textY + 18;
    
    if (!isLast) {
      this.page.drawLine({
        start: { x: timelineX + 6, y: this.mainY - 10 - 8 },
        end: { x: timelineX + 6, y: this.mainY - actualHeight - 8 },
        thickness: 2,
        color: rgb(this.accentColor.red * 0.3, this.accentColor.green * 0.3, this.accentColor.blue * 0.5)
      });
    }

    this.mainY -= actualHeight + 12;
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

  builder.drawProfilePhoto();

  const nameParts = (personalInfo.full_name || 'Your Name').split(' ');
  const firstName = nameParts[0] || 'Your';
  const lastName = nameParts.slice(1).join(' ') || 'Name';
  builder.drawName(firstName, lastName);

  if (personalInfo.title) {
    builder.drawTitle(personalInfo.title);
  }

  if (personalInfo.summary) {
    builder.sidebarY -= 6;
    builder.drawSidebarSectionHeader('Profile', 'P');
    
    const summaryLines = wrapText(
      personalInfo.summary, 
      fonts.helvetica, 
      9.5, 
      SIDEBAR_WIDTH - SIDEBAR_PADDING * 2
    );
    for (const line of summaryLines) {
      builder.page.drawText(line, {
        x: SIDEBAR_PADDING,
        y: builder.sidebarY,
        size: 9.5,
        font: fonts.helvetica,
        color: COLORS.white70
      });
      builder.sidebarY -= 13;
    }
    builder.sidebarY -= 12;
  }

  const hasContact = personalInfo.full_name || personalInfo.location || 
                     personalInfo.phone || personalInfo.email;
  if (hasContact) {
    builder.drawSidebarSectionHeader('Contact', 'C');
    
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
    builder.sidebarY -= 12;
  }

  if (skills.length > 0) {
    builder.drawSidebarSectionHeader('Competences', 'S');
    
    for (const skillCategory of skills) {
      const items = skillCategory.items || [];
      for (const skill of items) {
        if (builder.checkSidebarSpace(16)) {
          builder.drawSkillItem(skill);
        }
      }
    }
    builder.sidebarY -= 12;
  }

  if (languages.length > 0 && builder.checkSidebarSpace(45)) {
    builder.drawSidebarSectionHeader('Languages', 'L');
    
    for (const lang of languages) {
      if (builder.checkSidebarSpace(35)) {
        const langName = lang.language || lang.name || lang;
        const proficiency = lang.proficiency || 'Intermediate';
        builder.drawLanguageBar(langName, proficiency);
      }
    }
  }

  if (education.length > 0) {
    builder.drawMainSectionHeader('Education', 'E');
    
    for (let i = 0; i < education.length; i++) {
      const edu = education[i];
      
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
    builder.mainY -= 8;
  }

  if (experiences.length > 0) {
    builder.drawMainSectionHeader('Experiences', 'W');
    
    for (let i = 0; i < experiences.length; i++) {
      const exp = experiences[i];
      
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
      
      builder.drawTimelineItem({
        dateRange,
        title: `${jobTitle} - ${exp.company || ''}`,
        subtitle: exp.location || '',
        bullets: exp.bullet_points
      }, i === experiences.length - 1);
    }
    builder.mainY -= 8;
  }

  if (certifications && certifications.length > 0) {
    builder.drawMainSectionHeader('Certifications', 'C');
    
    for (const cert of certifications.slice(0, 5)) {
      builder.checkMainSpace(32);
      const certName = cert.name || cert;
      const certText = cert.issuer ? `${certName} - ${cert.issuer}` : certName;
      const dateText = cert.date ? ` (${cert.date})` : '';
      
      builder.page.drawCircle({
        x: MAIN_START_X + PADDING + 4,
        y: builder.mainY + 4,
        size: 3,
        color: builder.accentColor
      });
      builder.page.drawCircle({
        x: MAIN_START_X + PADDING + 4,
        y: builder.mainY + 4,
        size: 1.5,
        color: COLORS.white
      });
      
      builder.page.drawText(`${certText}${dateText}`, {
        x: MAIN_START_X + PADDING + 14,
        y: builder.mainY,
        size: 10,
        font: fonts.helvetica,
        color: COLORS.textMid
      });
      builder.mainY -= 18;
    }
    builder.mainY -= 8;
  }

  if (projects && projects.length > 0) {
    builder.drawMainSectionHeader('Projects', 'P');
    
    for (const project of projects.slice(0, 3)) {
      builder.checkMainSpace(55);
      
      builder.page.drawText(project.name || 'Project', {
        x: MAIN_START_X + PADDING,
        y: builder.mainY,
        size: 11,
        font: fonts.helveticaBold,
        color: COLORS.textDark
      });
      builder.mainY -= 16;
      
      if (project.description) {
        const descLines = wrapText(project.description, fonts.helvetica, 9.5, MAIN_WIDTH - PADDING * 2);
        for (const line of descLines.slice(0, 2)) {
          builder.page.drawText(line, {
            x: MAIN_START_X + PADDING + 10,
            y: builder.mainY,
            size: 9.5,
            font: fonts.helvetica,
            color: COLORS.textMid
          });
          builder.mainY -= 13;
        }
      }
      
      if (project.technologies && project.technologies.length > 0) {
        const techText = 'Tech: ' + project.technologies.join(', ');
        builder.page.drawText(techText, {
          x: MAIN_START_X + PADDING + 10,
          y: builder.mainY,
          size: 9,
          font: fonts.helvetica,
          color: builder.accentColor
        });
        builder.mainY -= 18;
      }
      builder.mainY -= 10;
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
