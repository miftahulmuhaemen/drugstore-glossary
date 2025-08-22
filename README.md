## Build & Run
- Runs a shell as a login shell (bash -lc)
- Changes to the project directory (DIR_PROJECT)
- Builds the static site with node scripts/build.js, silencing output
- Changes to the dist directory
- Serves the built site locally at http://127.0.0.1:8080 using Python's HTTP server
- Rationale: Automates build and local preview of the static site.

`bash -lc 'cd {{DIR_PROJECT}} && node scripts/build.js >/dev/null 2>&1 && cd dist && python3 -m http.server 8080 --bind 127.0.0.1'`