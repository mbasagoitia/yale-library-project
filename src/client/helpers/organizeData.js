function organizeData(items) {
    const tree = {};
  
    items.forEach(item => {
      const { category_label, option_label, option_value, parent_id, nested_option_label, nested_option_value } = item;
  
      // Initialize the category if it does not exist
      if (!tree[category_label]) {
        tree[category_label] = { label: category_label, options: [] };
      }
  
      // Find existing option or create a new one
      let option = tree[category_label].options.find(opt => opt.value === option_value);
  
      if (!option) {
        option = { label: option_label, value: option_value, parent_id, nested_options: [] };
        tree[category_label].options.push(option);
      }
  
      // Add nested options if they exist
      if (nested_option_label && !option.nested_options.find(nestedOpt => nestedOpt.value === nested_option_value)) {
        option.nested_options.push({ label: nested_option_label, value: nested_option_value });
      }
    });
  
    return Object.values(tree);
  }
  
  export default organizeData;
  