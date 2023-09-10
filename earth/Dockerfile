# Use the official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy the rest of the application code to the working directory
COPY . .

# Install project dependencies
RUN npm install


# Build the TypeScript code
RUN npm run build

# Expose the port that the application will run on
# EXPOSE 3001

# Define the command to run your application
CMD npm start
