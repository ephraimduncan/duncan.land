import { drizzle } from "drizzle-orm/libsql";
import { db as libsqlClient } from "./db";
import * as schema from "./schema";

export const drizzleDb = drizzle(libsqlClient, { schema });
