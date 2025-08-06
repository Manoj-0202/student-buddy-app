# Stage 1: Build the application
FROM node:22.16.0-slim AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) to install dependencies first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application (this could be a React/Angular app or similar)
RUN npm run build

# Stage 2: Create the production image with Nginx
FROM nginx:alpine

# Copy the build output from the build stage into Nginx's default HTML directory
COPY --from=build /app/build /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

# Expose the port that Nginx will use
EXPOSE 3000

# Run Nginx in the foreground (necessary to keep the container running)
CMD ["nginx", "-g", "daemon off;"]
