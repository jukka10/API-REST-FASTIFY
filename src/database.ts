import { knex as setupKnex, Knex } from "knex";

export const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./src/temp/app.db",
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./src/temp/migrations",
  },
};

export const knex = setupKnex(config);
