import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { useStore } from '../../lib/store';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { formatCurrency, formatDate } from '../../lib/utils';

export const ExportReports: React.FC = () => {
  const store = useStore();

  const generateExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Members sheet
    const membersData = store.members.map(member => ({
      'Name': member.name,
      'Email': member.email,
      'Phone': member.phone,
      'Role': member.role,
      'Status': member.status,
      'Birth Date': formatDate(member.birthDate),
      'Baptized': member.isBaptized ? 'Yes' : 'No',
    }));
    const membersSheet = XLSX.utils.json_to_sheet(membersData);
    XLSX.utils.book_append_sheet(workbook, membersSheet, 'Members');

    // Financial sheet
    const financialData = store.financialRecords.map(record => ({
      'Date': formatDate(record.date),
      'Type': record.type,
      'Category': record.category,
      'Amount': formatCurrency(record.amount),
      'Description': record.description,
    }));
    const financialSheet = XLSX.utils.json_to_sheet(financialData);
    XLSX.utils.book_append_sheet(workbook, financialSheet, 'Financial');

    // Assets sheet
    const assetsData = store.assets.map(asset => ({
      'Name': asset.name,
      'Category': asset.category,
      'Status': asset.status,
      'Value': formatCurrency(asset.value),
      'Location': asset.location,
    }));
    const assetsSheet = XLSX.utils.json_to_sheet(assetsData);
    XLSX.utils.book_append_sheet(workbook, assetsSheet, 'Assets');

    // Save the workbook
    XLSX.writeFile(workbook, 'church-management-report.xlsx');
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.text('Church Management Report', 20, yPos);
    yPos += 20;

    // Summary Statistics
    doc.setFontSize(16);
    doc.text('Summary Statistics', 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.text(`Total Members: ${store.members.length}`, 20, yPos);
    yPos += 10;
    doc.text(`Total Events: ${store.events.length + store.educationEvents.length}`, 20, yPos);
    yPos += 10;
    doc.text(`Total Assets: ${store.assets.length}`, 20, yPos);
    yPos += 10;

    // Financial Summary
    const totalIncome = store.financialRecords
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = store.financialRecords
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);

    yPos += 10;
    doc.setFontSize(16);
    doc.text('Financial Summary', 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.text(`Total Income: ${formatCurrency(totalIncome)}`, 20, yPos);
    yPos += 10;
    doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 20, yPos);
    yPos += 10;
    doc.text(`Net Balance: ${formatCurrency(totalIncome - totalExpenses)}`, 20, yPos);

    // Save the PDF
    doc.save('church-management-report.pdf');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Export Reports</h2>
      
      <div className="space-y-4">
        <Button
          onClick={generateExcel}
          icon={Download}
          className="w-full"
        >
          Export to Excel
        </Button>

        <Button
          onClick={generatePDF}
          icon={Download}
          variant="secondary"
          className="w-full"
        >
          Export to PDF
        </Button>
      </div>
    </div>
  );
};