# Nafas

Nafas is a web-based application that serves as a digital replacement for a physical Acute Respiratory Infection (ARI) timer. ARI timers are used by healthcare providers to accurately measure a person's respiratory rate, which is a key indicator for diagnosing ARIs, especially in children.

This application aims to provide an accessible and easy-to-use alternative to the physical device, available on any device with a web browser.

## Features

*   **Privacy-First by Design:** Your privacy is paramount. We do not collect or store any of your measurement data. All session information is encoded directly into the URL, giving you full control over your information. To share, simply use the URL.
*   **Accurate Timing:** Provides a 60-second timer to count respirations, with an option for a 30-second count.
*   **Tap Counter:** A simple tap interface to count each breath.
*   **Multilingual Support:** Available in English and Indonesian.
*   **Audio Cues:** Provides audio feedback for starting the timer and other interactions.
*   **Shareable Results:** Generate a unique link to share the results of a respiratory count.

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

*   `bun run dev`: Starts the development server.
*   `bun run build`: Builds the application for production.
*   `bun run start`: Starts a production server.
*   `bun run lint`: Lints the codebase.

## Tech Stack

*   [Next.js](https://nextjs.org/) - React framework
*   [React](https://react.dev/) - JavaScript library for building user interfaces
*   [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
*   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
*   [Zustand](https://zustand-demo.pmnd.rs/) - Small, fast and scalable bearbones state-management for React
*   [next-intl](https://next-intl-docs.vercel.app/) - Internationalization for Next.js
*   [Lucide React](https://lucide.dev/) - Simply beautiful open-source icons

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
