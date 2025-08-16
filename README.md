# agrow-app

Agrow is a mobile plant management and sharing application focused on agave plants. Its goals are to simplify growth tracking, connect growers through social features, and lay the groundwork for NFC and shelf-management integrations.

For a comprehensive overview of the project requirements, see [docs/requirements.md](docs/requirements.md).

## Features

- Track agave collections with photos, tags, and growth history
- Social timeline for posting updates and interacting with other growers
- NFC tag support and shelf management for organizing real-world plants
- Offline-first experience backed by background synchronization
- Supabase-powered authentication, database, and storage

## Tech stack

- React Native with Expo (managed workflow)
- TypeScript
- Supabase
- SQLite for local storage
- Jest for unit testing

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo](https://docs.expo.dev/get-started/installation/)

## Installation

Install dependencies:

```bash
npm install
```

## Basic commands

- `npm start` – start the development server.
- `npm run android` – run on an Android emulator or device.
- `npm run ios` – run on an iOS simulator or device.
- `npm run web` – run in a web browser.

## Environment variables

The app expects the following environment variables to be defined (e.g. via a `.env` file):

- `EXPO_PUBLIC_SUPABASE_URL` – Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key

## Local Supabase

A `docker-compose.yml` file is provided to run Supabase locally. Copy `.env.example` to `.env` and start the stack:

```bash
cp .env.example .env
docker compose up -d
```

The containers expose the Supabase APIs on your `localhost` so the application can connect using the values from the `.env` file. When you're done, stop the services with:

```bash
docker compose down
```

## Project structure

```
├── screens          # React Native screens
├── services         # API and business logic
├── middleware       # Server middleware
├── utils            # Utility functions and tests
├── supabase         # Supabase SQL and type definitions
└── docs             # Project documentation
```

## Testing

Run unit tests with:

```bash
npm test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the [MIT License](LICENSE).

