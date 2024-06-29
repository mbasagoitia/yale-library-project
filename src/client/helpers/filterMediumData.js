function findObjectById(mediumData, id) {
    for (const category of mediumData) {
        for (const option of category.options) {
            if (option.id === id) {
                console.log("found option", option);
                return option;
            }
            if (option.nested_options) {
                for (const nestedOption of option.nested_options) {
                    if (nestedOption.id === id) {
                        return nestedOption;
                    }
                }
            }
        }
    }
    return null;
}

export default findObjectById;