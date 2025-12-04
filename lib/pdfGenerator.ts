import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Company details
const COMPANY = {
  name: "Systematic Investments",
  tagline: "Where Growth Meets Stability",
  address: "Shri Ram Tower, Near Ginger Hotel, Wakad, Pune - 411057",
  phone: "+91 98909 68995",
  email: "vivekbhande79@gmail.com",
  website: "www.systematicinvestments.in",
  established: "Est. 1996",
};

// Colors
const COLORS = {
  primary: [10, 37, 64] as [number, number, number],      // Navy #0A2540
  accent: [212, 168, 83] as [number, number, number],     // Gold #D4A853
  text: [51, 51, 51] as [number, number, number],         // Dark gray
  muted: [128, 128, 128] as [number, number, number],     // Gray
  lightBg: [248, 250, 252] as [number, number, number],   // Light background
  white: [255, 255, 255] as [number, number, number],
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
  calculatorDescription: string;
  inputs: PDFInputField[];
  results: PDFResultField[];
  tables?: PDFTableData[];
  assumptions?: string[];
  insights?: string[];
  chartImage?: string; // Base64 image
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

  // ===== HEADER / LETTERHEAD =====
  const drawHeader = () => {
    // Navy header background
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Gold accent line
    doc.setFillColor(...COLORS.accent);
    doc.rect(0, 40, pageWidth, 3, 'F');

    // Company name
    doc.setTextColor(...COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(COMPANY.name, margin, 18);

    // Tagline
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.accent);
    doc.text(COMPANY.tagline, margin, 26);

    // Established badge
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.white);
    doc.text(COMPANY.established, margin, 34);

    // Contact info (right side)
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    const rightX = pageWidth - margin;
    doc.text(COMPANY.phone, rightX, 18, { align: 'right' });
    doc.text(COMPANY.email, rightX, 24, { align: 'right' });
    doc.text(COMPANY.website, rightX, 30, { align: 'right' });

    currentY = 53;
  };

  // ===== FOOTER =====
  const drawFooter = (pageNum: number, totalPages: number) => {
    const footerY = pageHeight - 20;

    // Footer line
    doc.setDrawColor(...COLORS.accent);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);

    // Disclaimer
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.muted);
    doc.setFont('helvetica', 'italic');
    doc.text(
      'Disclaimer: This report is for informational purposes only and does not constitute financial advice. Past performance is not indicative of future results.',
      margin,
      footerY + 5,
      { maxWidth: pageWidth - margin * 2 }
    );

    // Page number
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, footerY + 10, { align: 'right' });

    // Generation date
    const date = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    doc.text(`Generated on: ${date}`, margin, footerY + 10);
  };

  // ===== CHECK PAGE BREAK =====
  const checkPageBreak = (requiredSpace: number) => {
    if (currentY + requiredSpace > pageHeight - 30) {
      doc.addPage();
      currentY = 20;
      return true;
    }
    return false;
  };

  // ===== SECTION TITLE =====
  const drawSectionTitle = (title: string) => {
    checkPageBreak(15);
    doc.setFillColor(...COLORS.primary);
    doc.rect(margin, currentY, 4, 8, 'F');
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(title, margin + 8, currentY + 6);
    currentY += 14;
  };

  // ===== START PDF GENERATION =====
  drawHeader();

  // Calculator Title
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(config.calculatorName, margin, currentY);
  currentY += 6;

  // Calculator Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.muted);
  doc.text(config.calculatorDescription, margin, currentY, { maxWidth: pageWidth - margin * 2 });
  currentY += 12;

  // Divider
  doc.setDrawColor(...COLORS.lightBg);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 10;

  // ===== YOUR INPUTS =====
  drawSectionTitle('Your Inputs');

  // Input grid (2 columns)
  const inputColWidth = (pageWidth - margin * 2 - 10) / 2;
  let inputX = margin;
  let inputStartY = currentY;
  let maxInputY = currentY;

  config.inputs.forEach((input, index) => {
    if (index > 0 && index % 2 === 0) {
      inputX = margin;
      inputStartY = maxInputY + 2;
    }

    checkPageBreak(16);

    // Input box background
    doc.setFillColor(...COLORS.lightBg);
    doc.roundedRect(inputX, inputStartY, inputColWidth, 14, 2, 2, 'F');

    // Label
    doc.setTextColor(...COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(input.label, inputX + 4, inputStartY + 5);

    // Value
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    const displayValue = input.unit ? `${input.value}${input.unit}` : String(input.value);
    doc.text(displayValue, inputX + 4, inputStartY + 11);

    maxInputY = Math.max(maxInputY, inputStartY + 14);

    if (index % 2 === 0) {
      inputX = margin + inputColWidth + 10;
    }
  });

  currentY = maxInputY + 10;

  // ===== RESULTS =====
  drawSectionTitle('Calculation Results');

  // Results in a table format
  const resultsData = config.results.map(result => [
    result.label,
    result.subValue ? `${result.value}\n${result.subValue}` : String(result.value),
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Parameter', 'Value']],
    body: resultsData,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: COLORS.lightBg,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { fontStyle: 'bold', halign: 'right' },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // ===== HIGHLIGHT BOX FOR KEY RESULT =====
  const primaryResult = config.results.find(r => r.highlight) || config.results[0];
  if (primaryResult) {
    checkPageBreak(30);

    // Gold border box
    doc.setFillColor(255, 250, 240);
    doc.setDrawColor(...COLORS.accent);
    doc.setLineWidth(1);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 25, 3, 3, 'FD');

    // Label
    doc.setTextColor(...COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(primaryResult.label, pageWidth / 2, currentY + 8, { align: 'center' });

    // Value
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(String(primaryResult.value), pageWidth / 2, currentY + 18, { align: 'center' });

    currentY += 35;
  }

  // ===== DATA TABLES =====
  if (config.tables && config.tables.length > 0) {
    config.tables.forEach(table => {
      checkPageBreak(40);
      
      if (table.title) {
        drawSectionTitle(table.title);
      }

      autoTable(doc, {
        startY: currentY,
        head: [table.headers],
        body: table.rows.map(row => row.map(cell => String(cell))),
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: COLORS.primary,
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

  // ===== ASSUMPTIONS =====
  if (config.assumptions && config.assumptions.length > 0) {
    checkPageBreak(30);
    drawSectionTitle('Assumptions');

    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    config.assumptions.forEach((assumption, index) => {
      checkPageBreak(8);
      doc.text(`• ${assumption}`, margin + 4, currentY);
      currentY += 6;
    });

    currentY += 5;
  }

  // ===== INSIGHTS =====
  if (config.insights && config.insights.length > 0) {
    checkPageBreak(30);
    drawSectionTitle('Key Insights');

    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    config.insights.forEach((insight, index) => {
      checkPageBreak(10);
      const lines = doc.splitTextToSize(`${index + 1}. ${insight}`, pageWidth - margin * 2 - 8);
      doc.text(lines, margin + 4, currentY);
      currentY += lines.length * 5 + 3;
    });
  }

  // ===== CTA SECTION =====
  checkPageBreak(35);
  currentY += 5;

  // CTA Box
  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 28, 3, 3, 'F');

  doc.setTextColor(...COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Need Personalized Financial Advice?', pageWidth / 2, currentY + 10, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Book a FREE consultation with our experts to create a customized financial plan.', pageWidth / 2, currentY + 17, { align: 'center' });

  doc.setTextColor(...COLORS.accent);
  doc.setFont('helvetica', 'bold');
  doc.text(`Call: ${COMPANY.phone} | Email: ${COMPANY.email}`, pageWidth / 2, currentY + 24, { align: 'center' });

  // ===== DRAW FOOTERS ON ALL PAGES =====
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages);
  }

  // ===== SAVE PDF =====
  const fileName = `${config.calculatorName.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

// Helper to format currency for PDF
export function formatCurrencyPDF(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `₹${amount}`;
}

