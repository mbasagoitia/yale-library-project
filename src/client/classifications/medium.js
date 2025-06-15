const medium = [
  {
    label: "0 - Miscellaneous",
    options: [
      { value: '00', label: "Miscellaneous collections, instrumental and vocal, several composers" },
      { value: '01', label: "Monuments, historical sets" },
      { value: '04', label: "Facsimiles" },
      { value: '05', label: "Collected works of one composer" }
    ]
  },
  {
    label: "1 - Keyboard Instruments",
    options: [
      { value: 11, label: "Piano, harpsichord, clavichord, virginal, etc. (not organ)" },
      { value: 12, label: "Piano ensemble" },
      { value: 15, label: "Organ and harmonium" },
      { value: 16, label: "Organ ensemble" }
    ]
  },
  {
    label: "2 - Bowed String Instruments",
    options: [
      { value: 21, label: "Violin and piano" },
      { value: 22, label: "Viola and piano" },
      { value: 23, label: "Cello and piano" },
      { value: 24, label: "Double bass and piano" }
    ]
  },
  {
    label: "3 - Wind Instruments",
    options: [
      { value: 31, label: "Flute (piccolo, recorder) and piano" },
      { value: 32, label: "Oboe (English horn) and piano" },
      { value: 33, label: "Clarinet and piano" },
      { value: 34, label: "Bassoon and piano" }
    ]
  },
  {
    label: "4 - Plectral, Percussion, and Electric Instruments",
    options: [
      { value: 41, label: "Harp alone" },
      { value: 43, label: "Guitar" },
      { value: 44, label: "Banjo" },
      { value: 46, label: "Percussion instruments" }
    ]
  },
  {
    label: "5 - Chamber Ensembles",
    options: [
      { value: 51, label: "Keyboard, bowed string, wind, percussion (any combination)" },
      { value: 52, label: "Bowed string" },
      { value: 53, label: "Wind" },
      { value: 54, label: "Plectral string with percussion" }
    ]
  },
  {
    label: "6 - Orchestral Ensemble",
    options: [
      { value: 61, label: "Full orchestra" },
      { value: 62, label: "String orchestra" },
      { value: 63, label: "Band or wind orchestra" },
      { value: 65, label: "Chamber orchestra" },
      { value: 66, label: "Soloist with Orchestra",
        options: [
          { value: 661, label: "Piano with orchestra" },
          { value: 6615, label: "Organ with orchestra" },
          { value: 662, label: "Violin with orchestra" },
          { value: 6622, label: "Viola with orchestra" },
          { value: 6623, label: "Cello with orchestra" },
          { value: 6631, label: "Flute with orchestra" },
          { value: 6632, label: "Oboe with orchestra" },
          { value: 6633, label: "Clarinet with orchestra" },
          { value: 6634, label: "Bassoon with orchestra" },
          { value: 6635, label: "Horn with orchestra" },
          { value: 6636, label: "Trumpet with orchestra" },
          { value: 6637, label: "Trombone with orchestra" },
          { value: 66382, label: "Tuba with orchestra" },
          { value: 66384, label: "Saxophone with orchestra" },
          { value: 664, label: "Harp with orchestra" },
          { value: 6643, label: "Guitar with orchestra" },
          { value: 6646, label: "Percussion with orchestra" },
          { value: 665, label: "Concerti grossi" },
          { value: 666, label: "Double, triple, etc. concerti with dissimilar soloists" },
          { value: 667, label: "Vocal soloist with orchestra" }
        ]
      },
      { value: 67, label: "Special orchestral ensembles" },
      { value: 68, label: "Combinations with incidental chorus, with or without vocal soli" }
    ]
  },
  {
    label: "7 - Voice Solo and Solo Ensemble",
    options: [
      { value: 71, label: "Secular vocal solo, accompanied by piano or other solo instrument" },
      { value: 72, label: "Secular vocal ensemble, accompaniment for solo instrument" },
      { value: 75, label: "Sacred vocal solo with single instrument accompaniment" },
      { value: 76, label: "Sacred vocal ensemble with single instrument accompaniment" }
    ]
  },
  {
    label: "8 - Choral and Solo-Choral Ensemble",
    options: [
      { value: 81, label: "Secular choral works, more than one movement" },
      { value: 82, label: "Single secular choruses and collections" },
      { value: 85, label: "Sacred choral works, more than one movement" },
      { value: 86, label: "Single sacred choruses and collections" }
      ]
    },
    {
     label: "9 - Dramatic Ensembles",
     options: [
      { value: 91, label: "Operas and musicals" },
      { value: 92, label: "Scenes, cantatas designed for stage presentation" },
      { value: 95, label: "Ballets" },
      { value: 97, label: "Incidental music to dramas, masques, pageants, pantomimes, etc." }
      ]
    }
  ];
  
  export default medium;
