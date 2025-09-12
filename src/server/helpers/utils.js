const to01 = (v) => (v ? 1 : 0);

const fmtDate = (d) => {
  // helper to format a valid Date -> "YYYY-MM-DD"
  const format = (dt) => {
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // obvious empty/nullish checks
  if (d === null || d === undefined || d === '') return null;

  // If already a Date object
  if (d instanceof Date) {
    if (Number.isNaN(d.getTime())) return null;
    return format(d);
  }

  // If a number (timestamp ms)
  if (typeof d === 'number') {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return null;
    return format(dt);
  }

  // If a plain string (trim and attempt several strategies)
  if (typeof d === 'string') {
    const s = d.trim();
    if (!s) return null;

    // 1) If it's already "YYYY-MM-DD"
    const dateOnly = s.match(/^(\d{4}-\d{2}-\d{2})$/);
    if (dateOnly) return dateOnly[1];

    // 2) If it starts with ISO-ish "YYYY-MM-DD..." -> grab prefix
    const isoPrefix = s.match(/^(\d{4}-\d{2}-\d{2})/);
    if (isoPrefix) return isoPrefix[1];

    // 3) fallback: try Date.parse
    const parsed = Date.parse(s);
    if (!Number.isNaN(parsed)) {
      return format(new Date(parsed));
    }

    return null;
  }

  // If it's an object (mongo-ish or wrapper), try a few common shapes
  if (typeof d === 'object') {
    // e.g. { $date: '2025-09-11T04:00:00.000Z' }
    if (d.$date) return fmtDate(d.$date);
    if (d.date) return fmtDate(d.date);
    if (d.value) return fmtDate(d.value);

    // If it has a toISOString method (some Date-like objects), use it
    if (typeof d.toISOString === 'function') {
      try {
        return fmtDate(d.toISOString());
      } catch (e) {
        // fall through to null return
      }
    }
  }

  // unknown shape -> return null
  return null;
}

module.exports = {
    to01,
    fmtDate
}