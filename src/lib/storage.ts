import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

/* ────────────────────────── Core types ────────────────────────── */

export type PlanId = "free" | "pro" | "max" | "enterprise";

export interface Account {
  id: string;
  email: string;
  name: string;
  passwordHash: string; // scrypt "salt:hash"
  plan: PlanId;
  billingInterval: "monthly" | "annual";
  createdAt: string;
}

export interface Session {
  token: string;
  accountId: string;
  createdAt: string;
}

export interface BillingRecord {
  id: string;
  accountId: string;
  plan: PlanId;
  interval: "monthly" | "annual";
  amountCents: number;
  status: "demo" | "paid";
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  teamSize: string;
  message: string;
  createdAt: string;
}

/* ─────────────────── Persistence adapters ───────────────────
 *
 * Three adapters behind one contract:
 *   1. FILE (default on Node hosts): JSON file in .data/ — survives
 *      restarts and works on any Node.js deployment without services.
 *   2. MONGODB (DATABASE_URL set): for MongoDB Atlas / serverless.
 *   3. MEMORY (NODE_ENV test or explicit): dev only, resets on restart.
 *
 * Swap any adapter without touching calling code.
 * ──────────────────────────────────────────────────────────── */

const COLLECTIONS = ["accounts", "sessions", "billing", "contact"] as const;
type CollectionName = (typeof COLLECTIONS)[number];
type Store = Record<CollectionName, Record<string, unknown>[]>;

const DATA_DIR = path.join(process.cwd(), ".data");

const memoryStore: Store = {
  accounts: [],
  sessions: [],
  billing: [],
  contact: [],
};

function adapter(): "file" | "mongo" | "memory" {
  if (process.env.DATABASE_URL) return "mongo";
  if (process.env.FINTRA_STORAGE === "memory") return "memory";
  return "file";
}

/* ── File adapter ── */

async function fileRead(): Promise<Store> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, "store.json"), "utf8");
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      accounts: parsed.accounts ?? [],
      sessions: parsed.sessions ?? [],
      billing: parsed.billing ?? [],
      contact: parsed.contact ?? [],
    };
  } catch {
    return { accounts: [], sessions: [], billing: [], contact: [] };
  }
}

async function fileWrite(data: Store): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, "store.json"),
    JSON.stringify(data),
    "utf8"
  );
}

/* ── MongoDB adapter ── */

let mongoDbPromise: Promise<import("mongodb").Db> | null = null;

async function getMongoDb(): Promise<import("mongodb").Db> {
  if (!mongoDbPromise) {
    const { MongoClient } = await import("mongodb");
    mongoDbPromise = new MongoClient(process.env.DATABASE_URL!, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
    })
      .connect()
      .then((c) => c.db("fintra"));
  }
  return mongoDbPromise;
}

async function mongoRead(): Promise<Store> {
  const db = await getMongoDb();
  const out = { accounts: [], sessions: [], billing: [], contact: [] } as Store;
  for (const c of COLLECTIONS) {
    const docs = await db.collection(c).find({}).toArray();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    out[c] = docs.map(({ _id, ...rest }) => rest) as Record<string, unknown>[];
  }
  return out;
}

async function mongoWrite(data: Store): Promise<void> {
  const db = await getMongoDb();
  for (const c of COLLECTIONS) {
    const col = db.collection(c);
    await col.deleteMany({});
    if (data[c].length > 0) await col.insertMany(data[c]);
  }
}

/* ── Unified load/save ── */

async function loadAll(): Promise<Store> {
  const kind = adapter();
  if (kind === "mongo") {
    try {
      return await mongoRead();
    } catch {
      // If the database is briefly unreachable, fail soft to memory so auth
      // and the site remain up; writes will retry on the next mutation.
      return memoryStore;
    }
  }
  if (kind === "file") return fileRead();
  return memoryStore;
}

async function saveAll(data: Store): Promise<void> {
  const kind = adapter();
  if (kind === "mongo") {
    try {
      await mongoWrite(data);
    } catch (e) {
      console.error("[fintra] mongo write failed:", e);
    }
    return;
  }
  if (kind === "file") await fileWrite(data);
}

/** Read–modify–write helper used by every mutating API below. */
async function mutate(fn: (data: Store) => void): Promise<void> {
  const data = await loadAll();
  fn(data);
  await saveAll(data);
}

/* ───────────────────────────── IDs ─────────────────────────────── */

export function newId(): string {
  return randomBytes(16).toString("hex");
}

/* ─────────────────────────── Accounts ──────────────────────────── */

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const original = Buffer.from(hash, "hex");
  return candidate.length === original.length && timingSafeEqual(candidate, original);
}

/* ─────────────────────── Account APIs ─────────────────────── */

export async function findAccountByEmail(email: string): Promise<Account | null> {
  const target = email.trim().toLowerCase();
  const data = await loadAll();
  return (data.accounts as unknown as Account[]).find((a) => a.email === target) ?? null;
}

export async function createAccount(input: {
  email: string;
  name: string;
  password: string;
}): Promise<Account> {
  const account: Account = {
    id: newId(),
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    passwordHash: hashPassword(input.password),
    plan: "free",
    billingInterval: "monthly",
    createdAt: new Date().toISOString(),
  };
  await mutate((data) => {
    data.accounts.push(account as unknown as Record<string, unknown>);
  });
  return account;
}

export async function verifyAccountCredentials(
  email: string,
  password: string
): Promise<Account | null> {
  const account = await findAccountByEmail(email);
  if (!account) return null;
  return verifyPassword(password, account.passwordHash) ? account : null;
}

/* ─────────────────────── Session APIs ─────────────────────── */

export async function createSessionForAccount(accountId: string): Promise<Session> {
  const session: Session = {
    token: randomBytes(32).toString("hex"),
    accountId,
    createdAt: new Date().toISOString(),
  };
  await mutate((data) => {
    // Opportunistic cleanup of sessions older than 30 days
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    data.sessions = data.sessions.filter(
      (s) => !s.createdAt || new Date(s.createdAt as string).getTime() > cutoff
    );
    data.sessions.push(session as unknown as Record<string, unknown>);
  });
  return session;
}

export async function deleteSession(token: string): Promise<void> {
  await mutate((data) => {
    data.sessions = data.sessions.filter((s) => s.token !== token);
  });
}

export async function getSessionAccount(token: string): Promise<Account | null> {
  if (!token) return null;
  const data = await loadAll();
  const sessions = data.sessions as unknown as Session[];
  const session = sessions.find((s) => s.token === token);
  if (!session) return null;
  // 30-day session TTL
  const age = Date.now() - new Date(session.createdAt).getTime();
  if (age > 30 * 24 * 60 * 60 * 1000) return null;
  return (data.accounts as unknown as Account[]).find((a) => a.id === session.accountId) ?? null;
}

/* ─────────────────────── Plan changes ─────────────────────── */

export async function updateAccountPlan(
  accountId: string,
  plan: PlanId,
  interval: "monthly" | "annual",
  amountCents: number,
  status: "demo" | "paid" = "demo"
): Promise<Account | null> {
  let updated: Account | null = null;
  await mutate((data) => {
    const accounts = data.accounts as unknown as Account[];
    const acc = accounts.find((a) => a.id === accountId);
    if (!acc) return;
    acc.plan = plan;
    acc.billingInterval = interval;
    updated = acc;
    data.billing.push({
      id: newId(),
      accountId,
      plan,
      interval,
      amountCents,
      status,
      createdAt: new Date().toISOString(),
    } as unknown as Record<string, unknown>);
  });
  return updated;
}

export async function getBillingRecords(accountId: string): Promise<BillingRecord[]> {
  const data = await loadAll();
  return (data.billing as unknown as BillingRecord[])
    .filter((b) => b.accountId === accountId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* ─────────────────────── Contact ─────────────────────── */

export async function saveContactSubmission(
  input: Omit<ContactSubmission, "id" | "createdAt">
): Promise<ContactSubmission> {
  const sub: ContactSubmission = { ...input, id: newId(), createdAt: new Date().toISOString() };
  await mutate((data) => {
    data.contact.push(sub as unknown as Record<string, unknown>);
  });
  return sub;
}
