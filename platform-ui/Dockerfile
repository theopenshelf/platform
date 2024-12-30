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

# Set the environment variable for Angular environment
ENV NODE_ENV=development

# Install all the dependencies
RUN npm ci  # Use npm ci for a clean install based on package-lock.json

# Generate the build of the application with the development environment
RUN npm run build -- --configuration=development

# Stage 2: Serve app with nginx server
FROM nginx:latest

# Copy the custom nginx configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy the built Angular app from the build stage to the Nginx directory
COPY --from=build /usr/local/app/dist/platform-ui/browser/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]