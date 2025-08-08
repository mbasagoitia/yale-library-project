import { organizeMediumData, organizePublisherData, organizeSpeciesData } from "./organizeData";
import { toast } from "react-toastify";

const mediumUrl = "http://localhost:5000/api/resources/medium-data";
const composerUrl = "http://localhost:5000/api/resources/composer-data";
const speciesUrl = "http://localhost:5000/api/resources/species-data";
const publisherUrl = "http://localhost:5000/api/resources/publisher-data";

const fetchMediumData = async () => {
  try {
    const res = await fetch(mediumUrl);
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || "Something went wrong while fetching medium data");
    }

    return Array.isArray(data) ? organizeMediumData(data) : [];
  } catch (error) {
    toast.error(error.message || "An error occurred while fetching medium data");
    return [];
  }
};

const fetchComposerData = async () => {
  try {
    const res = await fetch(composerUrl);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong while fetching composer data");
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    toast.error(error.message || "An error occurred while fetching composer data");
    return [];
  }
};

const fetchSpeciesData = async () => {
  try {
    const res = await fetch(speciesUrl);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong while fetching species data");
    }

    return Array.isArray(data) ? organizeSpeciesData(data) : [];
  } catch (error) {
    toast.error(error.message || "An error occurred while fetching species data");
    return [];
  }
};

const fetchPublisherData = async () => {
  try {
    const res = await fetch(publisherUrl);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong while fetching publisher data");
    }

    return Array.isArray(data) ? organizePublisherData(data) : [];
  } catch (error) {
    toast.error(error.message || "An error occurred while fetching publisher data");
    return [];
  }
};

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
    toast.error("Error fetching resource data: " + error.message);
    return [[], [], [], []];
  }
};

export default fetchResourceData;
