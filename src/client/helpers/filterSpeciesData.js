function findGenreById(speciesData, id) {
    for (let category of speciesData) {
        for (let option of category.options) {
            if (option.id === id) {
                console.log("found option", option);
                return option;
            }
        }
    }
    return null;
}

export default findGenreById;