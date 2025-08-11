import { knex as setupKnex, Knex } from "knex";
import { env } from "./env/index";

if (!process.env.DATABASE_URL || !process.env.DIRECTORY_MIGRATIONS) {
  throw new Error("env not found");
}

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === "sqlite"
      ? {
          filename: env.DATABASE_URL,
        }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: env.DIRECTORY_MIGRATIONS,
  },
};

export const knex = setupKnex(config);
