// JS-only SQLite schema mirroring your MySQL tables.
// Uses INTEGER 0/1 for booleans, TEXT for dates (YYYY-MM-DD), and FK constraints.

async function createSqliteSchema(knex) {
    await knex.raw('PRAGMA foreign_keys = OFF');
  
    // drop in reverse dependency order if they exist
    const drops = [
      'pieces',
      'medium_options',
      'medium_category',
      'publisher_options',
      'publisher_category',
      'species_options',
      'species_category',
      'media_type',
      'conditions',
      'composers',
      'admins',
    ];
    for (const t of drops) await knex.schema.dropTableIfExists(t);
  
    // admins
    await knex.schema.createTable('admins', (t) => {
      t.increments('id').primary();
      t.string('netid');  // nullable to match dump
      t.string('name');
    });
  
    // composers
    await knex.schema.createTable('composers', (t) => {
      // keep explicit IDs (don’t autoincrement—so we can preserve MySQL IDs if copied)
      t.integer('id').primary().notNullable();
      t.text('last_name').notNullable();
      t.text('first_name').notNullable();
      t.text('cutter_number').notNullable();
    });
  
    // conditions
    await knex.schema.createTable('conditions', (t) => {
      t.integer('id').primary().notNullable();
      t.string('label').notNullable();
    });
  
    // media_type (not referenced by pieces in your dump, but keep parity)
    await knex.schema.createTable('media_type', (t) => {
      t.integer('id').primary().notNullable();
      t.integer('physical_parts'); // 0/1
      t.integer('digital_scans');  // 0/1
    });
  
    // medium categories & options (self-referencing parent)
    await knex.schema.createTable('medium_category', (t) => {
      t.integer('id').primary().notNullable();
      t.text('label');
    });
  
    await knex.schema.createTable('medium_options', (t) => {
      t.integer('id').primary().notNullable();
      t.text('value');
      t.text('label');
      t.integer('category_id').references('id').inTable('medium_category').onDelete('SET NULL');
      t.integer('parent_id').references('id').inTable('medium_options').onDelete('SET NULL');
    });
  
    // publisher categories & options
    await knex.schema.createTable('publisher_category', (t) => {
      t.integer('id').primary().notNullable();
      t.text('label');
    });
  
    await knex.schema.createTable('publisher_options', (t) => {
      t.integer('id').primary().notNullable();
      t.text('abbr');
      t.text('label');
      t.integer('publisher_category_id')
        .references('id').inTable('publisher_category').onDelete('SET NULL');
    });
  
    // species categories & options
    await knex.schema.createTable('species_category', (t) => {
      t.integer('id').primary().notNullable();
      t.text('label');
    });
  
    await knex.schema.createTable('species_options', (t) => {
      t.integer('id').primary().notNullable();
      t.text('abbr');
      t.text('label');
      t.integer('species_category_id')
        .references('id').inTable('species_category').onDelete('SET NULL');
    });
  
    // pieces (the core)
    await knex.schema.createTable('pieces', (t) => {
      t.increments('id').primary(); // auto ids for demo pieces
      t.string('title', 255).notNullable();
      t.string('number', 100);
      t.integer('composer_id').notNullable()
        .references('id').inTable('composers').onDelete('RESTRICT');
      t.integer('species_id').notNullable()
        .references('id').inTable('species_options').onDelete('RESTRICT');
      t.integer('medium_id').notNullable()
        .references('id').inTable('medium_options').onDelete('RESTRICT');
      t.integer('publisher_id').notNullable()
        .references('id').inTable('publisher_options').onDelete('RESTRICT');
      t.integer('condition_id').notNullable()
        .references('id').inTable('conditions').onDelete('RESTRICT');
  
      t.integer('public_domain');   // 0/1
      t.text('additional_notes');
      t.integer('own_physical');    // 0/1
      t.integer('own_digital');     // 0/1
      t.integer('missing_parts');   // 0/1
      t.string('call_number', 255);
      t.string('identifier_label', 255);
      t.integer('identifier_value');
      t.text('acquisition_date');   // store as 'YYYY-MM-DD'
      t.string('scans_url', 255);
      t.text('date_last_performed'); // 'YYYY-MM-DD'
    });
  
    await knex.raw('PRAGMA foreign_keys = ON');
  }
  
  module.exports = { createSqliteSchema };
  