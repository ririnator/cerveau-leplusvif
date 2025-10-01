#!/usr/bin/env node

/**
 * Convert SVG assets to PNG using sharp
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, '..', 'assets');

const conversions = [
  { input: 'icon.svg', output: 'icon.png', size: 1024 },
  { input: 'adaptive-icon.svg', output: 'adaptive-icon.png', size: 1024 },
  { input: 'splash.svg', output: 'splash.png', size: 3000 },
  { input: 'favicon.svg', output: 'favicon.png', size: 48 },
];

async function convertAll() {
  console.log('🎨 Converting SVG assets to PNG...\n');

  for (const { input, output, size } of conversions) {
    const inputPath = path.join(assetsDir, input);
    const outputPath = path.join(assetsDir, output);

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  ${input} not found, skipping...`);
      continue;
    }

    try {
      await sharp(inputPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 10, g: 10, b: 10, alpha: 1 }, // #0a0a0a
        })
        .png()
        .toFile(outputPath);

      const stats = fs.statSync(outputPath);
      console.log(`✅ ${output} (${size}x${size}) - ${(stats.size / 1024).toFixed(1)}KB`);
    } catch (error) {
      console.error(`❌ Failed to convert ${input}:`, error.message);
    }
  }

  console.log('\n🎉 Asset conversion complete!');
  console.log('   Check apps/mobile/assets/ for generated PNGs');
}

convertAll().catch(console.error);
