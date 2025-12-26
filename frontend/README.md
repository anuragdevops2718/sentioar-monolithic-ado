# AI Platform

A lightweight, professional website showcasing AI capabilities, designed for containerized deployment with nginx.

## Container Deployment

### Prerequisites
- Docker installed on your system

### Quick Start

1. **Build the Docker image:**
```bash
docker build -t ai-platform .
```

2. **Run the container:**
```bash
docker run -d -p 80:80 ai-platform
```

3. **Access the website:**
Open your browser and navigate to `http://localhost`

### Dockerfile

Create a `Dockerfile` in your project root:

```dockerfile
FROM nginx:alpine

# Copy build files to nginx html directory
COPY dist/ /usr/share/nginx/html/

# Copy custom nginx configuration (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Building for Production

1. **Build the application:**
```bash
npm run build
```

2. **Build and run the container:**
```bash
docker build -t ai-platform .
docker run -d -p 80:80 --name ai-platform-container ai-platform
```

### Container Management

**Stop the container:**
```bash
docker stop ai-platform-container
```

**Remove the container:**
```bash
docker rm ai-platform-container
```

**View logs:**
```bash
docker logs ai-platform-container
```

## Development

### Local Development

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- nginx (production)

## License

MIT
