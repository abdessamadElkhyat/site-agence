/** Normalize and map Vercel/Supabase Postgres vars onto Prisma Auth.js names. */
export function normalizePostgresUrl(url: string) {
  return url.replace(/^postgres:\/\//i, "postgresql://");
}

export function ensureDatabaseEnv() {
  const pooled =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL;
  const direct =
    process.env.DIRECT_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    pooled;

  if (pooled) {
    process.env.DATABASE_URL = normalizePostgresUrl(pooled);
  }
  if (direct) {
    process.env.DIRECT_URL = normalizePostgresUrl(direct);
  }
}

export function authSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
}
