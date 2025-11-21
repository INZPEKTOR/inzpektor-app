# inZpeKtor Dashboard

A Digital Identity Dashboard built with Express.js, EJS, and TailwindCSS.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build TailwindCSS:
```bash
npm run build-css
```

Or run in watch mode (in a separate terminal):
```bash
npm run build-css
```

3. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

4. Visit `http://localhost:3000/dashboard` in your browser.

## Project Structure

```
/
├── app.js                 # Main Express application
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # TailwindCSS configuration
├── src/
│   ├── routes/          # Express routes
│   ├── controllers/     # Route controllers
│   ├── views/           # EJS templates
│   ├── public/          # Static assets
│   │   └── css/         # Compiled CSS
│   └── styles/          # TailwindCSS input file
```

## Features

- Dark theme with neon green accents
- Responsive dashboard layout
- Digital and physical verification cards
- Unique inspektor Score display
- Modern, futuristic UI design

