# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:21-alpine as build

RUN apk --no-cache add git vim
RUN apk --update --no-cache add bash git openssh gnupg libxml2-utils vim jq
RUN apk --no-cache add openjdk11 --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN npm run build


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/fuse /usr/share/nginx/html

# Expose port 80
EXPOSE 80