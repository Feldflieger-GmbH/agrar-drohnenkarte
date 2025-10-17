#!/usr/bin/env node

/**
 * Post-build script to inject runtime configuration placeholders into the built index.html
 * This allows environment variables to be substituted at container runtime via entrypoint.sh
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = join(__dirname, '..', 'dist', 'index.html');

console.log('Injecting runtime configuration placeholders into dist/index.html...');

// Read the built index.html
let html = readFileSync(indexPath, 'utf-8');

// Inject the runtime configuration script before </head>
const runtimeConfigScript = `
    <!-- Runtime Configuration -->
    <script>
        window.config = {
            baseUrl: '\${BASE_URL}',
            clientId: '\${CLIENT_ID}',
            googleMaps: {
                apiKey: '\${GOOGLE_MAPS_API_KEY}',
                mapId: '\${GOOGLE_MAPS_MAP_ID}'
            },
            mapbox: {
                apiKey: '\${MAPBOX_API_KEY}'
            }
        };
    </script>

`;

// Insert before </head>
html = html.replace('</head>', `${runtimeConfigScript}</head>`);

// Write back
writeFileSync(indexPath, html, 'utf-8');

console.log('✓ Runtime configuration placeholders injected successfully');
