#!/bin/bash

# Generate config.json with environment variables replaced
envsubst < /usr/share/nginx/html/assets/config.template.json > /usr/share/nginx/html/assets/config.json

# If a custom theme exists, compile it
if [ -f /usr/share/nginx/html/assets/theme/custom-theme.scss ]; then
    sass /usr/share/nginx/html/assets/theme/custom-theme.scss:/usr/share/nginx/html/assets/theme/custom-theme.css
fi

# Start nginx
exec nginx -g 'daemon off;' 