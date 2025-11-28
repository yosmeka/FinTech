const fs = require('fs');
const path = require('path');

const STANDALONE_DIR = path.join(process.cwd(), '.next', 'standalone');
const DEST_NEXT_DIR = path.join(STANDALONE_DIR, '.next');

// --- 1. Copy public/ to standalone/public/ ---
const publicSource = path.join(process.cwd(), 'public');
const publicDest = path.join(STANDALONE_DIR, 'public');

console.log(`Copying public folder from ${publicSource} to ${publicDest}`);
fs.cpSync(publicSource, publicDest, { recursive: true });


// --- 2. Copy .next/static to standalone/.next/static/ ---
const staticSource = path.join(process.cwd(), '.next', 'static');
const staticDest = path.join(DEST_NEXT_DIR, 'static');

console.log(`Copying static assets from ${staticSource} to ${staticDest}`);
fs.cpSync(staticSource, staticDest, { recursive: true });