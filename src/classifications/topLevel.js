const topLevel = [
  {
    label: "0 - Miscellaneous",
    options: {
      "00": "Miscellaneous collections, instrumental and vocal, several composers",
      "01": "Monuments, historical sets",
      "04": "Facsimiles",
      "05": "Collected works of one composer"
    }
  },
  {
    label: "1 - Keyboard Instruments",
    options: {
      "11": "Piano, harpsichord, clavichord, virginal, etc. (not organ)",
      "12": "Piano ensemble",
      "15": "Organ and harmonium",
      "16": "Organ ensemble"
    }
  },
  {
    label: "2 - Bowed String Instruments",
    options: {
      "21": "Violin and piano",
      "22": "Viola and piano",
      "23": "Cello and piano",
      "24": "Double bass and piano"
    }
  },
  {
    label: "3 - Wind Instruments",
    options: {
      "31": "Flute (piccolo, recorder) and piano",
      "32": "Oboe (English horn) and piano",
      "33": "Clarinet and piano",
      "34": "Bassoon and piano"
    }
  },
  {
    label: "4 - Plectral, Percussion, and Electric Instruments",
    options: {
      "41": "Harp alone",
      "43": "Guitar",
      "44": "Banjo",
      "46": "Percussion instruments"
    }
  },
  {
    label: "5 - Chamber Ensembles",
    options: {
      "51": "Keyboard, bowed string, wind, percussion (any combination)",
      "52": "Bowed string",
      "53": "Wind",
      "54": "Plectral string with percussion"
    }
  },
  {
    label: "6 - Orchestral Ensemble",
    options: {
      "61": "Full orchestra",
      "62": "String orchestra",
      "63": "Band or wind orchestra",
      "65": "Chamber orchestra",
      "66 - Soloist with Orchestra": {
        "661": "Piano with orchestra",
        "6615": "Organ with orchestra",
        "662": "Violin with orchestra",
        "6622": "Viola with orchestra",
        "6623": "Cello with orchestra",
        "6631": "Flute with orchestra",
        "6632": "Oboe with orchestra",
        "6633": "Clarinet with orchestra",
        "6634": "Bassoon with orchestra",
        "6635": "Horn with orchestra",
        "6636": "Trumpet with orchestra",
        "6637": "Trombone with orchestra",
        "66382": "Tuba with orchestra",
        "66384": "Saxophone with orchestra",
        "664": "Harp with orchestra",
        "6643": "Guitar with orchestra",
        "6646": "Percussion with orchestra",
        "665": "Concerti grossi",
        "666": "Double, triple, etc. concerti with dissimilar soloists",
        "667": "Vocal soloist with orchestra"
      },
      "67": "Special orchestral ensembles",
      "68": "Combinations with incidental chorus, with or without vocal soli"
    }
  },
  {
    label: "7 - Voice Solo and Solo Ensemble",
    options: {
      "71": "Secular vocal solo, accompanied by piano or other solo instrument",
      "72": "Secular vocal ensemble, accompaniment for solo instrument",
      "75": "Sacred vocal solo with single instrument accompaniment",
      "76": "Sacred vocal ensemble with single instrument accompaniment"
    }
  },
  {
    label: "8 - Choral and Solo-Choral Ensemble",
    options: {
      "81": "Secular choral works, more than one movement",
      "82": "Single secular choruses and collections",
      "85": "Sacred choral works, more than one movement",
      "86": "Single sacred choruses and collections"
    }
  },
  {
    label: "9 - Dramatic Ensembles",
    options: {
      "91": "Operas and musicals",
      "92": "Scenes, cantatas designed for stage presentation",
      "95": "Ballets",
      "97": "Incidental music to dramas, masques, pageants, pantomimes, etc."
    }
  }
];

export default topLevel;
