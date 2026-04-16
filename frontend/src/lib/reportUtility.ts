import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a comprehensive practice performance report in PDF format.
 * Includes firm branding, financial summaries, and operational analytics.
 */
export const generateFullReport = async (data: any) => {
  // 1. Initialize Document
  const doc = new jsPDF();
  const now = new Date();
  const dateString = now.toLocaleDateString('en-KE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // 2. Add Branding & Header
  try {
    const logoUrl = '/logo.svg';
    const response = await fetch(logoUrl);
    const svgText = await response.text();
    
    // Safely encode SVG for PDF inclusion
    const svgBase64 = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgText)))}`;
    
    // Draw Logo (Positioned top-left)
    doc.addImage(svgBase64, 'SVG', 15, 12, 18, 18);
  } catch (err) {
    console.warn('Logo could not be rendered in PDF, using text fallback.', err);
  }

  // Firm Name & Tagline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(14, 47, 79); // WakiliSmart Navy (#0E2F4F)
  doc.text('WakiliSmart ERP', 38, 22);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('Professional Legal Management & ERP Solutions', 38, 28);
  
  // Decorative Header Line
  doc.setDrawColor(226, 232, 240); // border color
  doc.line(15, 36, 195, 36);

  // 3. Report Title & Date
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('Practice Performance Review', 15, 52);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Reporting Period: Year to Date (${now.getFullYear()})`, 15, 58);
  doc.text(`Generated on: ${dateString}`, 15, 63);

  // 4. Section: Financial Summary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Financial Summary', 15, 76);

  const financialStats = [
    ['Metric', 'Value'],
    ['Total Billed (YTD)', `KES ${data?.stats?.totalBilled?.toLocaleString() || '0'}`],
    ['Total Collected', `KES ${data?.stats?.totalCollected?.toLocaleString() || '0'}`],
    ['Collection Rate', `${data?.stats?.totalBilled > 0 ? ((data.stats.totalCollected / data.stats.totalBilled) * 100).toFixed(1) : '0'}%`],
  ];

  autoTable(doc, {
    startY: 81,
    head: [financialStats[0]],
    body: financialStats.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [14, 47, 79], textColor: 255, fontStyle: 'bold' },
    styles: { cellPadding: 4, fontSize: 10 },
    margin: { left: 15, right: 15 },
  });

  // 5. Section: Operational Metrics
  const operationalStart = (doc as any).lastAutoTable.finalY + 15;
  doc.text('2. Operational Efficiency', 15, operationalStart);

  const operationalStats = [
    ['Metric', 'Active State'],
    ['Active Legal Matters', data?.stats?.activeCases?.toString() || '0'],
    ['Billable Hours Recorded', `${data?.stats?.billableHours?.toLocaleString() || '0'} hours`],
  ];

  autoTable(doc, {
    startY: operationalStart + 5,
    head: [operationalStats[0]],
    body: operationalStats.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
    styles: { cellPadding: 4, fontSize: 10 },
    margin: { left: 15, right: 15 },
  });

  // 6. Section: Revenue Trends (If data exists)
  if (data?.revenueData && data.revenueData.length > 0) {
    const trendStart = (doc as any).lastAutoTable.finalY + 15;
    doc.text('3. Monthly Revenue Trends', 15, trendStart);

    const trendRows = data.revenueData.map((d: any) => [d.name, `KES ${d.revenue?.toLocaleString()}`]);
    
    autoTable(doc, {
      startY: trendStart + 5,
      head: [['Month', 'Revenue']],
      body: trendRows,
      theme: 'plain',
      styles: { cellPadding: 3, fontSize: 9 },
      headStyles: { fontStyle: 'bold', textColor: [14, 47, 79] },
      margin: { left: 15, right: 15 },
    });
  }

  // 7. Footer & Page Numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      '© 2026 WakiliSmart ERP. This document is for official firm use only.',
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // 8. Download
  const filename = `WakiliSmart_Report_${now.getFullYear()}_${now.getMonth()+1}_${now.getDate()}.pdf`;
  doc.save(filename);
};
