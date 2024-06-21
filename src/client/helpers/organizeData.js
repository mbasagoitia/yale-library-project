function organizeMediumData(items) {
  const tree = {};

  items.forEach(item => {
      const { id, category_label, option_label, option_value, parent_id, nested_option_label, nested_option_value } = item;

      if (!tree[category_label]) {
          tree[category_label] = { label: category_label, options: [] };
      }
      let option = tree[category_label].options.find(opt => opt.value === option_value);

      if (!option) {
          option = { id, label: option_label, value: option_value, parent_id, nested_options: [] };
          tree[category_label].options.push(option);
      }

      if (nested_option_label && !option.nested_options.find(nestedOpt => nestedOpt.value === nested_option_value)) {
          option.nested_options.push({ label: nested_option_label, value: nested_option_value });
      }
  });

  return Object.values(tree);
}

const publisherCategoryLabels = {
  1: 'Major Publishers',
  2: 'Academic and Specialist',
  3: 'Independent Publishers',
  4: 'Historical and Early Music'
};

function organizePublisherData(items) {
  const categories = {};

  items.forEach(item => {
    const { publisher_category_id, label, abbr, id } = item;
    const categoryLabel = publisherCategoryLabels[publisher_category_id] || `Publisher Category ${publisher_category_id}`;

    if (!categories[publisher_category_id]) {
      categories[publisher_category_id] = {
        label: categoryLabel,
        options: []
      };
    }

    categories[publisher_category_id].options.push({
      label,
      abbr,
      id
    });
  });

  return Object.values(categories);
}

const speciesCategoryLabels = {
  1: 'Orchestral',
  2: 'Concertos',
  3: 'Chamber Music',
  4: 'Opera',
  5: 'Ballet',
  6: 'Vocal and Choral',
  7: 'Keyboard and Instrumental',
  8: 'Other Forms',
};

function organizeSpeciesData(items) {
  const categories = {};

  items.forEach(item => {
    const { species_category_id, label, abbr, id } = item;
    const categoryLabel = speciesCategoryLabels[species_category_id] || `Species Category ${species_category_id}`;

    if (!categories[species_category_id]) {
      categories[species_category_id] = {
        label: categoryLabel,
        options: []
      };
    }

    categories[species_category_id].options.push({
      label,
      abbr,
      id
    });
  });

  return Object.values(categories);
}

export {
  organizeMediumData,
  organizePublisherData,
  organizeSpeciesData
}
