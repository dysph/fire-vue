# Repository Guidelines

## Project Structure & Module Organization

This is a Vite-powered Vue 3 + TypeScript FIRE cashflow simulator. Application entry points are `index.html`, `src/main.ts`, and `src/App.vue`. Reusable UI lives in `src/components/`, while pure calculation and formatting logic lives in `src/domain/`. Browser persistence helpers are in `src/storage.ts`. Global styles are in `src/style.css`. Unit tests are currently colocated with domain modules as `src/domain/*.test.ts`. Build output is generated in `dist/` and should not be edited manually.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Vite development server, normally at `http://127.0.0.1:5173/`.
- `npm run build`: run TypeScript/Vue type checking with `vue-tsc --noEmit`, then produce the production Vite build.
- `npm run preview`: serve the built app locally for production-build verification.
- `npm test`: run the Vitest suite once.

## Coding Style & Naming Conventions

Use TypeScript and Vue single-file components. Follow the existing style: two-space indentation, single quotes, no semicolons, and explicit named exports for domain utilities. Vue components use PascalCase filenames such as `PlanInputs.vue`; TypeScript modules use descriptive camelCase or lower-case names such as `simulation.ts` and `format.ts`. Keep calculation logic in `src/domain/` independent from Vue components so it remains easy to test.

## Testing Guidelines

Vitest is the test framework. Place tests beside the module they cover using the `*.test.ts` suffix, for example `src/domain/simulation.test.ts`. Prefer focused tests for financial rules, event timing, edge cases, and formatting behavior. Run `npm test` before submitting changes, and run `npm run build` when touching TypeScript types, Vue components, or Vite configuration.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `Add wan hints for money inputs` and `Show calendar year in results table`. Keep commit subjects concise and describe the user-visible or technical change. Pull requests should include a brief summary, test results, linked issues when applicable, and screenshots or screen recordings for UI changes. Note any changes to calculation assumptions clearly.

## Security & Configuration Tips

Do not commit secrets or local environment files. Treat `dist/` and `node_modules/` as generated artifacts. The app uses a relative Vite `base: './'`, which supports static hosting such as GitHub Pages; preserve that unless deployment requirements change.
