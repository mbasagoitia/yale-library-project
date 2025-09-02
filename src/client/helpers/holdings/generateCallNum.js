const generateCallNum = (info) => {
    const { medium, identifierLabel, identifierValue, number, composer, genre, publisher } = info;
      let speciesTitle = ""
      if (genre) {
        speciesTitle = genre.abbr
      }
      if (identifierValue && number) {
        speciesTitle += ` ${identifierValue}/${number}`;
      } else if (identifierValue) {
        speciesTitle += ` ${identifierLabel} ${identifierValue}`;
      } else if (number) {
        speciesTitle += ` no.${number}`;
      }
      let call = [medium?.value || 0, composer?.cutter_number, speciesTitle, publisher?.abbr];
      // console.log(call);
      // Will return as an array; this allows us easy formatting on the showCallNum component and will join as a string to send to database
      return call;
}

export default generateCallNum;