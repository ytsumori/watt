# migrate db
migrate-db:
	dotenv -e .env.local -- pnpx prisma migrate dev

# format schema
format-schema:
	dotenv -e .env.local -- pnpx prisma validate
	dotenv -e .env.local -- pnpx prisma format

# run database
prisma-studio:
	dotenv -e .env.local -- pnpx prisma studio