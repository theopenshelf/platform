# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:alpine3.21 as build

# Combine apk commands to reduce layers and improve caching
RUN apk --no-cache add git vim bash openssh gnupg libxml2-utils jq openjdk21 --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/
COPY ./openapi.yaml /usr/local/

# Install all the dependencies
RUN npm ci  # Use npm ci for a clean install based on package-lock.json

# Generate the build of the application
RUN npm run build


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/platform-ui /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Use a non-root user for better security
# USER nginx  # Comment out this line

# Ensure the necessary directories have the correct permissions
RUN mkdir -p /var/cache/nginx/client_temp && \
    chown -R nginx:nginx /var/cache/nginx

# Switch to the nginx user after setting permissions
USER nginx