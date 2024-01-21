import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = "postgresql://postgres:postgres@localhost:5432/ssd";
const queryClient = postgres(connectionString)
export const db = drizzle(queryClient);