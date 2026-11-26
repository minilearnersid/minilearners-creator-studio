# MiniLearners Creator Studio (MVP foundation)

A React + Vite starter for MiniLearners Creator Studio.

## Current functionality
- Responsive dashboard and navigation
- Storybook Studio and Worksheet Studio interfaces
- Prompt Builder forms that assemble structured prompts in the browser
- Copy prompt action
- AI Creator preview state (clearly marked as coming next)
- Guest workspace UI

## Not implemented yet
- AI API integration and server-side functions
- Authentication and persistent project storage
- PDF export
- Payment and credit management

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

## Build

```bash
npm run build
```

The production website is generated in `dist/`.

## Deploy to Netlify

1. Push this project to a GitHub repository.
2. In Netlify, choose **Add new project** > **Import an existing project**.
3. Connect GitHub and select this repository.
4. Use build command `npm run build` and publish directory `dist` (also configured in `netlify.toml`).
5. Deploy. Netlify will provide a `*.netlify.app` address.

No environment variables are required for this foundation build. When AI is integrated, API keys must be stored in Netlify environment variables and used only in server-side functions.
