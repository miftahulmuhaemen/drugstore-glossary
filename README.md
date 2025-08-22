# Drugstore Glossary

A static drug glossary site crawled from https://e-fornas.kemkes.go.id/guest/daftar-obat.

## Flow Process

1. **Crawl Data**
   - Use `/notebook/drugs.ipynb` to scrape and generate `data/data.json` from the source.

2. **Static Site Generation**
   - Build the static website with Node.js scripts.
   - The frontend fetches drug data from the local `data/data.json`.

3. **Deployment**
   - Deploy the built site to GitHub Pages for public access as a static website.


## Project Structure

```
drugstore/
├── data/           # JSON data sources
├── scripts/        # Build scripts
├── dist/           # Built static site (auto-generated)
├── .github/        # GitHub Actions workflow
└── index.html      # Main application
```

## Quick Start

### Prerequisites
- Node.js 20+
- npm

### Installation
```bash
npm install
```

### Build & Run

```
bash -lc 'node scripts/build.js >/dev/null 2>&1 && cd dist && python3 -m http.server 8080 --bind 127.0.0.1'
```

## Deployment

The site automatically deploys to GitHub Pages via GitHub Actions when code is pushed to the `main` or `master` branch.

**Live Site**: [https://miftahulmuhaemen.github.io/drugstore-glossary/](https://miftahulmuhaemen.github.io/drugstore-glossary/)

## Technologies

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Build Tools**: Node.js, CSSo, html-minifier-terser
- **Deployment**: GitHub Actions, GitHub Pages
- **Data Format**: JSON