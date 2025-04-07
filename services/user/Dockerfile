FROM node

# Create app directory
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

COPY . .

# Build for TypeScript (if using it)
RUN npm run build

EXPOSE 8001

# Run compiled code (assumes dist/index.js exists)
CMD ["node", "dist/index.js"]
