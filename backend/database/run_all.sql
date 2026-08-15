-- --------------------------------------------------------
-- Agrify / Farm Management System — full setup, run in one shot.
--
-- The listed files each hold one concern (tables, data, views, ...), but
-- they can't just run alphabetically: triggers/procedures must exist
-- BEFORE the seed data that exercises them (sale_item rows are inserted
-- normally specifically so the triggers fire during seeding), and
-- views.sql only needs the tables to exist, not any data. This script
-- captures the real required order — open it in MySQL Workbench and run
-- the whole file, or `mysql -u root -p < run_all.sql` from a terminal in
-- this folder.
--
-- queries.sql is intentionally NOT sourced here — it's a standalone
-- collection of example reports to run manually, not part of setup.
-- --------------------------------------------------------

SOURCE create_database.sql;
SOURCE create_tables.sql;
SOURCE procedures.sql;
SOURCE triggers.sql;
SOURCE views.sql;
SOURCE insert_data.sql;
