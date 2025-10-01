#!/usr/bin/env node

/**
 * Generate placeholder assets for Cerveau Vif
 * Creates simple, production-quality placeholders using Canvas API
 *
 * Run: node scripts/generate-assets.js
 */

const fs = require('fs');
const path = require('path');

// Colors
const DARK_BG = '#0a0a0a';
const PRIMARY = '#6366f1';
const TEXT = '#ffffff';

/**
 * Create SVG for app icon (1024x1024)
 */
function createIconSVG() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1024" height="1024" fill="${DARK_BG}"/>

  <!-- Border -->
  <rect x="32" y="32" width="960" height="960" rx="96" fill="none" stroke="${PRIMARY}" stroke-width="8"/>

  <!-- CV Monogram -->
  <text x="512" y="600" font-family="Arial, sans-serif" font-size="420" font-weight="bold"
        text-anchor="middle" fill="${PRIMARY}">CV</text>

  <!-- Subtitle -->
  <text x="512" y="780" font-family="Arial, sans-serif" font-size="80" font-weight="normal"
        text-anchor="middle" fill="${TEXT}" opacity="0.6">CERVEAU VIF</text>
</svg>`;
}

/**
 * Create SVG for adaptive icon (1024x1024, foreground only)
 */
function createAdaptiveIconSVG() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Keep content in center 66% for safe area -->
  <g transform="translate(512, 512)">
    <!-- CV Monogram -->
    <text x="0" y="80" font-family="Arial, sans-serif" font-size="480" font-weight="bold"
          text-anchor="middle" fill="${PRIMARY}">CV</text>
  </g>
</svg>`;
}

/**
 * Create SVG for splash screen (3000x3000)
 */
function createSplashSVG() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="3000" height="3000" viewBox="0 0 3000 3000" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="3000" height="3000" fill="${DARK_BG}"/>

  <!-- Centered content -->
  <g transform="translate(1500, 1500)">
    <!-- Main title -->
    <text x="0" y="-100" font-family="Arial, sans-serif" font-size="280" font-weight="bold"
          text-anchor="middle" fill="${TEXT}">CERVEAU VIF</text>

    <!-- Tagline -->
    <text x="0" y="100" font-family="Arial, sans-serif" font-size="120" font-weight="normal"
          text-anchor="middle" fill="${TEXT}" opacity="0.6">10 minutes d'entraînement quotidien</text>

    <!-- Decorative element -->
    <circle cx="0" cy="400" r="20" fill="${PRIMARY}"/>
  </g>
</svg>`;
}

/**
 * Create SVG for favicon (48x48)
 */
function createFaviconSVG() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" fill="${DARK_BG}"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="28" font-weight="bold"
        text-anchor="middle" fill="${PRIMARY}">CV</text>
</svg>`;
}

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Write SVG files
fs.writeFileSync(path.join(assetsDir, 'icon.svg'), createIconSVG());
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.svg'), createAdaptiveIconSVG());
fs.writeFileSync(path.join(assetsDir, 'splash.svg'), createSplashSVG());
fs.writeFileSync(path.join(assetsDir, 'favicon.svg'), createFaviconSVG());

console.log('✅ SVG assets generated in apps/mobile/assets/');
console.log('');
console.log('To convert to PNG (requires imagemagick or similar):');
console.log('  brew install imagemagick');
console.log('  cd apps/mobile/assets');
console.log('  magick icon.svg -resize 1024x1024 icon.png');
console.log('  magick adaptive-icon.svg -resize 1024x1024 adaptive-icon.png');
console.log('  magick splash.svg -resize 3000x3000 splash.png');
console.log('  magick favicon.svg -resize 48x48 favicon.png');
console.log('');
console.log('Or use an online SVG to PNG converter:');
console.log('  https://cloudconvert.com/svg-to-png');
console.log('');
console.log('⚠️  These are placeholders. Replace with professional designs before launch.');
