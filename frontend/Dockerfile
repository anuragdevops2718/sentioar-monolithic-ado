# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# 🔹 Build-time variables for backend URLs
ARG VITE_GET_API_BASE_URL
ARG VITE_ADD_API_BASE_URL

# 🔹 Vite env vars (React code me import.meta.env se read honge)
ENV VITE_GET_API_BASE_URL=${VITE_GET_API_BASE_URL}
ENV VITE_ADD_API_BASE_URL=${VITE_ADD_API_BASE_URL}

RUN npm run build

# ---------- RUNTIME STAGE ----------
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
