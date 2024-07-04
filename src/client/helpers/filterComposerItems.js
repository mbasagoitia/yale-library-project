const filterComposerItems = (value, items) => {
    const lowerCaseValue = value.toLowerCase();
  
    const startsWithLastName = (item) => item.last_name.toLowerCase().startsWith(lowerCaseValue);
    const startsWithFirstName = (item) => item.first_name.toLowerCase().startsWith(lowerCaseValue);
    const includesLastName = (item) => item.last_name.toLowerCase().includes(lowerCaseValue);
    const includesFirstName = (item) => item.first_name.toLowerCase().includes(lowerCaseValue);
  
    const startsWithLastNameItems = items.filter(startsWithLastName);
    const startsWithFirstNameItems = items.filter(startsWithFirstName).filter(item => !startsWithLastName(item));
    const includesItems = items.filter(includesLastName).concat(items.filter(includesFirstName))
      .filter(item => !startsWithLastName(item) && !startsWithFirstName(item));
  
    // Combine lists with priority: last name starts with input value, first name starts with it, includes value anywhere
    const combinedItems = [...startsWithLastNameItems, ...startsWithFirstNameItems, ...includesItems];
  
    const filtered = combinedItems.slice(0, 10);
  
    return filtered;
  };
  
  export default filterComposerItems;
  