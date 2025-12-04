import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Premium color palette
const COLORS = {
  navy: [10, 37, 64] as [number, number, number],
  navyLight: [30, 58, 95] as [number, number, number],
  gold: [212, 168, 83] as [number, number, number],
  goldLight: [245, 230, 190] as [number, number, number],
  darkText: [30, 41, 59] as [number, number, number],
  mutedText: [100, 116, 139] as [number, number, number],
  lightBg: [248, 250, 252] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  success: [34, 197, 94] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
  cream: [255, 251, 240] as [number, number, number],
  green: [0, 128, 0] as [number, number, number],
};

export interface PDFInputField {
  label: string;
  value: string | number;
  unit?: string;
}

export interface PDFResultField {
  label: string;
  value: string | number;
  highlight?: boolean;
  subValue?: string;
}

export interface PDFTableData {
  headers: string[];
  rows: (string | number)[][];
  title?: string;
}

export interface PDFConfig {
  calculatorName: string;
  calculatorDescription?: string;
  inputs: PDFInputField[];
  results: PDFResultField[];
  tables?: PDFTableData[];
  assumptions?: string[];
  insights?: string[];
  chartImage?: string;
}

// Convert image URL to base64
async function getImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading image:', error);
    return '';
  }
}

export async function generateCalculatorPDF(config: PDFConfig): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let currentY = 0;

  // Try to load the letterhead image
  let letterheadImage: string | null = null;
  try {
    letterheadImage = await getImageAsBase64('/images/letterhead.png');
  } catch (error) {
    console.log('Letterhead image not found, using text-based header');
  }

  // ========== LETTERHEAD WITH IMAGE ==========
  const drawLetterhead = () => {
    if (letterheadImage) {
      // Add letterhead image - it spans the full width at top
      // The image aspect ratio from your letterhead: approximately 8.5:1.5 (wide header)
      const imgWidth = pageWidth;
      const imgHeight = 35; // Adjust based on your letterhead proportions
      
      doc.addImage(letterheadImage, 'PNG', 0, 0, imgWidth, imgHeight);
      currentY = imgHeight + 8;
    } else {
      // Fallback text-based header
      doc.setFillColor(...COLORS.green);
      doc.rect(0, 0, pageWidth, 25, 'F');
      
      doc.setTextColor(...COLORS.white);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Systematic Investment', margin, 15);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text('You Can Park Your Future Here', margin, 22);
      
      currentY = 35;
    }
  };

  // ========== FOOTER ==========
  const drawFooter = (pageNum: number, totalPages: number) => {
    const footerY = pageHeight - 15;

    // Divider line
    doc.setDrawColor(...COLORS.green);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    // Generation timestamp
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.mutedText);
    doc.setFont('helvetica', 'normal');
    const date = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    doc.text(`Report Generated: ${date}`, margin, footerY);

    // Page number
    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, footerY, { align: 'right' });

    // Disclaimer
    doc.setFontSize(6);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(130, 130, 130);
    doc.text(
      'This report is for informational purposes only. Consult a financial advisor for personalized advice.',
      pageWidth / 2,
      footerY + 5,
      { align: 'center' }
    );
  };

  // ========== PAGE BREAK CHECK ==========
  const checkPageBreak = (requiredSpace: number) => {
    if (currentY + requiredSpace > pageHeight - 25) {
      doc.addPage();
      currentY = 15;
      return true;
    }
    return false;
  };

  // ========== DRAW SECTION HEADER ==========
  const drawSectionHeader = (title: string, accentColor: [number, number, number] = COLORS.green) => {
    checkPageBreak(20);
    
    // Accent bar
    doc.setFillColor(...accentColor);
    doc.roundedRect(margin, currentY, 4, 12, 2, 2, 'F');
    
    // Title
    doc.setTextColor(...COLORS.darkText);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(title, margin + 8, currentY + 8);
    
    currentY += 18;
  };

  // ========== START PDF ==========
  drawLetterhead();

  // Report Title
  doc.setTextColor(...COLORS.darkText);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(config.calculatorName, margin, currentY);
  
  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.mutedText);
  doc.text('Financial Planning Report', margin, currentY + 6);
  
  // Green underline
  doc.setDrawColor(...COLORS.green);
  doc.setLineWidth(1.5);
  doc.line(margin, currentY + 10, margin + 55, currentY + 10);
  
  currentY += 20;

  // ========== YOUR INPUTS SECTION ==========
  drawSectionHeader('Your Inputs', COLORS.green);

  // Input cards in 2-column grid
  const colWidth = (pageWidth - margin * 2 - 10) / 2;
  let col = 0;
  let rowStartY = currentY;

  config.inputs.forEach((input, index) => {
    const x = margin + col * (colWidth + 10);
    
    checkPageBreak(22);
    if (index > 0 && col === 0) {
      rowStartY = currentY;
    }

    // Card background
    doc.setFillColor(...COLORS.white);
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, rowStartY, colWidth, 18, 3, 3, 'FD');
    
    // Left accent bar (green)
    doc.setFillColor(...COLORS.green);
    doc.roundedRect(x, rowStartY, 3, 18, 3, 0, 'F');
    doc.rect(x + 1.5, rowStartY, 1.5, 18, 'F');

    // Label
    doc.setTextColor(...COLORS.mutedText);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(input.label, x + 8, rowStartY + 6);

    // Value
    doc.setTextColor(...COLORS.darkText);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const displayValue = input.unit ? `${input.value}${input.unit}` : String(input.value);
    doc.text(displayValue, x + 8, rowStartY + 14);

    col++;
    if (col >= 2) {
      col = 0;
      currentY = rowStartY + 22;
    }
  });

  if (col !== 0) {
    currentY = rowStartY + 22;
  }
  currentY += 8;

  // ========== RESULTS SECTION ==========
  drawSectionHeader('Calculation Results', COLORS.gold);

  // Find highlighted result
  const highlightedResult = config.results.find(r => r.highlight);
  
  if (highlightedResult) {
    // Highlighted result box
    doc.setFillColor(...COLORS.goldLight);
    doc.roundedRect(margin - 2, currentY - 2, pageWidth - margin * 2 + 4, 36, 6, 6, 'F');
    
    doc.setFillColor(...COLORS.cream);
    doc.setDrawColor(...COLORS.gold);
    doc.setLineWidth(2);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 32, 4, 4, 'FD');

    // Rs icon
    doc.setFillColor(...COLORS.gold);
    doc.circle(margin + 12, currentY + 16, 6, 'F');
    doc.setTextColor(...COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Rs', margin + 12, currentY + 18, { align: 'center' });

    // Label
    doc.setTextColor(...COLORS.mutedText);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(highlightedResult.label, margin + 25, currentY + 10);

    // Value
    doc.setTextColor(...COLORS.darkText);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(String(highlightedResult.value), margin + 25, currentY + 23);

    if (highlightedResult.subValue) {
      doc.setTextColor(...COLORS.mutedText);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.text(highlightedResult.subValue, margin + 25, currentY + 29);
    }

    currentY += 40;
  }

  // Other results table
  const resultsData = config.results
    .filter(r => !r.highlight)
    .map(result => [
      result.label,
      result.subValue ? `${result.value} (${result.subValue})` : String(result.value),
    ]);

  if (resultsData.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [['Parameter', 'Value']],
      body: resultsData,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 10,
        cellPadding: 6,
        lineColor: COLORS.border,
        lineWidth: 0.3,
      },
      headStyles: {
        fillColor: COLORS.green,
        textColor: COLORS.white,
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: {
        textColor: COLORS.darkText,
      },
      alternateRowStyles: {
        fillColor: COLORS.lightBg,
      },
      columnStyles: {
        0: { cellWidth: 80, fontStyle: 'normal' },
        1: { fontStyle: 'bold', halign: 'right' },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // ========== DATA TABLES ==========
  if (config.tables && config.tables.length > 0) {
    config.tables.forEach(table => {
      checkPageBreak(50);

      if (table.title) {
        doc.setFillColor(...COLORS.green);
        doc.roundedRect(margin, currentY, 4, 10, 2, 2, 'F');
        doc.setTextColor(...COLORS.darkText);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(table.title, margin + 8, currentY + 7);
        currentY += 14;
      }

      autoTable(doc, {
        startY: currentY,
        head: [table.headers],
        body: table.rows.map(row => row.map(cell => String(cell))),
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 8,
          cellPadding: 4,
          lineColor: COLORS.border,
          lineWidth: 0.2,
        },
        headStyles: {
          fillColor: COLORS.green,
          textColor: COLORS.white,
          fontStyle: 'bold',
          fontSize: 8,
        },
        alternateRowStyles: {
          fillColor: COLORS.lightBg,
        },
      });

      currentY = (doc as any).lastAutoTable.finalY + 12;
    });
  }

  // ========== CTA SECTION ==========
  checkPageBreak(45);
  currentY += 5;

  // CTA Box
  doc.setFillColor(...COLORS.green);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 35, 5, 5, 'F');

  // CTA Text
  doc.setTextColor(...COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Need Help Planning Your Financial Future?', pageWidth / 2, currentY + 12, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Book a FREE consultation with our certified financial experts', pageWidth / 2, currentY + 20, { align: 'center' });

  doc.setTextColor(...COLORS.goldLight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Call: 9821255653 / 9920735653  |  Email: info.systematic@gmail.com', pageWidth / 2, currentY + 29, { align: 'center' });

  // ========== DRAW FOOTERS ==========
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages);
  }

  // ========== SAVE ==========
  const fileName = `${config.calculatorName.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

// Currency formatter
export function formatCurrencyPDF(amount: number): string {
  if (amount >= 10000000) {
    return `Rs. ${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `Rs. ${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `Rs. ${amount.toLocaleString('en-IN')}`;
  }
  return `Rs. ${Math.round(amount).toLocaleString('en-IN')}`;
}
