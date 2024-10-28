# Use the official Node.js 18 image as a base
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Add environment variables (or load from a file in production)
ENV TELEGRAM_BOT_TOKEN=<7931379437:AAFfVDM6yUS-3BP4oYUj22keCw0GoqZCQqg>
ENV GOOGLE_SHEET_ID=<190BCHXyUN-NZavPGRbUh00v3sRCsg7PpcZsTfgVBcH4>
ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/anuranan1-234335cc44a9.json
ENV OPENAI_API_KEY=<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>

# Copy Google Cloud credentials file
COPY /anuranan1-234335cc44a9.json /usr/src/app/anuranan1-234335cc44a9.json

# Expose the port (if needed for any local testing; typically not required for Telegram bots)
EXPOSE 3000

# Start the bot
CMD ["node", "bot.js"]
