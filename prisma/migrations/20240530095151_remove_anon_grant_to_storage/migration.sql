CREATE SCHEMA IF NOT EXISTS "storage";

REVOKE all privileges ON all tables IN SCHEMA storage FROM anon;
ALTER DEFAULT privileges IN SCHEMA storage REVOKE all ON tables FROM anon;