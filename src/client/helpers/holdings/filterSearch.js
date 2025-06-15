import normalizeString from "../general/normalizeString";
import convertToDigits from "../general/convertToDigits";

const filterSearch = (holdingsData, searchCriteria) => {
  // Finish logic for filtering holdings data based on additional info, if present
  console.log(holdingsData, searchCriteria);
    const { title, composer, medium, genre, publisher } = searchCriteria;
  
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
  