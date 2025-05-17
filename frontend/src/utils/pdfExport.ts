import jsPDF from 'jspdf';
import { TimelineItem } from '../types/timeline';

export const exportTimelineToPDF = (topic: string, timelineData: TimelineItem[]) => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Set font styles
  const titleFont = 'helvetica';
  const bodyFont = 'helvetica';
  doc.setFont(titleFont, 'bold');

  // Add title
  doc.setFontSize(24);
  doc.text(`Timeline: ${topic}`, 20, 20);

  // Add generated date
  doc.setFontSize(10);
  doc.setFont(bodyFont, 'normal');
  doc.text(`Generated on ${new Date().toLocaleDateString()} by Timeonar`, 20, 30);

  // Sort timeline items by year
  const sortedData = [...timelineData].sort((a, b) => a.year - b.year);

  // Add timeline entries
  let yPosition = 40;
  doc.setFontSize(14);

  sortedData.forEach((item, index) => {
    // Check if we need a new page
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }

    // Add year and title
    doc.setFont(titleFont, 'bold');
    doc.setFontSize(14);
    doc.text(`${item.year}: ${item.title}`, 20, yPosition);
    yPosition += 7;

    // Add discovery if available
    if (item.discovery) {
      doc.setFont(bodyFont, 'italic');
      doc.setFontSize(10);
      doc.text(`Discovery: ${item.discovery}`, 20, yPosition);
      yPosition += 6;
    }

    // Add summary
    doc.setFont(bodyFont, 'normal');
    doc.setFontSize(10);
    
    // Handle summary text wrapping
    const splitSummary = doc.splitTextToSize(item.summary, 170);
    doc.text(splitSummary, 20, yPosition);
    yPosition += splitSummary.length * 5;

    // Add key insight if available
    if (item.keyInsight) {
      doc.setFont(bodyFont, 'italic');
      const splitInsight = doc.splitTextToSize(`Key Insight: ${item.keyInsight}`, 170);
      doc.text(splitInsight, 20, yPosition);
      yPosition += splitInsight.length * 5;
    }

    // Add source information if available
    if (item.source || (item.authors && item.authors.length > 0)) {
      doc.setFont(bodyFont, 'normal');
      doc.setFontSize(9);
      
      let sourceText = 'Source: ';
      if (item.source) {
        sourceText += item.source;
      }
      
      const sourceTextWidth = doc.getTextWidth(sourceText);
      doc.text(sourceText, 20, yPosition);
      
      // Add URL as a clickable link if available
      if (item.url) {
        const linkText = 'View Source';
        doc.setTextColor(0, 0, 238); // Blue color for links
        doc.setFont(bodyFont, 'underline');
        doc.textWithLink(linkText, 20 + sourceTextWidth + 3, yPosition, {
          url: item.url
        });
        doc.setTextColor(0, 0, 0); // Reset text color
        doc.setFont(bodyFont, 'normal');
      }
      
      yPosition += 5;
      
      if (item.authors && item.authors.length > 0) {
        const authorsText = `Authors: ${item.authors.join(', ')}`;
        const splitAuthors = doc.splitTextToSize(authorsText, 170);
        doc.text(splitAuthors, 20, yPosition);
        yPosition += splitAuthors.length * 4;
      }
      
      if (item.citationCount && item.citationCount !== "0") {
        doc.text(`Citations: ${item.citationCount}`, 20, yPosition);
        yPosition += 4;
      }
    }

    // Add methodology if available
    if (item.methodology) {
      yPosition += 3;
      doc.setFont(bodyFont, 'bold');
      doc.text("Methodology:", 20, yPosition);
      yPosition += 4;
      
      doc.setFont(bodyFont, 'normal');
      const splitMethodology = doc.splitTextToSize(item.methodology, 170);
      doc.text(splitMethodology, 20, yPosition);
      yPosition += splitMethodology.length * 4;
    }

    // Add theoretical paradigm if available
    if (item.theoreticalParadigm) {
      yPosition += 3;
      doc.setFont(bodyFont, 'bold');
      doc.text("Theoretical Paradigm:", 20, yPosition);
      yPosition += 4;
      
      doc.setFont(bodyFont, 'normal');
      const splitParadigm = doc.splitTextToSize(item.theoreticalParadigm, 170);
      doc.text(splitParadigm, 20, yPosition);
      yPosition += splitParadigm.length * 4;
    }

    // Add field evolution if available
    if (item.fieldEvolution) {
      yPosition += 3;
      doc.setFont(bodyFont, 'bold');
      doc.text("Field Evolution:", 20, yPosition);
      yPosition += 4;
      
      doc.setFont(bodyFont, 'normal');
      const splitEvolution = doc.splitTextToSize(item.fieldEvolution, 170);
      doc.text(splitEvolution, 20, yPosition);
      yPosition += splitEvolution.length * 4;
    }

    // Add a separator between entries
    yPosition += 8;
    if (index < sortedData.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPosition - 4, 190, yPosition - 4);
      yPosition += 4;
    }
  });

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount} | Generated by Timeonar`, doc.internal.pageSize.width / 2, 287, { align: 'center' });
  }

  // Save the PDF with a meaningful filename
  doc.save(`${topic.replace(/\s+/g, '_')}_timeline.pdf`);
};