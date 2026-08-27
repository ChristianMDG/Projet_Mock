# Server Setup Guide - Contabo Linux

Simple setup instructions for deploying Taxibrousse on a Contabo Linux server.

## Prerequisites

- Fresh Ubuntu/Debian server
- Root access or sudo privileges  
- Domain names pointed to server IP: `taxibrousse.mg`, `cms.taxibrousse.mg`, `dashboard.taxibrousse.mg`, and `location.taxibrousse.mg`

## 1. Install Docker & Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes
```

## 2. Install GitHub Actions Runner

```bash
# Create actions runner user
sudo useradd -m -s /bin/bash actions-runner
sudo usermod -aG docker actions-runner
sudo usermod -aG sudo actions-runner

# Set password for actions-runner user
sudo passwd actions-runner

# Switch to actions runner user
sudo su - actions-runner

# Create runner directory
mkdir actions-runner && cd actions-runner

# Download latest runner (check GitHub for latest version)
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure runner with custom work directory (get token from GitHub repo Settings > Actions > Runners > New self-hosted runner)
# The --work flag sets where job workspaces are created (default is _work in runner directory)
./config.sh --url https://github.com/ofanomezantsoa/taxibrousse \
  --token YOUR_TOKEN_HERE \
  --work /home/actions-runner/work \
  --name contabo-runner \
  --labels self-hosted,linux,x64

# Install as service (requires sudo password)
sudo ./svc.sh install
sudo ./svc.sh start

# Verify runner status
sudo ./svc.sh status
```

## 3. Setup GitHub Container Registry Access

```bash
# IMPORTANT: The GitHub Actions runner needs permission to pull images from GHCR
# Create a Personal Access Token (PAT) with read:packages permission:
# 1. Go to: https://github.com/settings/tokens/new
# 2. Select scopes: read:packages (required for pulling images)
# 3. Generate token and copy it

# Login to GitHub Container Registry as the actions-runner user
# Replace YOUR_GITHUB_TOKEN with the token you created above
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u ofanomezantsoa --password-stdin

# Verify login was successful
docker pull ghcr.io/ofanomezantsoa/taxibrousse-app:latest || echo "Login successful (image doesn't exist yet)"

# Optional: Configure credential helper for persistent login
sudo apt update && sudo apt install -y pass gnupg2
# Note: Docker credentials are stored in ~/.docker/config.json
```

### GitHub Repository Package Settings

**CRITICAL**: The workflow needs write permissions to push to GHCR. Verify these settings:

1. **Repository Settings** → **Actions** → **General** → **Workflow permissions**
   - Select "Read and write permissions" ✅
   - Enable "Allow GitHub Actions to create and approve pull requests" ✅

2. **Package Settings** (after first deployment creates packages):
   - Go to: https://github.com/orgs/ofanomezantsoa/packages (or your user packages)
   - Find `taxibrousse-app` and `taxibrousse-cms` packages
   - Click on each package → **Package settings** → **Manage Actions access**
   - Ensure the repository `ofanomezantsoa/taxibrousse` has **Write** access

3. **Personal Access Token for Deployment** (if using organization):
   - The default `GITHUB_TOKEN` has permissions set in the workflow file (`permissions:` block)
   - If issues persist, create a PAT with `write:packages` and add as secret `GHCR_TOKEN`
   - Update workflow to use: `password: ${{ secrets.GHCR_TOKEN }}`

### Troubleshooting GHCR Push Issues

If you see `denied: installation not allowed to Create organization package`:

```bash
# 1. Check repository workflow permissions (see above)
# 2. Verify packages don't exist yet - they'll be created on first successful push
# 3. If packages exist, check package permissions include the repository
# 4. For organization repos, admin may need to enable package creation in org settings
```

## 4. Create Application Directories

```bash
# Create main application directory
sudo mkdir -p /opt/taxibrousse
sudo chown actions-runner:actions-runner /opt/taxibrousse

# Create certbot directories for SSL
sudo mkdir -p /opt/taxibrousse/certbot/conf
sudo mkdir -p /opt/taxibrousse/certbot/www
sudo chown -R actions-runner:actions-runner /opt/taxibrousse/certbot
```

## 5. Configure GitHub Secrets

Add these secrets in your GitHub repository (Settings > Secrets and variables > Actions):
**Go to: https://github.com/ofanomezantsoa/taxibrousse/settings/secrets/actions**

### Database Configuration:
- `DATABASE_USERNAME`: Database username (e.g., `postgres`)
- `DATABASE_PASSWORD`: Strong database password

### Main Application (Spring Boot):
- `JWT_PUBLIC_KEY`: JWT public key (generate with openssl below)
- `JWT_PRIVATE_KEY`: JWT private key (generate with openssl below)
- `FACEBOOK_CLIENT_ID`: Facebook OAuth2 client ID
- `FACEBOOK_CLIENT_SECRET`: Facebook OAuth2 client secret
- `GOOGLE_CLIENT_ID`: Google OAuth2 client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth2 client secret

### Redis Configuration (if using Redis for JWT token blacklist):
- `REDIS_URL`: Redis connection URL (e.g., `redis://redis:6379` for Docker or `redis://localhost:6379`)
- `REDIS_TIMEOUT`: Redis timeout in milliseconds (optional, default: `60000`)
- `REDIS_POOL_MAX_ACTIVE`: Max active connections (optional, default: `20`)
- `REDIS_POOL_MAX_IDLE`: Max idle connections (optional, default: `10`)  
- `REDIS_POOL_MIN_IDLE`: Min idle connections (optional, default: `5`)

### CMS Configuration (Strapi):
- `CMS_APP_KEYS`: Comma-separated app keys for Strapi (generate below)
- `CMS_API_TOKEN_SALT`: Random salt for API tokens (generate below)
- `CMS_ADMIN_JWT_SECRET`: JWT secret for admin (generate below)
- `CMS_TRANSFER_TOKEN_SALT`: Transfer token salt (generate below)
- `CMS_JWT_SECRET`: JWT secret for CMS (generate below)

### Cloudinary Configuration:
- `CLOUDINARY_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_KEY`: Your Cloudinary API key
- `CLOUDINARY_SECRET`: Your Cloudinary API secret

### Frontend Configuration:
- `VITE_CMS_API_KEY`: Public CMS API key for frontend (create in Strapi admin)

### NOTE: The following are automatically set by the deployment script:
- `DATABASE_URL` - Built from DATABASE_USERNAME and DATABASE_PASSWORD
- `TAXIBROUSSE_URL` - Set to https://taxibrousse.mg
- `VITE_API_URL` - Set to https://taxibrousse.mg/api
- `VITE_CMS_API_URL` - Set to https://cms.taxibrousse.mg/api
- `DOMAIN_MAIN` - Set to taxibrousse.mg
- `DOMAIN_CMS` - Set to cms.taxibrousse.mg
- `PORT` - Set to 8080

### Generate JWT Keys:
```bash
# Generate private key
openssl genrsa -out private.pem 2048

# Generate public key
openssl rsa -in private.pem -pubout -out public.pem

# Convert to single line (copy content between BEGIN/END)
cat private.pem | tr -d '\n'
cat public.pem | tr -d '\n'
```

### Generate Strapi Secrets:
```bash
# Generate random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 6. Configure DNS Records

**IMPORTANT**: Configure DNS before attempting SSL certificates.

### DNS Configuration Required:

```bash
# Check your server's public IP
curl ifconfig.me
```

Add these DNS records in your domain registrar:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | taxibrousse.mg | YOUR_SERVER_IP | 3600 |
| A | cms.taxibrousse.mg | YOUR_SERVER_IP | 3600 |
| A | www.taxibrousse.mg | YOUR_SERVER_IP | 3600 |
| A | dashboard.taxibrousse.mg | YOUR_SERVER_IP | 3600 |
| A | admin.taxibrousse.mg | YOUR_SERVER_IP | 3600 |
| A | location.taxibrousse.mg | YOUR_SERVER_IP | 3600 |

### Verify DNS Setup:

```bash
# Test DNS resolution (should return your server IP)
nslookup taxibrousse.mg
nslookup cms.taxibrousse.mg
nslookup dashboard.taxibrousse.mg
nslookup admin.taxibrousse.mg
nslookup location.taxibrousse.mg

# Alternative check
dig +short taxibrousse.mg
dig +short cms.taxibrousse.mg
dig +short dashboard.taxibrousse.mg
dig +short admin.taxibrousse.mg
dig +short location.taxibrousse.mg
```

**Wait 15-60 minutes for DNS propagation before proceeding to SSL setup.**

## 6.1. Configure PTR Record (Recommended)

```bash
# Check current reverse DNS
dig -x $(curl -s ifconfig.me)
```

**Contabo Control Panel:**
1. Login → Your Services → VPS → Select server
2. Find "Reverse DNS" section → Set to `taxibrousse.mg`
3. Save (takes 1-24h to propagate)

## 7. Start Application (Before SSL)

```bash
# Start the application first to serve HTTP content for SSL verification
cd /opt/taxibrousse
docker-compose up -d

# Check if services are running
docker-compose ps

# Check nginx is serving content
curl -I http://taxibrousse.mg
curl -I http://cms.taxibrousse.mg
curl -I http://dashboard.taxibrousse.mg
curl -I http://admin.taxibrousse.mg
```

## 8. Get SSL Certificates

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# FIRST: Ensure your application is running and serving HTTP content
# THEN: Get certificates for all domains including dashboard and location
sudo certbot --nginx -d taxibrousse.mg -d www.taxibrousse.mg -d cms.taxibrousse.mg -d dashboard.taxibrousse.mg -d admin.taxibrousse.mg -d location.taxibrousse.mg --email olivier.fnz@gmail.com --agree-tos --non-interactive

# If you get DNS errors, troubleshoot:
sudo certbot --nginx -d taxibrousse.mg -d www.taxibrousse.mg -d cms.taxibrousse.mg -d dashboard.taxibrousse.mg -d admin.taxibrousse.mg -d location.taxibrousse.mg --email olivier.fnz@gmail.com --agree-tos --dry-run -v

# Verify auto-renewal setup
sudo certbot renew --dry-run

# Check certificate status
sudo certbot certificates
```

### Troubleshooting SSL Issues:

```bash
# If DNS issues persist, get certificates one at a time:
sudo certbot --nginx -d taxibrousse.mg --email olivier.fnz@gmail.com --agree-tos --non-interactive

# Then add the subdomains:
sudo certbot --nginx -d cms.taxibrousse.mg --email olivier.fnz@gmail.com --agree-tos --non-interactive
sudo certbot --nginx -d dashboard.taxibrousse.mg --email olivier.fnz@gmail.com --agree-tos --non-interactive

# Check nginx configuration after SSL
sudo nginx -t

# Restart nginx if needed
sudo docker-compose restart nginx
```

## 8.1. Configure Nginx Proxy Settings

After SSL certificates are installed, create and configure the taxibrousse site configuration at `/etc/nginx/sites-available/taxibrousse` to properly proxy requests to the Docker applications:

```bash
# Create or edit the taxibrousse site configuration
sudo nano /etc/nginx/sites-available/taxibrousse
# (or copy system-nginx.conf from the repository: sudo cp /opt/taxibrousse/nginx/system-nginx.conf /etc/nginx/sites-available/taxibrousse)

# Enable the taxibrousse site configuration by creating a symlink in sites-enabled
sudo ln -sf /etc/nginx/sites-available/taxibrousse /etc/nginx/sites-enabled/

# Remove or disable the default site configuration to prevent conflicts
sudo rm -f /etc/nginx/sites-enabled/default
```

**Important**: Save the following setup into `/etc/nginx/sites-available/taxibrousse`:

```nginx
# System nginx configuration - to be placed in /etc/nginx/sites-available/taxibrousse
# This proxies internet traffic to the Docker nginx container

# Default server configuration
server {
        listen 80;
        listen [::]:80;

        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;
        server_name _;

        location / {
                try_files $uri $uri/ =404;
        }
}

# Main domain server block (taxibrousse.mg and www.taxibrousse.mg)
server {
        server_name taxibrousse.mg www.taxibrousse.mg;

        # Custom 502 Bad Gateway
        error_page 502 /502.html;
        location = /502.html {
            return 200 '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mise en route</title><style>body{font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background-color:#f6f6f7;color:#011638;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;margin:0;text-align:center;padding:20px;box-sizing:border-box}.card{background:#fff;border:1px solid rgba(1,22,56,.12);border-radius:16px;padding:40px 30px;max-width:450px;box-shadow:0 8px 32px 0 rgba(1,22,56,.06);display:flex;flex-direction:column;align-items:center}.spinner{width:50px;height:50px;border:3px solid rgba(1,22,56,.1);border-radius:50%;border-top-color:#011638;animation:spin 1s cubic-bezier(.5,.1,.4,.9) infinite;margin-bottom:24px}@keyframes spin{to{transform:rotate(360deg)}}h1{font-size:22px;font-weight:600;margin:0 0 12px 0;color:#011638;letter-spacing:-.01em}p{font-size:14px;color:#6c757d;line-height:1.6;margin:0}.footer{margin-top:30px;font-size:11px;color:rgba(1,22,56,.3)}</style></head><body><div class="card"><div class="spinner"></div><h1>Mise en route de l&rsquo;application</h1><p>Le service red&eacute;marre ou est en cours de maintenance. Cette page s&rsquo;actualisera automatiquement d&egrave;s que l&rsquo;application sera disponible.</p><div class="footer">Taxibrousse &copy; 2026</div></div><script>setTimeout(function(){window.location.reload()},4000);</script></body></html>';
            add_header Content-Type text/html;
            internal;
        }

        # WebSocket proxy
        location /ws {
                proxy_pass http://127.0.0.1:8080;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_read_timeout 86400;
                proxy_send_timeout 86400;
        }

        # Proxy to Docker frontend application
        location / {
                proxy_pass http://127.0.0.1:8080;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_set_header X-Forwarded-Host $host;
                proxy_set_header X-Forwarded-Port $server_port;
        }

        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/taxibrousse.mg/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/taxibrousse.mg/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

# CMS subdomain server block
server {
        server_name cms.taxibrousse.mg;

        # Custom 502 Bad Gateway
        error_page 502 /502.html;
        location = /502.html {
            return 200 '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mise en route</title><style>body{font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background-color:#f6f6f7;color:#011638;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;margin:0;text-align:center;padding:20px;box-sizing:border-box}.card{background:#fff;border:1px solid rgba(1,22,56,.12);border-radius:16px;padding:40px 30px;max-width:450px;box-shadow:0 8px 32px 0 rgba(1,22,56,.06);display:flex;flex-direction:column;align-items:center}.spinner{width:50px;height:50px;border:3px solid rgba(1,22,56,.1);border-radius:50%;border-top-color:#011638;animation:spin 1s cubic-bezier(.5,.1,.4,.9) infinite;margin-bottom:24px}@keyframes spin{to{transform:rotate(360deg)}}h1{font-size:22px;font-weight:600;margin:0 0 12px 0;color:#011638;letter-spacing:-.01em}p{font-size:14px;color:#6c757d;line-height:1.6;margin:0}.footer{margin-top:30px;font-size:11px;color:rgba(1,22,56,.3)}</style></head><body><div class="card"><div class="spinner"></div><h1>Mise en route de l&rsquo;application</h1><p>Le service red&eacute;marre ou est en cours de maintenance. Cette page s&rsquo;actualisera automatiquement d&egrave;s que l&rsquo;application sera disponible.</p><div class="footer">Taxibrousse &copy; 2026</div></div><script>setTimeout(function(){window.location.reload()},4000);</script></body></html>';
            add_header Content-Type text/html;
            internal;
        }

        # Redirect root to admin panel
        location = / {
                return 301 https://$host/admin;
        }

        # Proxy to Docker CMS application
        location / {
                proxy_pass http://127.0.0.1:1337;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_set_header X-Forwarded-Host $host;
                proxy_set_header X-Forwarded-Port $server_port;
        }

        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/taxibrousse.mg/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/taxibrousse.mg/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

# Dashboard subdomain server block
server {
        server_name dashboard.taxibrousse.mg;

        # Custom 502 Bad Gateway
        error_page 502 /502.html;
        location = /502.html {
            return 200 '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mise en route</title><style>body{font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background-color:#f6f6f7;color:#011638;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;margin:0;text-align:center;padding:20px;box-sizing:border-box}.card{background:#fff;border:1px solid rgba(1,22,56,.12);border-radius:16px;padding:40px 30px;max-width:450px;box-shadow:0 8px 32px 0 rgba(1,22,56,.06);display:flex;flex-direction:column;align-items:center}.spinner{width:50px;height:50px;border:3px solid rgba(1,22,56,.1);border-radius:50%;border-top-color:#011638;animation:spin 1s cubic-bezier(.5,.1,.4,.9) infinite;margin-bottom:24px}@keyframes spin{to{transform:rotate(360deg)}}h1{font-size:22px;font-weight:600;margin:0 0 12px 0;color:#011638;letter-spacing:-.01em}p{font-size:14px;color:#6c757d;line-height:1.6;margin:0}.footer{margin-top:30px;font-size:11px;color:rgba(1,22,56,.3)}</style></head><body><div class="card"><div class="spinner"></div><h1>Mise en route de l&rsquo;application</h1><p>Le service red&eacute;marre ou est en cours de maintenance. Cette page s&rsquo;actualisera automatiquement d&egrave;s que l&rsquo;application sera disponible.</p><div class="footer">Taxibrousse &copy; 2026</div></div><script>setTimeout(function(){window.location.reload()},4000);</script></body></html>';
            add_header Content-Type text/html;
            internal;
        }

        # Health check endpoint
        location /health {
                return 200 "healthy";
                add_header Content-Type text/plain;
                access_log off;
        }

        # All dashboard traffic through Docker nginx
        location / {
                proxy_pass http://127.0.0.1:8080;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_set_header X-Forwarded-Host $host;
                proxy_set_header X-Forwarded-Port $server_port;
                proxy_read_timeout 86400;
                proxy_send_timeout 86400;
        }

        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/taxibrousse.mg/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/taxibrousse.mg/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

# Location subdomain server block
server {
        server_name location.taxibrousse.mg;

        # Custom 502 Bad Gateway
        error_page 502 /502.html;
        location = /502.html {
            return 200 '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mise en route</title><style>body{font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background-color:#f6f6f7;color:#011638;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;margin:0;text-align:center;padding:20px;box-sizing:border-box}.card{background:#fff;border:1px solid rgba(1,22,56,.12);border-radius:16px;padding:40px 30px;max-width:450px;box-shadow:0 8px 32px 0 rgba(1,22,56,.06);display:flex;flex-direction:column;align-items:center}.spinner{width:50px;height:50px;border:3px solid rgba(1,22,56,.1);border-radius:50%;border-top-color:#011638;animation:spin 1s cubic-bezier(.5,.1,.4,.9) infinite;margin-bottom:24px}@keyframes spin{to{transform:rotate(360deg)}}h1{font-size:22px;font-weight:600;margin:0 0 12px 0;color:#011638;letter-spacing:-.01em}p{font-size:14px;color:#6c757d;line-height:1.6;margin:0}.footer{margin-top:30px;font-size:11px;color:rgba(1,22,56,.3)}</style></head><body><div class="card"><div class="spinner"></div><h1>Mise en route de l&rsquo;application</h1><p>Le service red&eacute;marre ou est en cours de maintenance. Cette page s&rsquo;actualisera automatiquement d&egrave;s que l&rsquo;application sera disponible.</p><div class="footer">Taxibrousse &copy; 2026</div></div><script>setTimeout(function(){window.location.reload()},4000);</script></body></html>';
            add_header Content-Type text/html;
            internal;
        }

        # Health check endpoint
        location /health {
                return 200 "healthy";
                add_header Content-Type text/plain;
                access_log off;
        }

        # All location traffic through Docker nginx
        location / {
                proxy_pass http://127.0.0.1:8080;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_set_header X-Forwarded-Host $host;
                proxy_set_header X-Forwarded-Port $server_port;
                proxy_read_timeout 86400;
                proxy_send_timeout 86400;
        }

        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/taxibrousse.mg/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/taxibrousse.mg/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

# Admin / Grafana subdomain server block
server {
        server_name admin.taxibrousse.mg;

        # Custom 502 Bad Gateway
        error_page 502 /502.html;
        location = /502.html {
            return 200 '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mise en route</title><style>body{font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background-color:#f6f6f7;color:#011638;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;margin:0;text-align:center;padding:20px;box-sizing:border-box}.card{background:#fff;border:1px solid rgba(1,22,56,.12);border-radius:16px;padding:40px 30px;max-width:450px;box-shadow:0 8px 32px 0 rgba(1,22,56,.06);display:flex;flex-direction:column;align-items:center}.spinner{width:50px;height:50px;border:3px solid rgba(1,22,56,.1);border-radius:50%;border-top-color:#011638;animation:spin 1s cubic-bezier(.5,.1,.4,.9) infinite;margin-bottom:24px}@keyframes spin{to{transform:rotate(360deg)}}h1{font-size:22px;font-weight:600;margin:0 0 12px 0;color:#011638;letter-spacing:-.01em}p{font-size:14px;color:#6c757d;line-height:1.6;margin:0}.footer{margin-top:30px;font-size:11px;color:rgba(1,22,56,.3)}</style></head><body><div class="card"><div class="spinner"></div><h1>Mise en route de l&rsquo;application</h1><p>Le service red&eacute;marre ou est en cours de maintenance. Cette page s&rsquo;actualisera automatiquement d&egrave;s que l&rsquo;application sera disponible.</p><div class="footer">Taxibrousse &copy; 2026</div></div><script>setTimeout(function(){window.location.reload()},4000);</script></body></html>';
            add_header Content-Type text/html;
            internal;
        }

        # Health check endpoint
        location /health {
                return 200 "healthy";
                add_header Content-Type text/plain;
                access_log off;
        }

        # All admin/Grafana traffic directly to Grafana port
        location / {
                proxy_pass http://127.0.0.1:3030;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_set_header X-Forwarded-Host $host;
                proxy_set_header X-Forwarded-Port $server_port;
                proxy_read_timeout 86400;
                proxy_send_timeout 86400;
        }


        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/taxibrousse.mg/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/taxibrousse.mg/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

# HTTP redirect server blocks
server {
    if ($host = taxibrousse.mg) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = dashboard.taxibrousse.mg) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = admin.taxibrousse.mg) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = cms.taxibrousse.mg) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = www.taxibrousse.mg) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = location.taxibrousse.mg) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    listen [::]:80;
    server_name taxibrousse.mg cms.taxibrousse.mg www.taxibrousse.mg dashboard.taxibrousse.mg admin.taxibrousse.mg location.taxibrousse.mg;
    return 404; # managed by Certbot
}
```
```

```bash
# Test nginx configuration
sudo nginx -t

# Reload nginx if configuration is valid
sudo systemctl reload nginx

# Verify the proxy is working
curl -I https://taxibrousse.mg
curl -I https://cms.taxibrousse.mg
curl -I https://dashboard.taxibrousse.mg
curl -I https://admin.taxibrousse.mg
curl -I https://location.taxibrousse.mg
```

**Important Notes**:
- **Main application** (`taxibrousse.mg`, `www.taxibrousse.mg`) → Proxied to `http://127.0.0.1:8080` (Docker nginx → Spring Boot app)
- **CMS application** (`cms.taxibrousse.mg`) → Proxied to `http://127.0.0.1:8080` (Docker nginx → Strapi CMS)
- **Dashboard application** (`dashboard.taxibrousse.mg`) → Proxied to `http://127.0.0.1:8080` (Docker nginx → Dashboard app)
- **Admin application** (`admin.taxibrousse.mg`) → Proxied to `http://127.0.0.1:3030` (Grafana Monitoring)

- **Location application** (`location.taxibrousse.mg`) → Proxied to `http://127.0.0.1:8080` (Docker nginx → Location app)
- **SSL certificates** are automatically managed by Certbot for all domains
- **HTTP to HTTPS redirect** is enforced for all domains

### Verify Docker Network Configuration

```bash
# Check the running containers
docker-compose ps

# View logs for any issues
docker-compose logs dashboard
```

## 9. Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

## 10. System Optimizations

```bash
# Increase file limits for Docker
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf

# Configure Docker daemon
sudo mkdir -p /etc/docker
echo '{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}' | sudo tee /etc/docker/daemon.json

# Restart Docker
sudo systemctl restart docker
```

## 11. Deploy Application

Push code to your repository's main branch. The GitHub Actions workflow will automatically:

- Build Docker images
- Deploy to the server
- Start all services
- Configure health checks

## 12. Verify Deployment

```bash
# Check running containers
cd /opt/taxibrousse
docker-compose ps

# Check logs
docker-compose logs app
docker-compose logs cms
docker-compose logs nginx

# Test endpoints
curl http://localhost:8080/actuator/health
curl http://localhost:1337/_health
```

## 13. Monitoring & Maintenance

```bash
# View logs
docker-compose logs -f

# Backup database
docker-compose exec postgres pg_dump -U $DB_USER taxibrousse > backup.sql

# Update application (push to main branch triggers auto-deployment)

# Manual restart if needed
docker-compose restart
```

## Troubleshooting

- **Port conflicts**: Check if ports 80, 443, 1337, 3000, 3001, 3002 are free
- **Memory issues**: Monitor with `docker stats`
- **SSL issues**: Check certbot logs in `/var/log/letsencrypt/`
- **GitHub runner issues**: Check service status `sudo systemctl status actions.runner.YOUR_REPO.service`

## Security Notes

- Change default passwords
- Keep system updated
- Monitor logs regularly
- Set up backup schedule
- Use strong JWT secrets