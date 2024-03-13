# Watt

## Prerequisites

```bash
node -v
v20.11.0

corepack -v
0.23.0
```

## How to Setup

### Install packages

```bash
pnpm install
pnpm install -g dotenv-cli
```

### Start docker container

```bash
pnpx supabase start
```

You can access dashboard at http://localhost:54323/

Check [here](https://github.com/KiizanKiizan/watt/wiki/Supabase-Storage-%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97) for bucket setup.

### Migrate database

```bash
pnpm migrate-dev
```

### Run in development mode

```bash
pnpm dev
```

You can access the app at http://localhost:3000/

## How to Develop

### After schema change, create migration file using

```bash
pnpm format-schema
pnpm migrate-dev
```
