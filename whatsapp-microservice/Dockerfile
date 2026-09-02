# Use the official Puppeteer image which comes with Chromium pre-installed
FROM ghcr.io/puppeteer/puppeteer:latest

# Switch to root to configure permissions
USER root

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Ensure the puppeteer user has permissions to write the auth session data
RUN chown -R pptruser:pptruser /usr/src/app

# Switch back to the puppeteer user for security
USER pptruser

# Expose the port the app runs on
EXPOSE 4000

# Start the application
CMD [ "npm", "start" ]
