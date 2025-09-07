const fs = require('fs-extra');
const path = require('path');
const { parse } = require('json2csv');

const exportReadableBackup = async (db, filePath) => {
  try {
    const rows = await db('pieces as p')
      .innerJoin('composers as c', 'p.composer_id', 'c.id')
      .innerJoin('publisher_options as pub', 'p.publisher_id', 'pub.id')
      .innerJoin('conditions as con', 'p.condition_id', 'con.id')
      .select(
        db.ref('p.title').as('Title'),
        db.ref('c.last_name').as('Last Name'),
        db.ref('c.first_name').as('First Name'),
        db.ref('pub.label').as('Publisher'),
        db.ref('p.additional_notes').as('Notes'),
        db.ref('con.label').as('Condition'),
        db.ref('p.call_number').as('Call Number'),
        db.ref('p.acquisition_date').as('Acquisition Date'),
        db.ref('p.date_last_performed').as('Date Last Performed'),
      )
      .orderBy([{ column: 'c.last_name', order: 'asc' }, { column: 'p.title', order: 'asc' }]);

    // Format the date without the long time string and combine composer first/last name
    rows.forEach(row => {
      row.Composer = `${row["Last Name"]}, ${row["First Name"]}`;
      delete row["Last Name"];
      delete row["First Name"];
    
      const formatDate = (d) => {
        if (!d) return "";
        const dateObj = new Date(d);
        const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
        const dd = String(dateObj.getDate()).padStart(2, "0");
        const yyyy = dateObj.getFullYear();
        return `${mm}-${dd}-${yyyy}`;
      };
    
      if (row["Acquisition Date"]) {
        row["Acquisition Date"] = formatDate(row["Acquisition Date"]);
      }
    
      if (row["Date Last Performed"]) {
        row["Date Last Performed"] = formatDate(row["Date Last Performed"]);
      }
    });

    const csv = parse(rows, {
      fields: [
        'Title',
        'Composer',
        'Publisher',
        'Notes',
        'Condition',
        'Call Number',
        'Acquisition Date',
        'Date Last Performed',
      ],
    });

    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, csv, 'utf8');

    return { success: true, filePath };
  } catch (error) {
    return { success: false, message: 'Failed to export CSV backup.' };
  }
}

module.exports = {
  exportReadableBackup,
};
