# Docker Auto-Population Implementation

## Summary

Implemented automatic CMS content population on Docker deployment. The CMS container now automatically populates all content (banners, sections, fokotanies, dynamic pages) after Strapi starts.

## What Was Done

### 1. Created Entrypoint Script (`cms/docker-entrypoint.sh`)
- Starts Strapi in background
- Waits for health check (max 120 seconds)
- Runs all population scripts if `AUTO_POPULATE_CONTENT=true`
- Handles errors gracefully

### 2. Updated CMS Dockerfile
- Added `jq` and `bash` packages for script execution
- Copied entrypoint script and made it executable
- Made all `*.sh` files in content directory executable
- Changed CMD to ENTRYPOINT for proper script execution

### 3. Updated Docker Compose (`docker-compose.local.yml`)
- Added `AUTO_POPULATE_CONTENT=true` environment variable
- Added `STRAPI_API_URL` configuration
- Added `STRAPI_API_TOKEN` for API authentication

### 4. Updated Environment Template (`.env`)
- Added `AUTO_POPULATE_CONTENT` configuration option
- Added `STRAPI_API_TOKEN` placeholder

### 5. Created Documentation
- `cms/content/AUTO-POPULATION-DEPLOYMENT.md` - Complete guide
- This file - Quick reference

## Quick Start

### Enable Auto-Population

In `docker-compose.local.yml` or your production compose file:

```yaml
cms:
  environment:
    AUTO_POPULATE_CONTENT: "true"
    STRAPI_API_URL: "http://localhost:1337"
    STRAPI_API_TOKEN: "your_token_here"
```

### Deploy

```bash
# Local development
docker-compose -f docker-compose.local.yml up --build

# Production
docker-compose up -d --build
```

### Watch Logs

```bash
docker logs -f taxibrousse-cms
```

You'll see:
```
Starting Strapi CMS...
Waiting for Strapi to be ready...
✅ Strapi is ready!
==========================================
Auto-populating CMS content...
==========================================
Populating page banners...
[1/5] Processing banner...
...
✅ Content population complete!
==========================================
```

## Population Scripts Executed

1. `content/page-banners/populate-all-banners.sh` - 5 banners
2. `content/populate-all-sections.sh` - Main sections
3. `content/populate-all-new-sections.sh` - 5 new sections
4. `content/populate-fokotanies.sh` - Location data
5. `content/dynamic-page/populate-dynamic-pages.sh` - Dynamic pages

## Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `AUTO_POPULATE_CONTENT` | `false` | Enable/disable auto-population |
| `STRAPI_API_URL` | `http://localhost:1337` | Strapi API endpoint |
| `STRAPI_API_TOKEN` | (required) | API authentication token |

## Disable Auto-Population

Set to `false` or remove the variable:

```yaml
AUTO_POPULATE_CONTENT: "false"
```

## Manual Population

If needed, run scripts manually inside container:

```bash
docker exec -it taxibrousse-cms sh
export STRAPI_API_TOKEN=your_token
sh /opt/app/content/page-banners/populate-all-banners.sh
```

## Testing

Successfully tested with local deployment:
- ✅ 5 banners populated (4 created, 1 updated)
- ✅ All locales (fr, en, mg) processed
- ✅ Idempotent (safe to run multiple times)

## Files Modified

```
cms/
├── Dockerfile                          # Added jq, bash, entrypoint
├── docker-entrypoint.sh               # NEW: Main entrypoint script
└── content/
    ├── AUTO-POPULATION-DEPLOYMENT.md  # NEW: Complete documentation
    └── page-banners/
        └── populate-all-banners.sh    # Made executable

docker-compose.local.yml               # Added environment variables
.env                                   # Added configuration options
.github/instructions/
└── DOCKER-AUTO-POPULATION.md         # NEW: This file
```

## Security Best Practices

1. Never commit API tokens to Git
2. Use environment variables or secrets management
3. Different tokens for dev/staging/production
4. Rotate tokens regularly
5. Limit token permissions

## Benefits

- **Zero Manual Work**: Content auto-populates on deployment
- **Consistency**: Same content across all environments
- **Version Control**: Content definitions in Git
- **Idempotent**: Safe to run multiple times
- **Fast**: Content ready immediately after startup

## Next Steps for Production

1. Generate production API token in Strapi admin
2. Store token in secrets manager (AWS Secrets Manager, etc.)
3. Configure production docker-compose or K8s deployment
4. Test in staging environment first
5. Deploy to production
6. Monitor logs for successful population

## Troubleshooting

### Population Not Running
- Check `AUTO_POPULATE_CONTENT=true` is set
- Verify `STRAPI_API_TOKEN` is provided
- Check container logs: `docker logs taxibrousse-cms`

### Scripts Not Found
- Ensure scripts are in `content/` directory
- Verify Dockerfile copies content directory
- Check file permissions (should be executable)

### API Errors
- Verify token is valid and not expired
- Check Strapi is healthy before population
- Ensure API endpoints exist in Strapi schema

## Related Documentation

- `cms/content/README-POPULATION.md` - Manual population guide
- `cms/content/AUTO-POPULATION-DEPLOYMENT.md` - Detailed deployment guide
- `cms/content/page-banners/populate-all-banners.sh` - Banner population script
