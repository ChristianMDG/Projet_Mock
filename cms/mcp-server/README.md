# Taxibrousse CMS MCP Server

Small MCP (Model Context Protocol) server that exposes the Taxibrousse Strapi
CMS over stdio to MCP-compatible AI clients (Claude Desktop, VS Code Copilot,
Kiro, etc.).

## Exposed tools

| Tool                          | Description                                       |
| ----------------------------- | ------------------------------------------------- |
| `strapi_list_content_types`   | List all Strapi content types.                    |
| `strapi_list_entries`         | List entries of a content type (filters, i18n).   |
| `strapi_get_entry`            | Get an entry by `documentId`.                     |
| `strapi_create_entry`         | Create an entry (requires write token).           |
| `strapi_update_entry`         | Update an entry by `documentId`.                  |
| `strapi_delete_entry`         | Delete an entry by `documentId`.                  |
| `strapi_upload_media`         | Upload a local file to Cloudinary via Strapi.     |

## Environment variables

No secret is hardcoded. The following env vars are read at runtime:

| Variable            | Default                         | Purpose                               |
| ------------------- | ------------------------------- | ------------------------------------- |
| `STRAPI_API_URL`    | `http://localhost:1337/api`     | Base URL of the Strapi REST API.      |
| `STRAPI_API_TOKEN`  | _(empty)_                       | Bearer token for authenticated calls. |

Create a Strapi API token from **Settings → API Tokens** in the Strapi admin
panel, then export it locally:

```bash
export STRAPI_API_URL="http://localhost:1337/api"
export STRAPI_API_TOKEN="paste-your-token-here"
```

The repository ships a `cms/mcp-server/.env` file you can use for local
development. Do not commit real tokens.

## Install & build

```bash
cd cms/mcp-server
npm install
npm run build
```

## Run

After build:

```bash
npm start
```

For development with automatic TypeScript execution:

```bash
npm run dev
```

The server uses stdio transport and is intended to be launched by an MCP
client. Example `.kiro/settings/mcp.json` entry:

```json
{
  "mcpServers": {
    "taxibrousse-cms": {
      "command": "node",
      "args": ["./cms/mcp-server/dist/index.js"],
      "env": {
        "STRAPI_API_URL": "http://localhost:1337/api",
        "STRAPI_API_TOKEN": "${env:STRAPI_API_TOKEN}"
      }
    }
  }
}
```
