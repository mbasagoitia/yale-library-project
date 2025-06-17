import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const formatValue = (value) => {
  if (Array.isArray(value)) return value.join(', ');
  if (value instanceof Date) return value.toLocaleDateString();
  if (value === null || value === undefined) return '';
  return value.toString();
};

const generateReport = (data) => {
  const { reportType, holdings } = data;

  if (!holdings || holdings.length === 0) {
    console.error('No holdings data provided.');
    return;
  }

  const headings = Object.keys(holdings[0]);

  const tableBody = [
    headings,
    ...holdings.map(item => headings.map(key => formatValue(item[key])))
  ];

  const docDefinition = {
    content: [
      { text: 'Library Report', style: 'header' },
      { text: reportType, style: 'subHeading' },
      {
        table: {
          headerRows: 1,
          widths: Array(headings.length).fill('*'),
          body: tableBody
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subHeading: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 10]
      }
    },
    defaultStyle: {
      fontSize: 10
    }
  };

  pdfMake.createPdf(docDefinition).download(`library-report-${reportType}.pdf`);
};

export default generateReport;
