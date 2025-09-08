// JS-only SQLite schema for demo DB.
// No foreign key enforcement, but same columns.

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
    t.string('netid');
    t.string('name');
  });

  // composers
  await knex.schema.createTable('composers', (t) => {
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

  // media_type
  await knex.schema.createTable('media_type', (t) => {
    t.integer('id').primary().notNullable();
    t.integer('physical_parts');
    t.integer('digital_scans');
  });

  // medium categories & options
  await knex.schema.createTable('medium_category', (t) => {
    t.integer('id').primary().notNullable();
    t.text('label');
  });

  await knex.schema.createTable('medium_options', (t) => {
    t.integer('id').primary().notNullable();
    t.text('value');
    t.text('label');
    t.integer('category_id'); // demo only, no FK
    t.integer('parent_id');   // demo only, no FK
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
    t.integer('publisher_category_id'); // demo only, no FK
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
    t.integer('species_category_id'); // demo only, no FK
  });

  // pieces (the core)
  await knex.schema.createTable('pieces', (t) => {
    t.increments('id').primary();
    t.string('title', 255).notNullable();
    t.string('number', 100);
    t.integer('composer_id');   // demo only, no FK
    t.integer('species_id');    // demo only, no FK
    t.integer('medium_id');     // demo only, no FK
    t.integer('publisher_id');  // demo only, no FK
    t.integer('condition_id');  // demo only, no FK

    t.integer('public_domain');
    t.text('additional_notes');
    t.integer('own_physical');
    t.integer('own_digital');
    t.integer('missing_parts');
    t.string('call_number', 255);
    t.string('identifier_label', 255);
    t.integer('identifier_value');
    t.text('acquisition_date'); 
    t.string('scans_url', 255);
    t.text('date_last_performed');
  });

  await knex.raw('PRAGMA foreign_keys = OFF'); // keep them disabled
}

module.exports = { createSqliteSchema };
