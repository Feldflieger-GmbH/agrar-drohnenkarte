#!/bin/sh

# Replace placeholders with environment variables
envsubst '${COOKIEBOT_ID} ${GA_ID} ${GOOGLE_MAPS_API_KEY} ${GOOGLE_MAPS_MAP_ID}' < /usr/share/nginx/html/index.html.template > /usr/share/nginx/html/index.html

# Start nginx
exec "$@"