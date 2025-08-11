import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
} else {
  config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_CLIENT: z.enum(["sqlite", "pg"]),
  DATABASE_URL: z.string(),
  DIRECTORY_MIGRATIONS: z.string(),
  PORT: z.coerce.number().default(3333),
});

const { success, data, error } = envSchema.safeParse(process.env);

if (success === false) {
  console.log("[!!!]  Invalid enviroment variables!", z.treeifyError(error));

  throw new Error("[!!!]  Invalid enviroment variables!");
}

export const env = data;
