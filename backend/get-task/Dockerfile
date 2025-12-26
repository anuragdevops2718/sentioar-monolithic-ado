FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        gnupg \
        unixodbc && \
    mkdir -p /usr/share/keyrings && \
    # Microsoft GPG key ko /usr/share/keyrings me daal rahe hain
    curl https://packages.microsoft.com/keys/microsoft.asc | \
        gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg && \
    # MSSQL repo add karo (Debian 12 / bookworm)
    echo "deb [signed-by=/usr/share/keyrings/microsoft-prod.gpg] https://packages.microsoft.com/debian/12/prod bookworm main" \
        > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y --no-install-recommends \
        msodbcsql18 && \
    rm -rf /var/lib/apt/lists/*
    
# install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy app
COPY . .

EXPOSE 5000
ENV PYTHONUNBUFFERED=1
ENV PORT=5000

CMD ["python", "app.py"]
