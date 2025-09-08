import splitString from "../../helpers//general/splitString.js";
import { findMediumById, findComposerById, findGenreById, findPublisherById } from "../../helpers/holdings/filterData.js";

const initializePieceState = ({ initialData, resourceData, setMainInfo, setAdditionalInfo, setDataReady }) => {
    if (initialData && resourceData.mediumData.length) {

      console.log("dates", initialData.acquisition_date, initialData.date_last_performed);

      setMainInfo({
        title: initialData.title,
        identifierLabel: initialData.identifier_label || "",
        identifierValue: initialData.identifier_value || "",
        number: initialData.number || "",
        medium: findMediumById(resourceData.mediumData, initialData.medium_id),
        composer: findComposerById(resourceData.composerData, initialData.composer_id),
        genre: findGenreById(resourceData.speciesData, initialData.species_id),
        publisher: findPublisherById(resourceData.publisherData, initialData.publisher_id),
        callNumber: splitString(initialData.call_number || "")
      });
  
      setAdditionalInfo({
        ownPhysical: initialData.own_physical === 1,
        ownDigital: initialData.own_digital === 1,
        scansUrl: initialData.scans_url,
        publicDomain: initialData.public_domain === 1,
        condition: initialData.condition_id,
        missingParts: initialData.missing_parts === 1,
        acquisitionDate: initialData.acquisition_date ? new Date(Number(initialData.acquisition_date)) : null,
        lastPerformed: initialData.date_last_performed ? new Date(Number(initialData.date_last_performed)) : null,
        notes: initialData.additional_notes
      });
  
      setDataReady(true);
    }
  };

export default initializePieceState;