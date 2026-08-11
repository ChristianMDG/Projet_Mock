export default ({ env }) => {
  const databaseUrl = env("DATABASE_URL");
  const useSSL = env.bool("DATABASE_SSL", Boolean(databaseUrl));

  return {
    connection: {
      client: env("DATABASE_CLIENT", "postgres"),
      connection: databaseUrl ? {
        connectionString: databaseUrl,
        ssl: useSSL ? { rejectUnauthorized: false } : false
      } : {
        host: env("DATABASE_HOST", "localhost"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "taxibrousse"),
        user: env("DATABASE_USERNAME", "postgres"),
        password: env("DATABASE_PASSWORD", ""),
        ssl: useSSL ? { rejectUnauthorized: false } : false,
        schema: env("DATABASE_SCHEMA", "public")
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2),
        max: env.int("DATABASE_POOL_MAX", 10)
      },
      acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000)
    },
    settings: {
      forceMigration: false,
      runMigrations: true,
    }
  };
};
