import { Asset } from '../lib/store';
import { formatCurrency, formatDate } from '../lib/utils';

export const generateAssetReport = async (
  assets: Asset[],
  format: 'pdf' | 'excel'
): Promise<void> => {
  if (format === 'excel') {
    const csvContent = [
      ['Name', 'Category', 'Location', 'Status', 'Acquisition Date', 'Value', 'Description'].join(','),
      ...assets.map(asset => [
        asset.name,
        asset.category,
        asset.location,
        asset.status,
        formatDate(asset.acquisitionDate),
        formatCurrency(asset.value),
        asset.description,
      ].map(field => `"${field}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `assets-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // For PDF, you would typically use a library like jsPDF
    // This is a simplified example
    const content = assets.map(asset => `
      ${asset.name}
      Category: ${asset.category}
      Location: ${asset.location}
      Status: ${asset.status}
      Acquisition Date: ${formatDate(asset.acquisitionDate)}
      Value: ${formatCurrency(asset.value)}
      Description: ${asset.description}
      ---
    `).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `assets-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};