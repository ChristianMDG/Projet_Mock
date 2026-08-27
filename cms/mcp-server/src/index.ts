#!/usr/bin/env node
/**
 * Taxibrousse CMS MCP server
 * --------------------------------------------------------------
 * Exposes the Strapi REST API to MCP-compatible AI clients as a
 * small set of tools: list content types, CRUD entries, upload
 * media. Authentication uses an API token supplied via the
 * STRAPI_API_TOKEN env var. The Strapi base URL is read from
 * STRAPI_API_URL (default: http://localhost:1337/api).
 *
 * This module intentionally keeps secrets out of source code.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { z } from 'zod';

const STRAPI_API_URL =
    process.env.STRAPI_API_URL ??
    (process.env.STRAPI_URL ? `${process.env.STRAPI_URL.replace(/\/$/, '')}/api` : 'http://localhost:1337/api');
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN ?? '';

const hasToken = STRAPI_API_TOKEN.length > 0;

const http: AxiosInstance = axios.create({
    baseURL: STRAPI_API_URL,
    headers: hasToken
        ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` }
        : undefined,
    timeout: 30_000,
});

// ---- Input schemas ---------------------------------------------------------

const ListEntriesInput = z.object({
    contentType: z.string().describe('Plural API id, e.g. "products", "product-categories".'),
    locale: z.string().optional(),
    page: z.number().int().positive().optional(),
    pageSize: z.number().int().positive().max(100).optional(),
    populate: z.union([z.string(), z.array(z.string())]).optional(),
    filters: z.record(z.any()).optional(),
});

const GetEntryInput = z.object({
    contentType: z.string(),
    documentId: z.string(),
    locale: z.string().optional(),
    populate: z.union([z.string(), z.array(z.string())]).optional(),
});

const CreateEntryInput = z.object({
    contentType: z.string(),
    data: z.record(z.any()),
    locale: z.string().optional(),
});

const UpdateEntryInput = z.object({
    contentType: z.string(),
    documentId: z.string(),
    data: z.record(z.any()),
    locale: z.string().optional(),
});

const DeleteEntryInput = z.object({
    contentType: z.string(),
    documentId: z.string(),
    locale: z.string().optional(),
});

const UploadMediaInput = z.object({
    filePath: z.string().describe('Absolute path of the file to upload.'),
    fileName: z.string().optional(),
    ref: z.string().optional().describe('Target content type uid, e.g. "api::product.product".'),
    refId: z.union([z.string(), z.number()]).optional(),
    field: z.string().optional(),
});

// ---- Helpers ---------------------------------------------------------------

function requireToken(): void {
    if (hasToken) return;
    throw new Error(
        'STRAPI_API_TOKEN env var is required to perform authenticated Strapi operations.',
    );
}

function asJson(value: unknown): string {
    return JSON.stringify(value, null, 2);
}

function toolResult(value: unknown) {
    return {
        content: [
            {
                type: 'text' as const,
                text: typeof value === 'string' ? value : asJson(value),
            },
        ],
    };
}

function errorResult(error: unknown) {
    const message =
        axios.isAxiosError(error) && error.response
            ? `${error.response.status} ${error.response.statusText}\n${asJson(error.response.data)}`
            : error instanceof Error
                ? error.message
                : String(error);
    return {
        isError: true,
        content: [
            {
                type: 'text' as const,
                text: `Strapi MCP error: ${message}`,
            },
        ],
    };
}

// ---- Tool implementations --------------------------------------------------

async function listContentTypes() {
    requireToken();
    const { data } = await http.get('/content-type-builder/content-types');
    return toolResult(data);
}

async function listEntries(raw: unknown) {
    const input = ListEntriesInput.parse(raw);
    const params: Record<string, unknown> = {};
    if (input.locale) params.locale = input.locale;
    if (input.page) params['pagination[page]'] = input.page;
    if (input.pageSize) params['pagination[pageSize]'] = input.pageSize;
    if (input.populate) params.populate = input.populate;
    if (input.filters) {
        for (const [key, value] of Object.entries(input.filters)) {
            params[`filters[${key}]`] = value;
        }
    }
    const { data } = await http.get(`/${input.contentType}`, { params });
    return toolResult(data);
}

async function getEntry(raw: unknown) {
    const input = GetEntryInput.parse(raw);
    const params: Record<string, unknown> = {};
    if (input.locale) params.locale = input.locale;
    if (input.populate) params.populate = input.populate;
    const { data } = await http.get(`/${input.contentType}/${input.documentId}`, {
        params,
    });
    return toolResult(data);
}

async function createEntry(raw: unknown) {
    requireToken();
    const input = CreateEntryInput.parse(raw);
    const params = input.locale ? { locale: input.locale } : undefined;
    const { data } = await http.post(
        `/${input.contentType}`,
        { data: input.data },
        { params },
    );
    return toolResult(data);
}

async function updateEntry(raw: unknown) {
    requireToken();
    const input = UpdateEntryInput.parse(raw);
    const params = input.locale ? { locale: input.locale } : undefined;
    const { data } = await http.put(
        `/${input.contentType}/${input.documentId}`,
        { data: input.data },
        { params },
    );
    return toolResult(data);
}

async function deleteEntry(raw: unknown) {
    requireToken();
    const input = DeleteEntryInput.parse(raw);
    const params = input.locale ? { locale: input.locale } : undefined;
    const { data } = await http.delete(
        `/${input.contentType}/${input.documentId}`,
        { params },
    );
    return toolResult(data);
}

async function uploadMedia(raw: unknown) {
    requireToken();
    const input = UploadMediaInput.parse(raw);
    const form = new FormData();
    form.append('files', readFileSync(input.filePath), {
        filename: input.fileName ?? basename(input.filePath),
    });
    if (input.ref) form.append('ref', input.ref);
    if (input.refId !== undefined) form.append('refId', String(input.refId));
    if (input.field) form.append('field', input.field);
    const { data } = await http.post('/upload', form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
    });
    return toolResult(data);
}

// ---- MCP wiring ------------------------------------------------------------

const tools = [
    {
        name: 'strapi_list_content_types',
        description:
            'List all Strapi content types exposed by the CMS (collection + single types).',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
    {
        name: 'strapi_list_entries',
        description:
            'List entries of a given content type with optional filters, pagination, populate and locale.',
        inputSchema: {
            type: 'object',
            properties: {
                contentType: { type: 'string' },
                locale: { type: 'string' },
                page: { type: 'integer' },
                pageSize: { type: 'integer' },
                populate: {
                    oneOf: [
                        { type: 'string' },
                        { type: 'array', items: { type: 'string' } },
                    ],
                },
                filters: { type: 'object' },
            },
            required: ['contentType'],
            additionalProperties: false,
        },
    },
    {
        name: 'strapi_get_entry',
        description: 'Get a single entry by documentId.',
        inputSchema: {
            type: 'object',
            properties: {
                contentType: { type: 'string' },
                documentId: { type: 'string' },
                locale: { type: 'string' },
                populate: {
                    oneOf: [
                        { type: 'string' },
                        { type: 'array', items: { type: 'string' } },
                    ],
                },
            },
            required: ['contentType', 'documentId'],
            additionalProperties: false,
        },
    },
    {
        name: 'strapi_create_entry',
        description: 'Create an entry. Requires STRAPI_API_TOKEN with write scope.',
        inputSchema: {
            type: 'object',
            properties: {
                contentType: { type: 'string' },
                data: { type: 'object' },
                locale: { type: 'string' },
            },
            required: ['contentType', 'data'],
            additionalProperties: false,
        },
    },
    {
        name: 'strapi_update_entry',
        description: 'Update an entry by documentId. Requires STRAPI_API_TOKEN.',
        inputSchema: {
            type: 'object',
            properties: {
                contentType: { type: 'string' },
                documentId: { type: 'string' },
                data: { type: 'object' },
                locale: { type: 'string' },
            },
            required: ['contentType', 'documentId', 'data'],
            additionalProperties: false,
        },
    },
    {
        name: 'strapi_delete_entry',
        description: 'Delete an entry by documentId. Requires STRAPI_API_TOKEN.',
        inputSchema: {
            type: 'object',
            properties: {
                contentType: { type: 'string' },
                documentId: { type: 'string' },
                locale: { type: 'string' },
            },
            required: ['contentType', 'documentId'],
            additionalProperties: false,
        },
    },
    {
        name: 'strapi_upload_media',
        description:
            'Upload a local file to the Strapi media library (Cloudinary in this project). Requires STRAPI_API_TOKEN.',
        inputSchema: {
            type: 'object',
            properties: {
                filePath: { type: 'string' },
                fileName: { type: 'string' },
                ref: { type: 'string' },
                refId: { oneOf: [{ type: 'string' }, { type: 'number' }] },
                field: { type: 'string' },
            },
            required: ['filePath'],
            additionalProperties: false,
        },
    },
];

const server = new Server(
    { name: 'taxibrousse-cms-mcp-server', version: '0.1.0' },
    { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case 'strapi_list_content_types':
                return await listContentTypes();
            case 'strapi_list_entries':
                return await listEntries(args);
            case 'strapi_get_entry':
                return await getEntry(args);
            case 'strapi_create_entry':
                return await createEntry(args);
            case 'strapi_update_entry':
                return await updateEntry(args);
            case 'strapi_delete_entry':
                return await deleteEntry(args);
            case 'strapi_upload_media':
                return await uploadMedia(args);
            default:
                return errorResult(new Error(`Unknown tool: ${name}`));
        }
    } catch (error) {
        return errorResult(error);
    }
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    process.stderr.write(
        `[taxibrousse-cms-mcp] connected to Strapi at ${STRAPI_API_URL} (token: ${hasToken ? 'set' : 'missing'})\n`,
    );
}

main().catch((error) => {
    process.stderr.write(`[taxibrousse-cms-mcp] fatal: ${String(error)}\n`);
    process.exit(1);
});
