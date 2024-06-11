const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(morgan('dev'));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "../client/build")));

const db = new sqlite3.Database('./philharmonia_library.db');

const mediumData = require("./dataToInsert/medium.json");

const publishersData = require('./dataToInsert/publishers.json');
const speciesData = require('./dataToInsert/species.json');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS species_category (
        id INTEGER PRIMARY KEY,
        label TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS species_options (
        id INTEGER PRIMARY KEY,
        abbr TEXT,
        label TEXT,
        species_category_id INTEGER,
        FOREIGN KEY (species_category_id) REFERENCES species_category(id)
    )`);

    const insertSpeciesCategory = db.prepare('INSERT INTO species_category (label) VALUES (?)');
    const insertSpeciesOptions = db.prepare('INSERT INTO species_options (abbr, label, species_category_id) VALUES (?, ?, ?)');

    const categoryIds = {}; // Initialize categoryIds object

    // Insert data into species_category table and collect category IDs
    speciesData.species.forEach(category => {
        const { lastID } = insertSpeciesCategory.run(category.label);
        categoryIds[category.label] = lastID;
    });

    // Insert data into species_options table with correct category IDs
    speciesData.species.forEach(category => {
        const categoryId = categoryIds[category.label];
        category.options.forEach(option => {
            insertSpeciesOptions.run(option.abbr, option.label, parseInt(categoryId));
        });
    });

    insertSpeciesCategory.finalize();
    insertSpeciesOptions.finalize();
});

db.close();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
