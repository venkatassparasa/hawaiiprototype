import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';

// Export data to CSV
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  try {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export CSV');
  }
};

// Export table element to PDF
export const exportTableToPDF = async (tableElement, filename = 'export.pdf', options = {}) => {
  if (!tableElement) {
    console.warn('No table element provided for PDF export');
    return;
  }

  const {
    title = 'Report',
    orientation = 'landscape',
    includeSummary = true,
    summaryData = null
  } = options;

  try {
    // Create canvas from table
    const canvas = await html2canvas(tableElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 250;
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 20;

    // Add title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, pdfWidth / 2, 10, { align: 'center' });

    // Add summary if provided
    if (includeSummary && summaryData) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      let summaryY = 18;
      
      if (summaryData.totalRecords !== undefined) {
        pdf.text(`Total Records: ${summaryData.totalRecords}`, 10, summaryY);
        summaryY += 5;
      }
      
      if (summaryData.generatedAt) {
        pdf.text(`Generated: ${new Date(summaryData.generatedAt).toLocaleString()}`, 10, summaryY);
        summaryY += 5;
      }
      
      if (summaryData.appliedFilters && summaryData.appliedFilters.length > 0) {
        pdf.text('Filters:', 10, summaryY);
        summaryY += 5;
        summaryData.appliedFilters.forEach(filter => {
          const filterText = `${filter.field} ${filter.operator} ${filter.value}`;
          pdf.text(`  • ${filterText}`, 15, summaryY);
          summaryY += 4;
        });
      }
    }

    // Add table image
    pdf.addImage(imgData, 'PNG', imgX, imgY + (includeSummary && summaryData ? 20 : 0), imgWidth * ratio, imgHeight * ratio);

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export PDF');
  }
};

// Export data to PDF (table format)
export const exportDataToPDF = (data, filename = 'export.pdf', options = {}) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const {
    title = 'Report',
    includeHeaders = true,
    headers = null,
    includeSummary = true,
    summaryData = null
  } = options;

  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Add title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Add summary if provided
    if (includeSummary && summaryData) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      if (summaryData.totalRecords !== undefined) {
        pdf.text(`Total Records: ${summaryData.totalRecords}`, 10, yPosition);
        yPosition += 7;
      }
      
      if (summaryData.generatedAt) {
        pdf.text(`Generated: ${new Date(summaryData.generatedAt).toLocaleString()}`, 10, yPosition);
        yPosition += 7;
      }
      
      if (summaryData.appliedFilters && summaryData.appliedFilters.length > 0) {
        pdf.text('Filters:', 10, yPosition);
        yPosition += 7;
        summaryData.appliedFilters.forEach(filter => {
          const filterText = `${filter.field} ${filter.operator} ${filter.value}`;
          pdf.text(`  • ${filterText}`, 15, yPosition);
          yPosition += 5;
        });
      }
      yPosition += 5;
    }

    // Prepare table data
    const headersToUse = headers || Object.keys(data[0]);
    const tableData = data.map(row => headersToUse.map(header => row[header] || ''));

    // Calculate column widths
    const margin = 10;
    const tableWidth = pageWidth - (margin * 2);
    const columnWidth = tableWidth / headersToUse.length;

    // Draw table headers
    if (includeHeaders) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setFillColor(240, 240, 240);
      
      headersToUse.forEach((header, index) => {
        const x = margin + (index * columnWidth);
        pdf.rect(x, yPosition, columnWidth, 8, 'F');
        pdf.text(header, x + 2, yPosition + 5);
      });
      yPosition += 8;
    }

    // Draw table rows
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    data.forEach((row, rowIndex) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
        
        // Redraw headers on new page
        if (includeHeaders) {
          pdf.setFont('helvetica', 'bold');
          pdf.setFillColor(240, 240, 240);
          headersToUse.forEach((header, index) => {
            const x = margin + (index * columnWidth);
            pdf.rect(x, yPosition, columnWidth, 8, 'F');
            pdf.text(header, x + 2, yPosition + 5);
          });
          yPosition += 8;
          pdf.setFont('helvetica', 'normal');
        }
      }
      
      // Draw row
      headersToUse.forEach((header, colIndex) => {
        const x = margin + (colIndex * columnWidth);
        const cellValue = String(row[header] || '');
        
        // Truncate text if too long
        const maxChars = Math.floor(columnWidth / 3);
        const displayText = cellValue.length > maxChars ? cellValue.substring(0, maxChars) + '...' : cellValue;
        
        pdf.text(displayText, x + 2, yPosition + 5);
      });
      
      yPosition += 6;
    });

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error exporting data to PDF:', error);
    throw new Error('Failed to export PDF');
  }
};

// Utility function to format data for export
export const formatDataForExport = (records, fields, includeHeaders = true) => {
  if (!records || records.length === 0) {
    return [];
  }

  const headers = fields.map(field => field.label || field.id);
  
  if (includeHeaders) {
    const headerRow = {};
    headers.forEach((header, index) => {
      headerRow[header] = header;
    });
    return [headerRow, ...records];
  }
  
  return records;
};
