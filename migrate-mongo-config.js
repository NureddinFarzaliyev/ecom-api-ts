require("dotenv").config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const config = {
  mongodb: {
    url: `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.bfs8zjk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
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
