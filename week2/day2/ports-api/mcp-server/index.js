#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: join(__dirname, '../.env') });

// Initialize Prisma Client
const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Create MCP server
const server = new Server(
  {
    name: 'ports-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
const TOOLS = [
  {
    name: 'search_ports',
    description: 'Search and filter ports by country, status, port_role with pagination. Returns list of ports matching criteria.',
    inputSchema: {
      type: 'object',
      properties: {
        country: {
          type: 'string',
          description: 'Filter by country name (case-insensitive, partial match)',
        },
        status: {
          type: 'string',
          enum: ['active', 'passive'],
          description: 'Filter by port status',
        },
        port_role: {
          type: 'string',
          enum: ['ORIGIN', 'DESTINATION'],
          description: 'Filter by port role',
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          default: 1,
        },
        limit: {
          type: 'number',
          description: 'Number of results per page (default: 10, max: 100)',
          default: 10,
        },
      },
    },
  },
  {
    name: 'get_port_by_code',
    description: 'Get detailed information about a specific port by its UNLOCODE',
    inputSchema: {
      type: 'object',
      properties: {
        unlocode: {
          type: 'string',
          description: 'The UN/LOCODE of the port (e.g., USNYC, CNSHA)',
        },
      },
      required: ['unlocode'],
    },
  },
  {
    name: 'create_port',
    description: 'Create a new port entry in the database',
    inputSchema: {
      type: 'object',
      properties: {
        unlocode: {
          type: 'string',
          description: 'Unique UN/LOCODE identifier (5 characters)',
        },
        country: {
          type: 'string',
          description: 'Country name',
        },
        name: {
          type: 'string',
          description: 'Port name',
        },
        port_role: {
          type: 'string',
          enum: ['ORIGIN', 'DESTINATION'],
          description: 'Port role (default: DESTINATION)',
          default: 'DESTINATION',
        },
        status: {
          type: 'string',
          enum: ['active', 'passive'],
          description: 'Port status (default: active)',
          default: 'active',
        },
      },
      required: ['unlocode', 'country', 'name'],
    },
  },
  {
    name: 'update_port',
    description: 'Update an existing port. Only provided fields will be updated.',
    inputSchema: {
      type: 'object',
      properties: {
        unlocode: {
          type: 'string',
          description: 'UN/LOCODE of the port to update',
        },
        country: {
          type: 'string',
          description: 'New country name',
        },
        name: {
          type: 'string',
          description: 'New port name',
        },
        port_role: {
          type: 'string',
          enum: ['ORIGIN', 'DESTINATION'],
          description: 'New port role',
        },
        status: {
          type: 'string',
          enum: ['active', 'passive'],
          description: 'New port status',
        },
      },
      required: ['unlocode'],
    },
  },
  {
    name: 'delete_port',
    description: '⚠️ DESTRUCTIVE: Permanently delete a port from the database. This action cannot be undone!',
    inputSchema: {
      type: 'object',
      properties: {
        unlocode: {
          type: 'string',
          description: 'UN/LOCODE of the port to delete',
        },
        confirm: {
          type: 'boolean',
          description: 'Must be true to confirm deletion',
        },
      },
      required: ['unlocode', 'confirm'],
    },
  },
  {
    name: 'get_statistics',
    description: 'Get statistics about ports in the database (total count, by status, by role, top countries)',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_countries',
    description: 'Get a list of all countries that have ports in the database with port counts',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'search_ports': {
        const { country, status, port_role, page = 1, limit = 10 } = args;
        
        const where = {};
        if (country) {
          where.country = { contains: country, mode: 'insensitive' };
        }
        if (status) {
          where.status = status.toLowerCase();
        }
        if (port_role) {
          where.port_role = port_role.toUpperCase();
        }

        const skip = (page - 1) * Math.min(limit, 100);
        const take = Math.min(limit, 100);

        const [ports, total] = await prisma.$transaction([
          prisma.port.findMany({
            where,
            skip,
            take,
            orderBy: { unlocode: 'asc' },
          }),
          prisma.port.count({ where }),
        ]);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                ports,
                pagination: {
                  total,
                  page,
                  limit: take,
                  totalPages: Math.ceil(total / take),
                },
              }, null, 2),
            },
          ],
        };
      }

      case 'get_port_by_code': {
        const { unlocode } = args;
        
        const port = await prisma.port.findUnique({
          where: { unlocode: unlocode.toUpperCase() },
        });

        if (!port) {
          return {
            content: [
              {
                type: 'text',
                text: `Port with UNLOCODE "${unlocode}" not found.`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(port, null, 2),
            },
          ],
        };
      }

      case 'create_port': {
        const { unlocode, country, name, port_role = 'DESTINATION', status = 'active' } = args;

        try {
          const newPort = await prisma.port.create({
            data: {
              unlocode: unlocode.toUpperCase(),
              country,
              name,
              port_role: port_role.toUpperCase(),
              status: status.toLowerCase(),
            },
          });

          return {
            content: [
              {
                type: 'text',
                text: `✓ Successfully created port:\n${JSON.stringify(newPort, null, 2)}`,
              },
            ],
          };
        } catch (error) {
          if (error.code === 'P2002') {
            return {
              content: [
                {
                  type: 'text',
                  text: `Error: Port with UNLOCODE "${unlocode}" already exists.`,
                },
              ],
              isError: true,
            };
          }
          throw error;
        }
      }

      case 'update_port': {
        const { unlocode, ...updateData } = args;

        // Build update object with only provided fields
        const data = {};
        if (updateData.country) data.country = updateData.country;
        if (updateData.name) data.name = updateData.name;
        if (updateData.port_role) data.port_role = updateData.port_role.toUpperCase();
        if (updateData.status) data.status = updateData.status.toLowerCase();

        if (Object.keys(data).length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'No fields provided to update. Please specify at least one field to update.',
              },
            ],
            isError: true,
          };
        }

        try {
          const updatedPort = await prisma.port.update({
            where: { unlocode: unlocode.toUpperCase() },
            data,
          });

          return {
            content: [
              {
                type: 'text',
                text: `✓ Successfully updated port:\n${JSON.stringify(updatedPort, null, 2)}`,
              },
            ],
          };
        } catch (error) {
          if (error.code === 'P2025') {
            return {
              content: [
                {
                  type: 'text',
                  text: `Error: Port with UNLOCODE "${unlocode}" not found.`,
                },
              ],
              isError: true,
            };
          }
          throw error;
        }
      }

      case 'delete_port': {
        const { unlocode, confirm } = args;

        if (!confirm) {
          return {
            content: [
              {
                type: 'text',
                text: `⚠️ Deletion not confirmed. To delete port "${unlocode}", you must set confirm=true.\n\nThis action is PERMANENT and cannot be undone!`,
              },
            ],
            isError: true,
          };
        }

        try {
          const deletedPort = await prisma.port.delete({
            where: { unlocode: unlocode.toUpperCase() },
          });

          return {
            content: [
              {
                type: 'text',
                text: `✓ Successfully deleted port:\n${JSON.stringify(deletedPort, null, 2)}`,
              },
            ],
          };
        } catch (error) {
          if (error.code === 'P2025') {
            return {
              content: [
                {
                  type: 'text',
                  text: `Error: Port with UNLOCODE "${unlocode}" not found.`,
                },
              ],
              isError: true,
            };
          }
          throw error;
        }
      }

      case 'get_statistics': {
        const [total, byStatus, byRole, topCountries] = await prisma.$transaction([
          prisma.port.count(),
          prisma.port.groupBy({
            by: ['status'],
            _count: true,
          }),
          prisma.port.groupBy({
            by: ['port_role'],
            _count: true,
          }),
          prisma.port.groupBy({
            by: ['country'],
            _count: true,
            orderBy: { _count: { country: 'desc' } },
            take: 10,
          }),
        ]);

        const stats = {
          total,
          byStatus: byStatus.reduce((acc, s) => {
            acc[s.status] = s._count;
            return acc;
          }, {}),
          byRole: byRole.reduce((acc, r) => {
            acc[r.port_role] = r._count;
            return acc;
          }, {}),
          topCountries: topCountries.map(c => ({
            country: c.country,
            count: c._count,
          })),
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(stats, null, 2),
            },
          ],
        };
      }

      case 'list_countries': {
        const countries = await prisma.port.groupBy({
          by: ['country'],
          _count: true,
          orderBy: { country: 'asc' },
        });

        const result = countries.map(c => ({
          country: c.country,
          portCount: c._count,
        }));

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Ports MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
