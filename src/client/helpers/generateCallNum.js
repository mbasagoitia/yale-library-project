const generateCallNum = (info) => {
    const { medium, identifierLabel, identifierValue, number, composer, genre, publisher } = info;
    console.log(info);
      let speciesTitle = genre.abbr;
      if (identifierValue && number) {
        speciesTitle += ` ${identifierValue}/${number}`;
      } else if (identifierValue) {
        speciesTitle += ` ${identifierLabel} ${identifierValue}`;
      } else if (number) {
        speciesTitle += ` no.${number}`;
      }
      let call = [medium.value, composer.cutter_number, speciesTitle, publisher.abbr];
      return call;
}

export default generateCallNum;