function findPublisherById(publisherData, id) {
    for (let category of publisherData) {
        for (let option of category.options) {
            if (option.id === id) {
                console.log("found option", option);
                return option;
            }
        }
    }
    return null;
}

export default findPublisherById;