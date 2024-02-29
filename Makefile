# migrate db
migrate-db:
	dotenv -e .env.local -- pnpx prisma migrate dev

# push db
push-db:
	dotenv -e .env.local -- pnpx prisma db push

# start docker services
start-docker:
	pnpx supabase start

# stop docker services
stop-docker:
	pnpx supabase stop

# format schema
format-schema:
	dotenv -e .env.local -- pnpx prisma validate
	dotenv -e .env.local -- pnpx prisma format

# run database
prisma-studio:
	dotenv -e .env.local -- pnpx prisma studio