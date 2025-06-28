import normalizeString from "../general/normalizeString";
import convertToDigits from "../general/convertToDigits";

const filterSearch = (search, holdings) => {
  if (!search || !Array.isArray(holdings)) return holdings;

  // General search
  if (search.searchType === "general") {
    const tokens = search.generalQuery?.toLowerCase().split(/\s+/) || [];
    return holdings.filter(piece =>
      tokens.every(token =>
        normalizeString(piece.title).includes(token) ||
        normalizeString(piece.composer).includes(token)
      )
    );
  }

  // Basic or Advanced search
  const { title, composer, medium, genre, publisher } = search || {};

  const lowerTitle = title ? normalizeString(convertToDigits(title)).trim() : '';
  const lowerComposer = composer ? normalizeString(composer).trim() : '';
  const titleWords = lowerTitle.split(/\s+/);
  const composerWords = lowerComposer.split(/\s+/);

  const filteredHoldings = holdings.filter((item) => {
    const normalizedItemTitle = normalizeString(convertToDigits(item.title));
    const normalizedLastName = normalizeString(item.last_name || '');
    const normalizedFirstName = normalizeString(item.first_name || '');
    
    const titleMatch =
      !lowerTitle ||
      titleWords.every(word => normalizedItemTitle.includes(word));

    const composerMatch =
      !lowerComposer ||
      composerWords.some(word =>
        normalizedLastName.includes(word) || normalizedFirstName.includes(word)
      );

    const mediumMatch = !medium || item.medium === medium.label;
    const genreMatch = !genre || item.genre === genre.label;
    const publisherMatch = !publisher || item.publisher === publisher.label;

    return titleMatch && composerMatch && mediumMatch && genreMatch && publisherMatch;
  });
  return filteredHoldings;
};

export default filterSearch;
