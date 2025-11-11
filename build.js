#!/usr/bin/env node

/**
 * Build script to create standalone HTML page with bundled JavaScript
 */

import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function build() {
  console.log('Building standalone HTML page...');

  try {
    // Step 1: Bundle JavaScript using esbuild
    console.log('1. Bundling JavaScript with esbuild...');
    const result = await esbuild.build({
      entryPoints: [join(__dirname, 'browser.js')],
      bundle: true,
      minify: true,
      format: 'iife', // Immediately Invoked Function Expression for browser
      write: false, // Don't write to disk, we'll get the output as text
      platform: 'browser',
      target: 'es2020'
    });

    const bundledJS = result.outputFiles[0].text;
    console.log(`   Bundled JS size: ${(bundledJS.length / 1024).toFixed(2)} KB`);

    // Step 2: Read HTML template
    console.log('2. Reading HTML template...');
    const htmlTemplate = readFileSync(join(__dirname, 'template.html'), 'utf-8');

    // Step 3: Inject bundled JS into HTML template
    console.log('3. Injecting bundled JavaScript into HTML...');
    const finalHTML = htmlTemplate.replace(
      '<!-- BUNDLE_PLACEHOLDER -->',
      `<script>\n${bundledJS}\n</script>`
    );

    // Step 4: Write final HTML file
    const outputPath = join(__dirname, 'index.html');
    writeFileSync(outputPath, finalHTML);
    console.log(`4. Standalone HTML created: ${outputPath}`);
    console.log(`   Total file size: ${(finalHTML.length / 1024).toFixed(2)} KB`);

    console.log('\n✓ Build completed successfully!');
    console.log(`\nYou can now open ${outputPath} in any web browser.`);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
