import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string(),
  DIRECTORY_MIGRATIONS: z.string(),
  PORT: z.number().default(3333),
});

const { success, data, error } = envSchema.safeParse(process.env);

if (success === false) {
  console.log("[!!!]  Invalid enviroment variables!", z.treeifyError(error));

  throw new Error("[!!!]  Invalid enviroment variables!");
}

export const env = data;
