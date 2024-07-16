// Helper function to normalize strings (e.g., "symphony no. 2" -> "symphony 2")
const normalizeString = (str) => {
    return str
    .toLowerCase()
    .replace(/[\s-]+/g, ' ')
    .replace(/\bno\.\s*/g, '')
    .replace(/\bnumber\s*/g, '');
};

export default normalizeString;