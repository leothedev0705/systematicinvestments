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
  gold: [212, 168, 83] as [number, number, number],
  darkText: [30, 41, 59] as [number, number, number],
  mutedText: [100, 116, 139] as [number, number, number],
  lightBg: [248, 250, 252] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  success: [34, 197, 94] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
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
    // Navy header bar
    doc.setFillColor(...COLORS.navy);
    doc.rect(0, 0, pageWidth, 38, 'F');

    // Gold accent stripe
    doc.setFillColor(...COLORS.gold);
    doc.rect(0, 38, pageWidth, 2.5, 'F');

    // Company name
    doc.setTextColor(...COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(COMPANY.name, margin, 16);

    // Tagline with gold color
    doc.setTextColor(...COLORS.gold);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.text(COMPANY.tagline, margin, 24);

    // Established
    doc.setTextColor(180, 180, 180);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(COMPANY.established, margin, 32);

    // Contact details (right aligned)
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(8);
    const rightX = pageWidth - margin;
    doc.text(COMPANY.phone, rightX, 14, { align: 'right' });
    doc.text(COMPANY.email, rightX, 20, { align: 'right' });
    doc.text(COMPANY.website, rightX, 26, { align: 'right' });
    doc.text(COMPANY.address.split(',')[0], rightX, 32, { align: 'right' });

    currentY = 50;
  };

  // ========== PREMIUM FOOTER ==========
  const drawFooter = (pageNum: number, totalPages: number) => {
    const footerY = pageHeight - 18;

    // Gold line
    doc.setDrawColor(...COLORS.gold);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

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
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, footerY + 4, { align: 'right' });

    // Disclaimer (small)
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text(
      'This is a calculation report based on user inputs. Please consult a financial advisor for personalized advice.',
      pageWidth / 2,
      footerY + 9,
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

  // ========== START PDF ==========
  drawLetterhead();

  // Report Title
  doc.setTextColor(...COLORS.navy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(config.calculatorName + ' Report', margin, currentY);
  currentY += 10;

  // Decorative line under title
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(1);
  doc.line(margin, currentY - 4, margin + 50, currentY - 4);
  currentY += 4;

  // ========== USER INPUTS SECTION ==========
  // Section header with accent
  doc.setFillColor(...COLORS.navy);
  doc.roundedRect(margin, currentY, 3, 10, 1, 1, 'F');
  doc.setTextColor(...COLORS.navy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Your Inputs', margin + 7, currentY + 7);
  currentY += 16;

  // Input cards in 2-column grid
  const colWidth = (pageWidth - margin * 2 - 8) / 2;
  let col = 0;
  let rowStartY = currentY;

  config.inputs.forEach((input, index) => {
    const x = margin + col * (colWidth + 8);
    
    checkPageBreak(18);
    if (index > 0 && col === 0) {
      rowStartY = currentY;
    }

    // Card background
    doc.setFillColor(...COLORS.lightBg);
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, rowStartY, colWidth, 16, 2, 2, 'FD');

    // Label (small, muted)
    doc.setTextColor(...COLORS.mutedText);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(input.label, x + 4, rowStartY + 5);

    // Value (bold, prominent)
    doc.setTextColor(...COLORS.navy);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    const displayValue = input.unit ? `${input.value}${input.unit}` : String(input.value);
    doc.text(displayValue, x + 4, rowStartY + 12);

    col++;
    if (col >= 2) {
      col = 0;
      currentY = rowStartY + 20;
    }
  });

  // Handle odd number of inputs
  if (col !== 0) {
    currentY = rowStartY + 20;
  }
  currentY += 8;

  // ========== RESULTS SECTION ==========
  checkPageBreak(60);

  // Section header
  doc.setFillColor(...COLORS.gold);
  doc.roundedRect(margin, currentY, 3, 10, 1, 1, 'F');
  doc.setTextColor(...COLORS.navy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Calculation Results', margin + 7, currentY + 7);
  currentY += 16;

  // Find highlighted result for feature display
  const highlightedResult = config.results.find(r => r.highlight);
  
  // If there's a highlighted result, show it prominently first
  if (highlightedResult) {
    // Premium highlight box
    doc.setFillColor(255, 251, 235); // Warm cream
    doc.setDrawColor(...COLORS.gold);
    doc.setLineWidth(1.5);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 28, 4, 4, 'FD');

    // Label
    doc.setTextColor(...COLORS.mutedText);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(highlightedResult.label, pageWidth / 2, currentY + 8, { align: 'center' });

    // Value (large, bold)
    doc.setTextColor(...COLORS.navy);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(String(highlightedResult.value), pageWidth / 2, currentY + 20, { align: 'center' });

    // Subvalue if exists
    if (highlightedResult.subValue) {
      doc.setTextColor(...COLORS.mutedText);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(highlightedResult.subValue, pageWidth / 2, currentY + 25, { align: 'center' });
    }

    currentY += 35;
  }

  // Results table
  const resultsData = config.results
    .filter(r => !r.highlight) // Exclude highlighted (already shown above)
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
        cellPadding: 5,
        lineColor: COLORS.border,
        lineWidth: 0.2,
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
        0: { cellWidth: 85, fontStyle: 'normal' },
        1: { fontStyle: 'bold', halign: 'right' },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
  }

  // ========== DATA TABLES (if any) ==========
  if (config.tables && config.tables.length > 0) {
    config.tables.forEach(table => {
      checkPageBreak(50);

      // Table title
      if (table.title) {
        doc.setFillColor(...COLORS.navy);
        doc.roundedRect(margin, currentY, 3, 8, 1, 1, 'F');
        doc.setTextColor(...COLORS.navy);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(table.title, margin + 7, currentY + 6);
        currentY += 12;
      }

      autoTable(doc, {
        startY: currentY,
        head: [table.headers],
        body: table.rows.map(row => row.map(cell => String(cell))),
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 8,
          cellPadding: 3,
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

      currentY = (doc as any).lastAutoTable.finalY + 10;
    });
  }

  // ========== CALL TO ACTION ==========
  checkPageBreak(40);
  currentY += 5;

  // CTA Box with gradient effect
  doc.setFillColor(...COLORS.navy);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 30, 4, 4, 'F');

  // Gold accent on top of CTA
  doc.setFillColor(...COLORS.gold);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 3, 4, 4, 'F');
  doc.setFillColor(...COLORS.navy);
  doc.rect(margin, currentY + 2, pageWidth - margin * 2, 1, 'F');

  // CTA Text
  doc.setTextColor(...COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Need Help Planning Your Financial Future?', pageWidth / 2, currentY + 12, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Book a FREE consultation with our experts', pageWidth / 2, currentY + 19, { align: 'center' });

  doc.setTextColor(...COLORS.gold);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`📞 ${COMPANY.phone}  |  ✉️ ${COMPANY.email}`, pageWidth / 2, currentY + 26, { align: 'center' });

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

// Currency formatter for PDFs
export function formatCurrencyPDF(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}
