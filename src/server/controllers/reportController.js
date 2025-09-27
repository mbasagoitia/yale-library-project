function formatDate(value) {
  if (!value) return "";

  // Handle MySQL DATE string (YYYY-MM-DD)
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const d = new Date(value);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US");
  }

  // Handle JS Date object
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? "" : value.toLocaleDateString("en-US");
  }

  return "";
}

async function getAllPieces(req, res, next) {
  try {
    const db = req.db;
    const rows = await db("pieces as p")
      .innerJoin("composers as c", "p.composer_id", "c.id")
      .innerJoin("publisher_options as pub", "p.publisher_id", "pub.id")
      .innerJoin("conditions as con", "p.condition_id", "con.id")
      .select(
        "c.last_name as lastName",
        "c.first_name as firstName",
        "p.title as title",
        "pub.label as publisher",
        "p.additional_notes as notes",
        "con.label as condition",
        "p.call_number as callNumber",
        "p.acquisition_date as acquisitionDate",
        "p.date_last_performed as lastPerformed"
      )
      .orderBy("c.last_name", "asc")
      .orderBy("p.title", "asc");

    const formatted = rows.map((r) => ({
      Title: r.title,
      Composer: `${r.lastName}, ${r.firstName}`,
      Publisher: r.publisher,
      Notes: r.notes,
      Condition: r.condition,
      "Call Number": r.callNumber,
      "Acquisition Date": formatDate(r.acquisitionDate),
      "Last Performed": formatDate(r.lastPerformed),
    }));

    res.status(200).json(formatted);
  } catch (err) {
    next({ status: 500, message: "Error retrieving piece list" });
  }
}

async function getMissing(req, res, next) {
  try {
    const db = req.db;
    const rows = await db("pieces as p")
      .innerJoin("composers as c", "p.composer_id", "c.id")
      .innerJoin("publisher_options as pub", "p.publisher_id", "pub.id")
      .innerJoin("conditions as con", "p.condition_id", "con.id")
      .where("p.missing_parts", 1)
      .select(
        "p.title as Title",
        db.raw("c.last_name || ', ' || c.first_name as Composer"),
        "pub.label as Publisher",
        "p.additional_notes as Notes",
        "con.label as Condition",
        "p.call_number as Call Number",
        "p.acquisition_date as Acquisition Date"
      )
      .orderBy([
        { column: "c.last_name" },
        { column: "c.first_name" },
        { column: "p.title" },
      ]);

    const formatted = rows.map((r) => ({
      ...r,
      "Acquisition Date": formatDate(r["Acquisition Date"]),
    }));

    res.json(formatted);
  } catch (err) {
    next({ status: 500, message: "Error retrieving piece list" });
  }
}

async function getPoorCondition(req, res, next) {
  try {
    const db = req.db;
    const rows = await db("pieces as p")
      .innerJoin("composers as c", "p.composer_id", "c.id")
      .innerJoin("publisher_options as pub", "p.publisher_id", "pub.id")
      .innerJoin("conditions as con", "p.condition_id", "con.id")
      .where("p.condition_id", ">", 2)
      .select(
        "p.title as Title",
        db.raw("c.last_name || ', ' || c.first_name as Composer"),
        "pub.label as Publisher",
        "p.additional_notes as Notes",
        "con.label as Condition",
        "p.call_number as Call Number",
        "p.acquisition_date as Acquisition Date"
      )
      .orderBy([
        { column: "p.condition_id", order: "desc" },
        { column: "c.last_name" },
        { column: "p.title" },
      ]);

    const formatted = rows.map((r) => ({
      ...r,
      "Acquisition Date": formatDate(r["Acquisition Date"]),
    }));

    res.json(formatted);
  } catch (err) {
    next({ status: 500, message: "Error retrieving piece list" });
  }
}

async function getConditionSummary(req, res, next) {
  try {
    const db = req.db;

    const [{ total_count }] = await db("pieces").count("* as total_count");

    const rows = await db("conditions as con")
      .leftJoin("pieces as p", "p.condition_id", "con.id")
      .groupBy("con.id", "con.label")
      .orderBy("con.id", "asc")
      .select(
        "con.label as Condition",
        db.raw("COUNT(p.id) as `Number of Pieces`"),
        db.raw("(CAST(COUNT(p.id) AS FLOAT) / ?) * 100 as pct", [total_count])
      );

    const formatted = rows.map((r) => ({
      Condition: r.Condition,
      "Number of Pieces": r["Number of Pieces"],
      Percentage: `${Math.round(r.pct)}%`,
    }));

    res.json(formatted);
  } catch (err) {
    next({ status: 500, message: "Error retrieving condition summary" });
  }
}

async function getMusicByComposer(req, res, next) {
  try {
    const db = req.db;

    const rows = await db("pieces as p")
      .join("composers as c", "p.composer_id", "c.id")
      .join("species_options as s", "p.species_id", "s.id")
      .select(
        db.raw("CONCAT(c.last_name, ', ', c.first_name) as Composer"),
        "p.title as Title",
        "s.label as Genre",
        db.raw("COUNT(*) OVER (PARTITION BY c.id) as TotalPiecesByComposer")
      )
      .orderByRaw(
        "TotalPiecesByComposer DESC, c.last_name, c.first_name, s.label"
      );

    res.json(rows);
  } catch (err) {
    next({ status: 500, message: "Error retrieving music by composer" });
  }
}

async function getPerformanceHistory(req, res, next) {
  try {
    const db = req.db;
    const yearsAgo = parseInt(req.query.years, 10);

    if (isNaN(yearsAgo)) {
      return res.status(400).json({ error: "Invalid number of years provided" });
    }

    const now = new Date();
    const cutoff = new Date();
    cutoff.setFullYear(now.getFullYear() - yearsAgo);

    const rows = await db("pieces as p")
      .innerJoin("composers as c", "p.composer_id", "c.id")
      .select(
        "p.title as Title",
        db.raw("c.last_name || ', ' || c.first_name as Composer"),
        "p.date_last_performed as Last Performed",
        "p.acquisition_date as Acquisition Date"
      )
      .whereNotNull("p.date_last_performed")
      .andWhere("p.date_last_performed", ">=", cutoff.toISOString())
      .orderBy("p.date_last_performed", "desc");

    const formatted = rows.map((r) => ({
      ...r,
      "Acquisition Date": formatDate(r["Acquisition Date"]),
      "Last Performed": formatDate(r["Last Performed"]),
    }));

    res.json(formatted);
  } catch (err) {
    next({ status: 500, message: "Error retrieving performance history" });
  }
}

module.exports = {
  getAllPieces,
  getMissing,
  getPoorCondition,
  getConditionSummary,
  getMusicByComposer,
  getPerformanceHistory,
};
