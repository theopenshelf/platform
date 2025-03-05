# Stage 1: Build
FROM node:alpine3.21 as build

# Combine apk commands to reduce layers and improve caching
RUN apk --no-cache add git vim bash openssh gnupg libxml2-utils jq openjdk21 --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/
COPY ./openapi.yaml /usr/local/

# Set the environment variable for Angular environment
ENV NODE_ENV=development

# Install all the dependencies
RUN npm ci

# Generate the build of the application
RUN npm run build

# Stage 2: Serve
FROM nginx:latest

# Install required tools
RUN apt-get update && apt-get install -y \
    gettext-base \
    vim \
    nodejs \
    npm && \
    npm install -g sass

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/local/app/dist/platform-ui/browser/ /usr/share/nginx/html
COPY --from=build /usr/local/app/src/assets/config.template.json /usr/share/nginx/html/assets/
COPY --chmod=755 ./entrypoint.sh /

# Create directory for custom theme
RUN mkdir -p /usr/share/nginx/html/assets/theme

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]