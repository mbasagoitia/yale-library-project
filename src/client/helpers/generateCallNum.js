const generateCallNum = (info) => {
    const { medium, opus, number, composer, genre, publisher } = info;
    console.log(info);
      let speciesTitle = genre.abbr;
      if (opus && number) {
        speciesTitle += ` ${opus}/${number}`;
      } else if (opus) {
        speciesTitle += ` Op.${opus}`;
      } else if (number) {
        speciesTitle += ` no.${number}`;
      }
      let call = [medium.value, composer.cutterNumber, speciesTitle, publisher.abbr];
      return call;
}

export default generateCallNum;