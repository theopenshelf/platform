#!/bin/bash

echo "Generating config.json from template..."
envsubst < /usr/share/nginx/html/assets/config.template.json > /usr/share/nginx/html/assets/config.json
echo "Config generation complete"

# If a custom theme exists, compile it
echo "Checking for custom theme..."
if [ -f /usr/share/nginx/html/assets/theme/custom-theme.scss ]; then
    echo "Custom theme found, compiling..."
    # Generate directly in assets folder
    sass /usr/share/nginx/html/assets/theme/custom-theme.scss:/usr/share/nginx/html/assets/custom-theme.css
    echo "Theme compilation complete"
else
    echo "No custom theme found, using default"
fi

echo "Starting nginx..."
exec nginx -g 'daemon off;'