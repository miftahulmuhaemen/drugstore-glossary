#!/usr/bin/env node
/* Build: copy minimal assets to dist. Keep under 8KB total (runtime excludes node_modules). */
const fs = require('fs');
const path = require('path');
const { minify: minifyHtml } = require('html-minifier-terser');
const csso = require('csso');

const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }
function copy(src, dest) { fs.copyFileSync(src, dest); }

ensureDir(distDir);
ensureDir(path.join(distDir, 'data'));

// Copy HTML
let html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
// Inline small tweaks: keep as-is, then minify
// Minify HTML
minifyHtml(html, {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeAttributeQuotes: false,
  minifyCSS: true,
  minifyJS: true
}).then(min => fs.writeFileSync(path.join(distDir, 'index.html'), min));

// Copy normalize to dist and rewrite @import path in CSS for static hosting
let css = fs.readFileSync(path.join(projectRoot, 'style.css'), 'utf8');
const minified = csso.minify(css).css;
fs.writeFileSync(path.join(distDir, 'style.css'), minified);

// Copy a single json (as per instruction). Choose the first *.json in /data.
const dataDir = path.join(projectRoot, 'data');
const jsons = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
if (jsons.length === 0) {
  console.error('No JSON files in /data');
  process.exit(1);
}
const jsonName = jsons[0];
const srcJson = path.join(dataDir, jsonName);
copy(srcJson, path.join(distDir, 'data', jsonName));

console.log('Build complete:', { distDir, data: jsonName });


