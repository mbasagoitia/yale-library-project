
import { toast } from "react-toastify";import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.vfs;


const formatValue = (value) => {
  if (Array.isArray(value)) return value.join(', ');
  if (value instanceof Date) return value.toLocaleDateString();
  if (value === null || value === undefined) return '';
  return value.toString();
};

const generateReport = (data) => {
  const { reportType, holdings } = data;

  if (!holdings || holdings.length === 0) {
    toast.error('No holdings data provided.');
    return;
  }

  const grouped = {};
  holdings.forEach(item => {
    const composer = item.Composer || '';
    if (!grouped[composer]) grouped[composer] = [];
    grouped[composer].push(item);
  });

  const reportTitles = {
    'all': 'All Holdings',
    'missing': 'Missing Parts',
    'poor-condition': 'Poor Condition',
    'condition-summary': 'Condition Summary',
    'music-by-composer': 'Music by Composer',
    'performance-history': 'Performance History'
  };
  
  const subHeadingText = reportTitles[reportType] || reportType;
  
  const content = [
    { text: 'Philharmonia Library Report', style: 'header' },
    { text: subHeadingText, style: 'subHeading' }
  ];

  Object.entries(grouped).forEach(([composer, pieces]) => {
    const headings = Object.keys(pieces[0]).filter(key => key !== 'Composer' && key !== 'TotalPiecesByComposer');
  
    const body = [
      headings.map(h => ({ text: h, style: 'tableHeader' }))
    ];
  
    pieces.forEach(row => {
      body.push(headings.map(key => formatValue(row[key])));
    });
  
    let composerLabel = composer;
    if (reportType === 'music-by-composer' && pieces[0].TotalPiecesByComposer) {
      composerLabel += ` (${pieces[0].TotalPiecesByComposer})`;
    }
  
    content.push({ text: composerLabel, style: 'composerHeader', margin: [0, 10, 0, 4] });
    content.push({
      table: {
        headerRows: 1,
        widths: Array(headings.length).fill('*'),
        body
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 10]
    });
  });
  

  const docDefinition = {
    pageOrientation: reportType === "all" ? 'landscape' : 'portrait',
    content,
    styles: {
      header: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subHeading: {
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      composerHeader: {
        fontSize: 10,
        bold: true,
        margin: [0, 10, 0, 4]
      },
      tableHeader: {
        bold: true,
        fillColor: '#eeeeee'
      }
    },
    defaultStyle: {
      fontSize: 8
    }
  };

  pdfMake.createPdf(docDefinition).download(`library-report-${reportType}.pdf`);
};

export default generateReport;
