# Builder Stellar Nest

AI-powered vulnerability assessment platform built with React + Vite + Express.

## Install

### Prerequisites

- Node.js 18+
- npm
- (Optional) Go, if you want to install Nuclei manually

### Local setup

```bash
npm install
cp .env.example .env
```

You can also use the guided installer:

```bash
./install.sh
```

## Run

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

App URL: `http://localhost:8080`

## Test

```bash
npm test
```

## Troubleshooting

### `vite` / `vitest` command not found

Dependencies are not installed yet:

```bash
npm install
```

### TypeScript check fails

There are currently existing typecheck errors in the repository. Build and tests are the reliable baseline checks for now:

```bash
npm run build
npm test
```

### Port already in use

Stop the process using port 8080, or change the app port in your environment config.

### Need Docker instructions

See:

- `README-DOCKER.md`
- `DOCKER.md`
- `DEPLOYMENT.md`
