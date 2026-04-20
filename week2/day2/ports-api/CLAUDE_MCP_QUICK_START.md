# Claude Desktop MCP - Quick Start Guide

## ✅ Setup Complete!

Your MCP server is fully configured and ready to use with Claude Desktop.
    
## What's Configured

### 7 Tools with Full CRUD Access (All Auto-Approved)

**Read Operations:**
- `search_ports` - Search and filter ports by country, status, role
- `get_port_by_code` - Get specific port by UNLOCODE
- `get_statistics` - Database statistics (total, by status, by role, top countries)
- `list_countries` - List all countries with port counts

**Write Operations:**
- `create_port` - Create new port entries
- `update_port` - Update existing ports
- `delete_port` - Delete ports (requires confirm=true)

### Configuration Files

✅ **Claude Desktop:** `C:\Users\Admin\AppData\Roaming\Claude\claude_desktop_config.json`
✅ **Kiro:** `.kiro/settings/mcp.json`

Both configs have `autoApprove` enabled for all 7 tools = no manual approval needed!

## How to Use

### Step 1: Restart Claude Desktop

**IMPORTANT:** You MUST completely close and restart Claude Desktop for the MCP configuration to take effect.

1. Close Claude Desktop completely (check system tray)
2. Reopen Claude Desktop
3. Look for the 🔌 icon in the chat interface

### Step 2: Verify Tools Are Available

In Claude Desktop, ask:
```
"What tools do you have access to?"
```

Claude should list all 7 ports-api tools.

### Step 3: Start Using!

Try these example queries:

**Search Ports:**
```
"Show me all active ports in China"
"Find ports in USA with role ORIGIN"
"List the first 20 ports"
```

**Get Specific Port:**
```
"Get details for port USNYC"
"Show me information about CNSHA"
```

**Create New Port:**
```
"Create a new port: TESTPT in USA named Test Port"
"Add a port with code MYPORT in India called My Port with role ORIGIN"
```

**Update Port:**
```
"Update port TESTPT status to passive"
"Change MYPORT role to DESTINATION"
```

**Delete Port:**
```
"Delete port TESTPT"
```
(Claude will automatically set confirm=true)

**Statistics:**
```
"Show me database statistics"
"How many ports are in the database?"
"What are the top countries by port count?"
```

**List Countries:**
```
"List all countries with ports"
"Show me countries and their port counts"
```

## Architecture

```
Claude Desktop (Chat Interface)
    ↓
MCP Protocol (stdio)
    ↓
MCP Server (mcp-server/index.js)
    ↓
Prisma Client
    ↓
PostgreSQL Database (p99db)
    ↓
335 Ports
```

## Important Notes

1. **No Express API needed** - MCP server connects directly to PostgreSQL
2. **All tools auto-approved** - No manual confirmation required
3. **Delete requires confirm=true** - Safety feature to prevent accidents
4. **Database is shared** - Express API and MCP use the same database

## Troubleshooting

### MCP Tools Not Showing

1. Restart Claude Desktop completely
2. Check for 🔌 icon in chat
3. Ask "What tools do you have?"

### Connection Errors

1. Ensure PostgreSQL is running
2. Check `.env` file has correct DATABASE_URL
3. Test: `node mcp-server/index.js` (should show "Ports MCP Server running")

### Tool Execution Errors

- Check error message from Claude
- Verify required parameters (e.g., unlocode for get_port_by_code)
- Check database constraints (unique unlocode)

## Testing Right Now

After restarting Claude Desktop, try this:

```
"Search for ports in China and show me the first 5 results"
```

Claude should automatically use the `search_ports` tool and return results!

## Current Database

- **Total Ports:** 335
- **Source:** 96 from ports.json + 239 from dataset.json
- **All unique UNLOCODEs**

---

**Ready to use! Just restart Claude Desktop and start chatting!** 🚀
