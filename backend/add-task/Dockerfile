# backend/add-task/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# ✅ System dependencies: curl + gnupg2 + unixodbc + Microsoft SQL ODBC Driver 18
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        gnupg2 \
        unixodbc && \
    # Microsoft GPG key ko sahi jagah pe daalna (jahan repo expect karta hai)
    mkdir -p /usr/share/keyrings && \
    curl https://packages.microsoft.com/keys/microsoft.asc | \
        gpg --dearmor > /usr/share/keyrings/microsoft-prod.gpg && \
    # Debian 12 ke liye MSSQL repo add karo
    curl https://packages.microsoft.com/config/debian/12/prod.list \
        -o /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y --no-install-recommends \
        msodbcsql18 && \
    # Cleanup
    rm -rf /var/lib/apt/lists/*

# 🔹 Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 🔹 App code
COPY . .

EXPOSE 5001
ENV PYTHONUNBUFFERED=1
ENV PORT=5001

CMD ["python", "app.py"]
