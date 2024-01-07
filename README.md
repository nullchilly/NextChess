# Next Chess

This project was bootstrapped frontend with [React](https://www.typescriptlang.org/docs/handbook/react.html), backend with [Python](https://www.python.org/doc/) and database with SQL.

## Features/packages/framework included

- [TypeScript](https://www.typescriptlang.org/) - Type checker.
- [Ant Design](https://ant.design/components/overview/) - Build layout & components.
- [Chess.js](https://github.com/jhlywa/chess.js) - Handle chess game.
- [Nextjs](https://nextjs.org/) - Powerful React framework for seamless development.
- [FastAPI](https://fastapi.tiangolo.com/) - High-performance web framework for building APIs with Python.
- [Socket.io](https://socket.io/docs/v4/) - Real-time communication for dynamic and interactive features.
- [Alembic]() - Database migrations for efficient management and version control.

## Installation
### Frontend
Use the package manager [npm](https://www.npmjs.com/) to install NextChess.
```
npm install
```
Run the app frontend in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

```
npm run next-dev
```
### Backend
Run the app backend in the development mode. Listen at port [http://localhost:8000](http://localhost:8000).

```
npm run fastapi-dev
```
### Database
* Every alembic script is located at `alembic/versions` folder.

* Edit alembic script by SQL

* Run to update database

```
npm run update-db
```

## Configuration

### Environment variables

- To customize environment variables, override values at `src/.env` (create this file if it doesn't exist).

## Run and Deploy
> [!IMPORTANT]
> `cd web; npm run start` to run the production server
>
> The service is available at http://fall2324w3g9.int3306.freeddns.org/

> [!NOTE]
> `npm run dev` to run the development server

## Folder structure

### api
Define all api for application (eg: login, getUserById, getGame, findGame, ...).

### alembic
Contains database migration scripts using Alembic for efficient management and version control.
### src/app
Indexing and organizing application-specific modules and components.

### src/components
You can write components for application inside this folder. Each component should be self-contained as a module.

Example:

```
components
├── Admin
│   └── AdminPage.tsx
│
└── Icon
    ├── BotIcon
    │    ├── Cat.tsx
    │    ├── Elephant.tsx
    │    └── index.tsx
    └── ChessPiece
         ├── BlackKing.tsx
         └── index.tsx
```
### src/helpers

Define all shared constants used in application
### src/types

Define all shared types used in application

### src/context

Define all shared context and context provider used in application

### src/hooks

Define all shared hook used in application

## Copyright

2024 @ UET-VNU
