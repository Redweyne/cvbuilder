import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const COLORS = {
  primary: rgb(0.31, 0.27, 0.89),
  secondary: rgb(0.39, 0.4, 0.95),
  text: rgb(0.1, 0.1, 0.1),
  gray: rgb(0.4, 0.4, 0.4),
  lightGray: rgb(0.6, 0.6, 0.6),
  white: rgb(1, 1, 1),
  black: rgb(0, 0, 0)
};

export async function generateCVPdf(cvData, templateId = 'professional') {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { width, height } = page.getSize();
  const margin = 50;
  let yPosition = height - margin;
  
  const personalInfo = cvData.personal_info || {};
  const experiences = cvData.experiences || [];
  const education = cvData.education || [];
  const skills = cvData.skills || [];
  
  if (personalInfo.full_name) {
    page.drawText(personalInfo.full_name, {
      x: margin,
      y: yPosition,
      size: 24,
      font: helveticaBold,
      color: COLORS.primary
    });
    yPosition -= 30;
  }
  
  const contactParts = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  
  if (contactParts.length > 0) {
    page.drawText(contactParts.join('  |  '), {
      x: margin,
      y: yPosition,
      size: 10,
      font: helvetica,
      color: COLORS.gray
    });
    yPosition -= 15;
  }
  
  const linkParts = [];
  if (personalInfo.linkedin) linkParts.push(personalInfo.linkedin);
  if (personalInfo.website) linkParts.push(personalInfo.website);
  
  if (linkParts.length > 0) {
    page.drawText(linkParts.join('  |  '), {
      x: margin,
      y: yPosition,
      size: 9,
      font: helvetica,
      color: COLORS.secondary
    });
    yPosition -= 20;
  }
  
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: width - margin, y: yPosition },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9)
  });
  yPosition -= 20;
  
  if (personalInfo.summary) {
    page.drawText('PROFESSIONAL SUMMARY', {
      x: margin,
      y: yPosition,
      size: 12,
      font: helveticaBold,
      color: COLORS.primary
    });
    yPosition -= 18;
    
    const summaryLines = wrapText(personalInfo.summary, 80);
    for (const line of summaryLines) {
      if (yPosition < margin) {
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        yPosition = height - margin;
      }
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: 10,
        font: helvetica,
        color: COLORS.text
      });
      yPosition -= 14;
    }
    yPosition -= 10;
  }
  
  if (experiences.length > 0) {
    page.drawText('EXPERIENCE', {
      x: margin,
      y: yPosition,
      size: 12,
      font: helveticaBold,
      color: COLORS.primary
    });
    yPosition -= 18;
    
    for (const exp of experiences) {
      if (yPosition < 100) break;
      
      page.drawText(exp.job_title || 'Position', {
        x: margin,
        y: yPosition,
        size: 11,
        font: helveticaBold,
        color: COLORS.text
      });
      yPosition -= 14;
      
      const companyLine = [exp.company, exp.location].filter(Boolean).join(', ');
      const dateRange = [exp.start_date, exp.is_current ? 'Present' : exp.end_date].filter(Boolean).join(' - ');
      
      if (companyLine) {
        page.drawText(companyLine, {
          x: margin,
          y: yPosition,
          size: 10,
          font: helvetica,
          color: COLORS.gray
        });
        
        if (dateRange) {
          page.drawText(dateRange, {
            x: width - margin - 100,
            y: yPosition,
            size: 9,
            font: helvetica,
            color: COLORS.lightGray
          });
        }
        yPosition -= 14;
      }
      
      if (exp.bullet_points && exp.bullet_points.length > 0) {
        for (const bullet of exp.bullet_points.slice(0, 4)) {
          if (yPosition < 80) break;
          const bulletLines = wrapText(`• ${bullet}`, 75);
          for (const line of bulletLines) {
            page.drawText(line, {
              x: margin + 10,
              y: yPosition,
              size: 9,
              font: helvetica,
              color: COLORS.text
            });
            yPosition -= 12;
          }
        }
      }
      yPosition -= 8;
    }
  }
  
  if (education.length > 0 && yPosition > 120) {
    page.drawText('EDUCATION', {
      x: margin,
      y: yPosition,
      size: 12,
      font: helveticaBold,
      color: COLORS.primary
    });
    yPosition -= 18;
    
    for (const edu of education) {
      if (yPosition < 80) break;
      
      page.drawText(edu.degree || 'Degree', {
        x: margin,
        y: yPosition,
        size: 11,
        font: helveticaBold,
        color: COLORS.text
      });
      yPosition -= 14;
      
      const eduLine = [edu.institution, edu.field_of_study].filter(Boolean).join(' - ');
      if (eduLine) {
        page.drawText(eduLine, {
          x: margin,
          y: yPosition,
          size: 10,
          font: helvetica,
          color: COLORS.gray
        });
        
        if (edu.graduation_date) {
          page.drawText(edu.graduation_date, {
            x: width - margin - 80,
            y: yPosition,
            size: 9,
            font: helvetica,
            color: COLORS.lightGray
          });
        }
        yPosition -= 14;
      }
      yPosition -= 6;
    }
  }
  
  if (skills.length > 0 && yPosition > 80) {
    page.drawText('SKILLS', {
      x: margin,
      y: yPosition,
      size: 12,
      font: helveticaBold,
      color: COLORS.primary
    });
    yPosition -= 18;
    
    const skillNames = skills.map(s => typeof s === 'string' ? s : s.name).filter(Boolean);
    const skillsText = skillNames.join('  •  ');
    const skillLines = wrapText(skillsText, 85);
    
    for (const line of skillLines) {
      if (yPosition < 50) break;
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: 10,
        font: helvetica,
        color: COLORS.text
      });
      yPosition -= 14;
    }
  }
  
  return await pdfDoc.save();
}

function wrapText(text, maxChars) {
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
  const page = pdfDoc.addPage([595.28, 841.89]);
  
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { width, height } = page.getSize();
  const margin = 60;
  let yPosition = height - margin;
  
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
      if (yPosition < margin) {
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        yPosition = height - margin;
      }
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
  page.drawText('Sincerely,', {
    x: margin,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: COLORS.text
  });
  yPosition -= 30;
  
  if (applicantName) {
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
