import { config } from 'dotenv';
import { z } from 'zod';

config();

const zRequired = () => z.string().min(1);

const envSchema = z.object({
  // App:
  PORT: zRequired(),
  NODE_ENV: zRequired(),
  // Mongo Database:
  MONGO_CONN: zRequired(),
});

let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(`Error!: ${error}`);
  } else {
    console.error(`Unexpected error in file ${__filename}:  ${error}`);
  }
  process.exit(1);
}

export const { PORT, NODE_ENV, MONGO_CONN } = env;
