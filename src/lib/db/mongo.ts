/**
 * MongoDB connectivity lives directly in src/lib/storage.ts (see the
 * "MongoDB adapter" section) so that all persistence — file, memory, and
 * Mongo — shares one code path and one contract.
 *
 * This file remains as the documented extension point: to add indexes,
 * migrations, or additional collections, extend the COLLECTIONS list and the
 * mongoRead/mongoWrite functions in src/lib/storage.ts.
 */
export const MONGO_DB_NAME = "fintra";
