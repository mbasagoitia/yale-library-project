const filterItems = (value, items) => {
    const lowerCaseValue = value.toLowerCase();
  
    const startsWithFilter = (option) => option.label.toLowerCase().startsWith(lowerCaseValue);
    const includesFilter = (option) => option.label.toLowerCase().includes(lowerCaseValue);
  
    const filtered = items.map((category) => {
      const startsWithOptions = category.options.filter(startsWithFilter);
      const includesOptions = category.options.filter(includesFilter).filter(option => !startsWithFilter(option));
  
      // Combine lists with priority: starts with, then includes
      const combinedOptions = [...startsWithOptions, ...includesOptions];
  
      return {
        ...category,
        options: combinedOptions
      };
    }).filter((category) => category.options.length > 0);
  
    // Sort categories to prioritize those with options that start with the input value
    filtered.sort((a, b) => {
      const aStartsWith = a.options.some(startsWithFilter);
      const bStartsWith = b.options.some(startsWithFilter);
  
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return 0;
    });
  
    return filtered;
  };
  
  export default filterItems;
  