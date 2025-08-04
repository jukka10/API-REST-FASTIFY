import "dotenv/config";
import { knex as setupKnex, Knex } from "knex";

if (!process.env.DATABASE_URL || !process.env.DIRECTORY_MIGRATIONS) {
  throw new Error("env not found");
}

export const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: process.env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: process.env.DIRECTORY_MIGRATIONS,
  },
};

export const knex = setupKnex(config);
