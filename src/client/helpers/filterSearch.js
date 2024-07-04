const filterSearch = (holdingsData, searchCriteria) => {
    console.log(holdingsData, searchCriteria);
    const { title, composer, medium, genre, publisher } = searchCriteria;
  
    // Helper function to normalize strings (e.g., "symphony no. 2" -> "symphony 2")
    const normalizeString = (str) => {
      return str
        .toLowerCase()
        .replace(/[\s-]+/g, ' ')
        .replace(/\bno\.\s*/g, '')
        .replace(/\bnumber\s*/g, '');
    };
  
    const convertToDigits = (str) => {
      const numWordsToDigits = {
        'one': '1',
        'two': '2',
        'three': '3',
        'four': '4',
        'five': '5',
        'six': '6',
        'seven': '7',
        'eight': '8',
        'nine': '9',
        'ten': '10'
      };
  
      return str.replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/g, (match) => numWordsToDigits[match]);
    };
  
    const lowerCaseTitle = title ? normalizeString(convertToDigits(title)).trim() : '';
    const lowerCaseComposer = composer ? normalizeString(composer).trim() : '';
    
    const titleWords = lowerCaseTitle.split(' ');
    const composerWords = lowerCaseComposer.split(' ');
  
    return holdingsData.filter((item) => {
      const normalizedItemTitle = normalizeString(convertToDigits(item.title));
      const normalizedItemLastName = normalizeString(item.last_name);
      const normalizedItemFirstName = normalizeString(item.first_name);
  
      // Check if item's title matches any of the title words if present
      const titleMatch = !lowerCaseTitle || titleWords.every(word => normalizedItemTitle.includes(word));
  
      // Check if item's last_name or first_name matches any of the composer words if present
      const composerMatch = !lowerCaseComposer ||
        composerWords.some(word =>
          normalizedItemLastName.includes(word) ||
          normalizedItemFirstName.includes(word)
        );
  
      return titleMatch && composerMatch;
    });
  };
  
  export default filterSearch;
  