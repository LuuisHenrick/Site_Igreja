import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import type { Member } from '../lib/store';

export const generatePDF = async (member: Member): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 54] // Standard credit card size
  });

  // Front of the card
  doc.setFillColor(79, 70, 229); // Indigo color
  doc.rect(0, 0, 85.6, 20, 'F');

  // Add member photo if available
  if (member.photo) {
    try {
      const img = new Image();
      img.src = member.photo;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      doc.addImage(img, 'JPEG', 5, 8, 15, 15);
    } catch (error) {
      console.error('Error loading member photo:', error);
    }
  }

  // Add member information
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('Igreja Evangelica Comunidade Vida', 25, 10);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(member.name, 25, 25);

  doc.setFontSize(10);
  doc.text(member.role, 25, 30);

  if (member.baptismDate) {
    doc.text(`Baptism: ${format(new Date(member.baptismDate), 'PP')}`, 25, 35);
  }

  if (member.conversionDate) {
    doc.text(`Conversion: ${format(new Date(member.conversionDate), 'PP')}`, 25, 40);
  }

  // Add QR code with member ID
  // doc.addImage(await generateQRCode(member.id), 'PNG', 65, 25, 15, 15);

  // Back of the card (new page)
  doc.addPage([85.6, 54]);

  doc.setFontSize(8);
  doc.text('Contact Information:', 5, 10);
  doc.text(member.email, 5, 15);
  doc.text(member.phone, 5, 20);

  doc.text('Address:', 5, 25);
  doc.text([
    `${member.address.street}, ${member.address.number}`,
    member.address.neighborhood,
    `${member.address.city}, ${member.address.state}`,
    `CEP: ${member.address.cep}`
  ], 5, 30);

  if (member.maritalStatus) {
    doc.text(`Marital Status: ${member.maritalStatus}`, 5, 45);
  }

  // Save the PDF
  doc.save(`member-card-${member.id}.pdf`);
};