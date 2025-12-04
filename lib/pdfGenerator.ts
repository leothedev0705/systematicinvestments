import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Company details for letterhead
const COMPANY = {
  name: "Systematic Investments",
  tagline: "Where Growth Meets Stability",
  address: "Shri Ram Tower, Near Ginger Hotel, Wakad, Pune - 411057",
  phone: "+91 98909 68995",
  email: "vivekbhande79@gmail.com",
  website: "www.systematicinvestments.in",
  established: "Est. 1996",
};

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

export function generateCalculatorPDF(config: PDFConfig): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let currentY = 0;

  // ========== PREMIUM LETTERHEAD ==========
  const drawLetterhead = () => {
    // Navy header bar with gradient effect
    doc.setFillColor(...COLORS.navy);
    doc.rect(0, 0, pageWidth, 42, 'F');
    
    // Subtle pattern overlay
    doc.setFillColor(255, 255, 255);
    doc.setGState(new (doc as any).GState({ opacity: 0.03 }));
    for (let i = 0; i < pageWidth; i += 8) {
      doc.circle(i, 21, 15, 'F');
    }
    doc.setGState(new (doc as any).GState({ opacity: 1 }));

    // Gold accent stripe
    doc.setFillColor(...COLORS.gold);
    doc.rect(0, 42, pageWidth, 3, 'F');

    // Company name
    doc.setTextColor(...COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(COMPANY.name, margin, 18);

    // Tagline with gold color
    doc.setTextColor(...COLORS.gold);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text(COMPANY.tagline, margin, 27);

    // Established badge
    doc.setTextColor(200, 200, 200);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(COMPANY.established, margin, 36);

    // Contact details (right aligned)
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(8);
    const rightX = pageWidth - margin;
    doc.text(COMPANY.phone, rightX, 16, { align: 'right' });
    doc.text(COMPANY.email, rightX, 23, { align: 'right' });
    doc.text(COMPANY.website, rightX, 30, { align: 'right' });
    doc.text(COMPANY.address.split(',')[0], rightX, 37, { align: 'right' });

    currentY = 55;
  };

  // ========== PREMIUM FOOTER ==========
  const drawFooter = (pageNum: number, totalPages: number) => {
    const footerY = pageHeight - 20;

    // Footer background
    doc.setFillColor(...COLORS.lightBg);
    doc.rect(0, footerY - 5, pageWidth, 25, 'F');

    // Gold line
    doc.setDrawColor(...COLORS.gold);
    doc.setLineWidth(0.8);
    doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

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
    doc.text(`Report Generated: ${date}`, margin, footerY + 4);

    // Page number
    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, footerY + 4, { align: 'right' });

    // Disclaimer
    doc.setFontSize(6);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(130, 130, 130);
    doc.text(
      'This report is for informational purposes only. Consult a financial advisor for personalized advice.',
      pageWidth / 2,
      footerY + 10,
      { align: 'center' }
    );
  };

  // ========== PAGE BREAK CHECK ==========
  const checkPageBreak = (requiredSpace: number) => {
    if (currentY + requiredSpace > pageHeight - 30) {
      doc.addPage();
      currentY = 20;
      return true;
    }
    return false;
  };

  // ========== DRAW SECTION HEADER ==========
  const drawSectionHeader = (title: string, accentColor: [number, number, number] = COLORS.navy) => {
    checkPageBreak(20);
    
    // Accent bar
    doc.setFillColor(...accentColor);
    doc.roundedRect(margin, currentY, 4, 12, 2, 2, 'F');
    
    // Title
    doc.setTextColor(...COLORS.navy);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(title, margin + 8, currentY + 8);
    
    currentY += 18;
  };

  // ========== START PDF ==========
  drawLetterhead();

  // Report Title with decorative element
  doc.setTextColor(...COLORS.navy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(config.calculatorName, margin, currentY);
  
  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.mutedText);
  doc.text('Financial Planning Report', margin, currentY + 6);
  
  // Gold underline
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(1.5);
  doc.line(margin, currentY + 10, margin + 60, currentY + 10);
  
  currentY += 20;

  // ========== YOUR INPUTS SECTION ==========
  drawSectionHeader('Your Inputs', COLORS.navy);

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

    // Card background with shadow effect
    doc.setFillColor(...COLORS.white);
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, rowStartY, colWidth, 18, 3, 3, 'FD');
    
    // Left accent bar
    doc.setFillColor(...COLORS.gold);
    doc.roundedRect(x, rowStartY, 3, 18, 3, 0, 'F');
    doc.rect(x + 1.5, rowStartY, 1.5, 18, 'F');

    // Label
    doc.setTextColor(...COLORS.mutedText);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(input.label, x + 8, rowStartY + 6);

    // Value (bold, prominent)
    doc.setTextColor(...COLORS.navy);
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

  // Handle odd number of inputs
  if (col !== 0) {
    currentY = rowStartY + 22;
  }
  currentY += 8;

  // ========== RESULTS SECTION ==========
  drawSectionHeader('Calculation Results', COLORS.gold);

  // Find highlighted result
  const highlightedResult = config.results.find(r => r.highlight);
  
  // Premium highlight box for main result
  if (highlightedResult) {
    // Outer glow effect
    doc.setFillColor(...COLORS.goldLight);
    doc.roundedRect(margin - 2, currentY - 2, pageWidth - margin * 2 + 4, 38, 6, 6, 'F');
    
    // Main box
    doc.setFillColor(...COLORS.cream);
    doc.setDrawColor(...COLORS.gold);
    doc.setLineWidth(2);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 34, 4, 4, 'FD');

    // Icon/decoration
    doc.setFillColor(...COLORS.gold);
    doc.circle(margin + 12, currentY + 17, 6, 'F');
    doc.setTextColor(...COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Rs', margin + 12, currentY + 19, { align: 'center' });

    // Label
    doc.setTextColor(...COLORS.mutedText);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(highlightedResult.label, margin + 25, currentY + 10);

    // Value (large, bold)
    doc.setTextColor(...COLORS.navy);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text(String(highlightedResult.value), margin + 25, currentY + 24);

    // Subvalue if exists
    if (highlightedResult.subValue) {
      doc.setTextColor(...COLORS.mutedText);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.text(highlightedResult.subValue, margin + 25, currentY + 31);
    }

    currentY += 42;
  }

  // Other results in table
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
        fillColor: COLORS.navy,
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

  // ========== DATA TABLES (if any) ==========
  if (config.tables && config.tables.length > 0) {
    config.tables.forEach(table => {
      checkPageBreak(50);

      // Table title
      if (table.title) {
        doc.setFillColor(...COLORS.navyLight);
        doc.roundedRect(margin, currentY, 4, 10, 2, 2, 'F');
        doc.setTextColor(...COLORS.navy);
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
          fillColor: COLORS.navy,
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

  // ========== PREMIUM CTA SECTION ==========
  checkPageBreak(50);
  currentY += 5;

  // CTA Background
  doc.setFillColor(...COLORS.navy);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 40, 5, 5, 'F');

  // Gold top accent
  doc.setFillColor(...COLORS.gold);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 4, 5, 5, 'F');
  doc.setFillColor(...COLORS.navy);
  doc.rect(margin, currentY + 3, pageWidth - margin * 2, 2, 'F');

  // Decorative circles
  doc.setFillColor(255, 255, 255);
  doc.setGState(new (doc as any).GState({ opacity: 0.05 }));
  doc.circle(pageWidth - margin - 20, currentY + 20, 25, 'F');
  doc.circle(margin + 15, currentY + 35, 20, 'F');
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  // CTA Text
  doc.setTextColor(...COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Need Help Planning Your Financial Future?', pageWidth / 2, currentY + 16, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Book a FREE consultation with our certified financial experts', pageWidth / 2, currentY + 24, { align: 'center' });

  doc.setTextColor(...COLORS.gold);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Call: ${COMPANY.phone}  |  Email: ${COMPANY.email}`, pageWidth / 2, currentY + 34, { align: 'center' });

  // ========== DRAW FOOTERS ON ALL PAGES ==========
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages);
  }

  // ========== SAVE ==========
  const fileName = `${config.calculatorName.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

// Currency formatter for PDFs - Uses "Rs." for reliable rendering
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
