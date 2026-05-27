# Hand Cricket

A modern, premium Hand Cricket game built with HTML, CSS, and Vanilla TypeScript. The project includes a small Express server to serve the game and persist score data in `scores.json`.

## Features

- Browser-based hand cricket gameplay
- Web Audio API sound effects for hits, wickets, cheers, and high scores
- Persistent high score and game history saved via a small server API
- TypeScript source code with build and watch scripts

## Prerequisites

- Node.js 18+ recommended
- npm

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Build TypeScript:

```bash
npm run build
```

3. Start the server:

```bash
npm run start
```

4. Open the game in your browser:

```text
http://localhost:3000
```

## Development

To automatically rebuild TypeScript as you edit:

```bash
npm run watch
```

## Project Structure

- `index.html` — main game page
- `style.css` — game styles
- `app.ts` — TypeScript source for game logic
- `app.js` — compiled JavaScript game controller
- `server.js` — Express server for static files and score persistence
- `scores.json` — saved scores and game history
- `package.json` — project metadata and scripts
- `tsconfig.json` — TypeScript configuration

## API Endpoints

- `GET /api/scores` — fetch saved scores
- `POST /api/scores` — save scores and game history

## Notes

- The Express server serves static assets from the project root.
- Keep `scores.json` in the project root so the API can read and update the saved data.

## License

This project does not include a license file. Add one if you want to clarify reuse terms.
