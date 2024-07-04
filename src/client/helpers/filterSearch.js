const filterSearch = (holdingsData, searchCriteria) => {
    console.log(holdingsData, searchCriteria);
    const { title, composer, medium, genre, publisher } = searchCriteria;
    return holdingsData.filter((item) => {

        const lowerCaseTitle = title ? title.toLowerCase().trim() : '';
        const lowerCaseComposer = composer ? composer.toLowerCase().trim() : '';
    
        const composerWords = lowerCaseComposer.split(' ');
    
        // Check if item's title matches the title filter if present
        const titleMatch = !lowerCaseTitle || item.title.toLowerCase().includes(lowerCaseTitle);
    
        // Check if item's last_name or first_name matches any of the composer words if present
        const composerMatch = !lowerCaseComposer ||
            composerWords.some(word =>
                item.last_name.toLowerCase().includes(word) ||
                item.first_name.toLowerCase().includes(word)
            );
 
        return titleMatch && composerMatch;
    });
    
    
}

export default filterSearch;