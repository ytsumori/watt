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
make start-docker
```

### migrate database

```bash
make migrate-db
```

### Run in development mode

```bash
pnpm dev
```

## How to Develop

### After schema change, create migration file using

```bash
make format-schema
make migrate-db
```
