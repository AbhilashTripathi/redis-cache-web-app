# Build stage for frontend
FROM node:16 AS frontend-build
WORKDIR /app/my-react-app
COPY my-react-app/package*.json ./
RUN npm install
COPY my-react-app .
RUN npm run build

# Build stage for backend
FROM node:16 AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend .

# Final stage
FROM node:16-alpine
WORKDIR /app
COPY --from=backend-build /app/backend ./backend
COPY --from=frontend-build /app/my-react-app/dist ./frontend/dist
WORKDIR /app/backend
CMD ["node", "index.js"]