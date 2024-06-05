// Add option for opus number, which will go alongside the species title indication if present

const species = [
    {
      label: "Orchestral",
      options: [
        { value: 1, abbr: "ovt", label: "Overture" },
        { value: 2, abbr: "spo", label: "Symphonic Poem" },
        { value: 3, abbr: "sym", label: "Symphony" },
        { value: 4, abbr: "sfn", label: "Sinfonietta" },
        { value: 5, abbr: "sv", label: "Symphonic Variations" },
        { value: 6, abbr: "tv", label: "Theme and Variations" },
        { value: 7, abbr: "ssu", label: "Symphonic Suite" }
      ]
    },
    {
      label: "Concertos",
      options: [
        { value: 8, abbr: "con", label: "Concerto" }
      ]
    },
    {
      label: "Chamber Music",
      options: [
        { value: 9, abbr: "cm", label: "Chamber Music" },
        { value: 10, abbr: "son", label: "Sonata" },
        { value: 11, abbr: "cs", label: "Chamber Symphony" }
      ]
    },
    {
      label: "Opera",
      options: [
        { value: 12, abbr: "opr", label: "Opera" },
        { value: 13, abbr: "obf", label: "Opera Buffa" },
        { value: 14, abbr: "ose", label: "Opera Seria" },
        { value: 15, abbr: "cmo", label: "Comic Opera" },
        { value: 16, abbr: "opt", label: "Operetta" }
      ]
    },
    {
      label: "Ballet",
      options: [
        { value: 17, abbr: "bal", label: "Ballet" }
      ]
    },
    {
      label: "Vocal and Choral",
      options: [
        { value: 18, abbr: "sui", label: "Suite" },
        { value: 19, abbr: "can", label: "Cantata" },
        { value: 20, abbr: "ora", label: "Oratorio" },
        { value: 21, abbr: "mas", label: "Mass" },
        { value: 22, abbr: "req", label: "Requiem" },
        { value: 23, abbr: "mad", label: "Madrigal" },
        { value: 24, abbr: "mot", label: "Motet" },
        { value: 25, abbr: "cho", label: "Choral Music" },
        { value: 26, abbr: "art", label: "Lied / Art Song" }
      ]
    },
    {
      label: "Keyboard and Instrumental",
      options: [
        { value: 27, abbr: "par", label: "Partita" },
        { value: 28, abbr: "fan", label: "Fantasia" },
        { value: 29, abbr: "cap", label: "Capriccio" },
        { value: 30, abbr: "rha", label: "Rhapsody" },
        { value: 31, abbr: "ser", label: "Serenade" },
        { value: 32, abbr: "div", label: "Divertimento" },
        { value: 33, abbr: "mar", label: "March" },
        { value: 34, abbr: "noc", label: "Nocturne" },
        { value: 35, abbr: "etu", label: "Etude" },
        { value: 36, abbr: "pre", label: "Prelude" },
        { value: 37, abbr: "fug", label: "Fugue" },
        { value: 38, abbr: "imp", label: "Impromptu" },
        { value: 39, abbr: "int", label: "Intermezzo" },
        { value: 40, abbr: "maz", label: "Mazurka" },
        { value: 41, abbr: "pol", label: "Polonaise" },
        { value: 42, abbr: "wal", label: "Waltz" },
        { value: 43, abbr: "tar", label: "Tarantella" },
        { value: 44, abbr: "bal", label: "Ballade" },
        { value: 45, abbr: "sch", label: "Scherzo" },
        { value: 46, abbr: "rom", label: "Romance" }
      ]
    },
    {
      label: "Miscellaneous",
      options: [
        { value: 47, abbr: "inc", label: "Incidental Music" },
        { value: 48, abbr: "ovf", label: "Overture-Fantasy" },
        { value: 49, abbr: "dsu", label: "Dance Suite" },
        { value: 50, abbr: "cha", label: "Character Piece" }
      ]
    }
  ];
  
  export default species;
  