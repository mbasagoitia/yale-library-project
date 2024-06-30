const mediumUrl = "http://localhost:5000/api/medium-data";
const composerUrl = "http://localhost:5000/api/composer-data";
const speciesUrl = "http://localhost:5000/api/species-data";
const publisherUrl = "http://localhost:5000/api/publisher-data";

const fetchMediumData = async () => {
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

const fetchComposerData = async () => {
    try {
        const res = await fetch(composerUrl);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching medium data:", error);
        return [];
    }
}

const fetchSpeciesData = async () => {
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

const fetchPublisherData = async () => {
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

const fetchResourceData = async () => {
    try {
        const [mediumData, composerData, speciesData, publisherData] = await Promise.all([
            fetchMediumData(),
            fetchComposerData(),
            fetchSpeciesData(),
            fetchPublisherData()
        ]);
        
        return [mediumData, composerData, speciesData, publisherData];
    } catch (error) {
        console.error("Error fetching resource data:", error);
        return [[], [], []];
    }
}

export default fetchResourceData;
