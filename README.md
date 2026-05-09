# Taylor's Sphere Static Site

A legacy multi page static site starter powered by Webpack, Twig templating, Babel, and SCSS.

This project was originally built for marketing and campaign based pages with reusable components, JSON mock data support, SVG spritemaps, and a lightweight development workflow.

## Tech Stack

- Webpack 5
- Twig Templates
- Babel
- SCSS
- PostCSS
- SVG Spritemap
- Nodemon
- Webpack Dev Server

---

## Getting Started

### Recommended Environment

This project uses older dependencies and works best with:

- Node.js 16.x
- npm 8.x

If you're using `nvm`:

```bash
nvm install 16
nvm use 16
```

---

## Installation

Install dependencies:

```bash
npm install
```

If you encounter issues with older packages such as `fibers`, make sure you are running Node 16 instead of newer Node versions.

---

## Running the Project

Start local development server:

```bash
npm run serve
```

The project will be available at:

```bash
http://localhost:8080
```

---

## Build for Production

```bash
npm run build
```

Production files will be generated inside:

```bash
/dist
```

---

## Project Structure

```bash
src/
├── apps/                # App entry points
├── assets/
│   ├── icons/           # SVG icons compiled into spritemap
│   ├── img/             # Images
│   └── fonts/           # Fonts
├── js/                  # Shared JavaScript utilities
├── mocks/               # JSON mock data
├── scss/                # Global SCSS styles
├── templates/           # Twig templates/layouts/components
└── *.twig               # Page level Twig files
```

---

## Features

- Multi page Webpack setup
- Twig based templating workflow
- SCSS compilation with PostCSS
- Babel transpilation
- SVG spritemap generation
- JSON mock data support
- Live reload development server

---

## SVG Spritemap

Place SVG icons inside:

```bash
src/assets/icons
```

Generated spritemap output:

```bash
dist/icons/icons.svg
```

---

## Notes

This is a legacy starter project and some dependencies may be deprecated.

If dependency issues occur:

- Clear `node_modules`
- Reinstall packages
- Use Node 16
- Install missing Babel plugins manually if needed

Example:

```bash
npm install @babel/plugin-syntax-class-properties --save-dev
```

---

## License

Internal project starter template for static campaign and marketing websites.