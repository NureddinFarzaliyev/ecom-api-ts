require("dotenv").config();

const DB_URI = process.env.DB_URI;

const config = {
  mongodb: {
    url: DB_URI,
    databaseName: "test",
    options: {},
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "commonjs",
};

module.exports = config;
