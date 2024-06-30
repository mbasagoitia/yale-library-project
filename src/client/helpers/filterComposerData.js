function findComposerById(composerData, id) {
    for (const composer of composerData) {
        if (composer.id === id) {
            console.log("found option", composer);
            return composer;
        }
    }
    return null;
}

export default findComposerById;