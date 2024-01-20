// DRIZZLE
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/next.config";

const client = new Client({connectionString: env("DATABASE_URL")})

await client.connect();
const db = drizzle(client);