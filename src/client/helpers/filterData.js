function findMediumById(mediumData, id) {
    for (const category of mediumData) {
        for (const option of category.options) {
            if (option.id === id) {
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

function findComposerById(composerData, id) {
    for (const composer of composerData) {
        if (composer.id === id) {
            console.log("found option", composer);
            return composer;
        }
    }
    return null;
}

function findGenreById(speciesData, id) {
    for (let category of speciesData) {
        for (let option of category.options) {
            if (option.id === id) {
                return option;
            }
        }
    }
    return null;
}

function findPublisherById(publisherData, id) {
    for (let category of publisherData) {
        for (let option of category.options) {
            if (option.id === id) {
                return option;
            }
        }
    }
    return null;
}

export {
    findMediumById,
    findComposerById,
    findGenreById,
    findPublisherById
}