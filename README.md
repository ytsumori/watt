# Watt

## Prerequisites

```bash
node -v
v20.11.0
```

## How to Setup

### Install packages

```bash
pnpm install
pnpm install -g dotenv-cli
```

## How to Use

### Run in development mode

```bash
pnpm dev
```

### After schema change, create migration file using

```bash
make format-schema
make migrate-db
```
