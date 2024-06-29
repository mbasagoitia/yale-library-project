

const fetchSingleMedium = async (mediumId) => {
    const mediumUrl = `http://localhost:5000/api/medium-data/${mediumId}`;
    try {
        const res = await fetch(mediumUrl);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching medium data:", error);
        return [];
    }
}

const fetchSingleComposer = async (composerId) => {
    const mediumUrl = `http://localhost:5000/api/composer-data/${composerId}`;
    try {
        const res = await fetch(mediumUrl);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching medium data:", error);
        return [];
    }
}

const fetchSingleSpecies = async (speciesId) => {
    const speciesUrl = `http://localhost:5000/api/species-data/${speciesId}`;
    try {
        const res = await fetch(speciesUrl);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching species data:", error);
        return [];
    }
}

const fetchSinglePublisher = async (publisherId) => {
    const publisherUrl = `http://localhost:5000/api/publisher-data/${publisherId}`;
    try {
        const res = await fetch(publisherUrl);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching publisher data:", error);
        return [];
    }
}

const fetchSingleResourceData = async (mediumId, composerId, speciesId, publisherId) => {
    try {
        const [mediumData, composerData, speciesData, publisherData] = await Promise.all([
            fetchSingleMedium(mediumId),
            fetchSingleComposer(composerId),
            fetchSingleSpecies(speciesId),
            fetchSinglePublisher(publisherId)
        ]);
        
        return [mediumData, composerData, speciesData, publisherData];
    } catch (error) {
        console.error("Error fetching resource data:", error);
        return [[], [], []];
    }
}

export default fetchSingleResourceData;
