# How to Use Ports API with Claude Desktop (MCP)

## ✅ Setup Complete!

Your MCP server is now working and connected to Claude Desktop!

## What You Can Do

You can now chat with Claude Desktop and it will automatically use your Ports API database to:
- Search and filter ports
- Get port details
- Create new ports
- Update existing ports
- Delete ports
- Get statistics
- List countries

## Example Queries

### Search Ports

**You ask:**
```
"Show me all active ports in China"
"Find ports in USA"
"List the first 20 ports"
"Show me all ORIGIN ports"
```

**Claude will:**
- Use the `search_ports` tool
- Query your PostgreSQL database
- Return matching ports with details

---

### Get Specific Port

**You ask:**
```
"Get details for port USNYC"
"Show me information about CNSHA"
"What is port INMAA?"
```

**Claude will:**
- Use the `get_port_by_code` tool
- Look up the port by UNLOCODE
- Return full port details

---

### Create New Port

**You ask:**
```
"Create a new port with code TESTPT in USA named Test Port"
"Add a port: MYPORT in India called My Port with role ORIGIN"
"Create port NEWPRT in Canada named New Port"
```

**Claude will:**
- Use the `create_port` tool
- Add the port to your database
- Confirm creation with details

---

### Update Port

**You ask:**
```
"Update port TESTPT status to passive"
"Change MYPORT role to DESTINATION"
"Update port NEWPRT name to Updated Port"
```

**Claude will:**
- Use the `update_port` tool
- Modify the port in your database
- Confirm the update

---

### Delete Port

**You ask:**
```
"Delete port TESTPT"
"Remove port MYPORT from the database"
```

**Claude will:**
- Use the `delete_port` tool
- Ask for confirmation (safety feature)
- Delete the port permanently

---

### Get Statistics

**You ask:**
```
"Show me database statistics"
"How many ports are in the database?"
"What are the top countries by port count?"
"Show me ports by status and role"
```

**Claude will:**
- Use the `get_statistics` tool
- Return total count, breakdown by status/role
- Show top 10 countries

---

### List Countries

**You ask:**
```
"List all countries with ports"
"Show me countries and their port counts"
"Which countries have ports in the database?"
```

**Claude will:**
- Use the `list_countries` tool
- Return all countries with port counts
- Sorted alphabetically

---

## Current Database

- **Total Ports:** 335
- **Database:** PostgreSQL (p99db)
- **Source:** 96 from ports.json + 239 from dataset.json
- **All UNLOCODEs are unique**

## Available Tools

| Tool | What It Does |
|------|--------------|
| `search_ports` | Search/filter ports by country, status, role with pagination |
| `get_port_by_code` | Get specific port by UNLOCODE |
| `create_port` | Add new port to database |
| `update_port` | Modify existing port |
| `delete_port` | Remove port (requires confirmation) |
| `get_statistics` | Get database stats (total, by status, by role, top countries) |
| `list_countries` | List all countries with port counts |

## Tips

1. **Be natural** - Just ask questions like you would to a person
2. **Claude decides** - Claude will automatically choose the right tool
3. **No syntax needed** - You don't need to know the tool names or parameters
4. **Conversational** - You can have back-and-forth conversations about the data
5. **Complex queries** - Claude can combine multiple tool calls to answer complex questions

## Example Conversations

### Example 1: Exploring Data

**You:** "How many ports do we have?"

**Claude:** Uses `get_statistics` → "You have 335 ports in total..."

**You:** "Which country has the most?"

**Claude:** Already has the data → "China has the most with X ports..."

**You:** "Show me 5 ports from China"

**Claude:** Uses `search_ports` with country filter → Returns 5 Chinese ports

---

### Example 2: Managing Ports

**You:** "I need to add a new port in Singapore called Marina Bay Port with code SGMBY"

**Claude:** Uses `create_port` → Creates the port and confirms

**You:** "Actually, change the status to passive"

**Claude:** Uses `update_port` → Updates status and confirms

**You:** "Never mind, delete it"

**Claude:** Uses `delete_port` → Asks for confirmation, then deletes

---

### Example 3: Analysis

**You:** "Compare the number of active vs passive ports"

**Claude:** Uses `get_statistics` → Shows breakdown

**You:** "Which countries have only 1 port?"

**Claude:** Uses `list_countries` → Filters and shows countries with count = 1

**You:** "Show me those ports"

**Claude:** Uses `search_ports` for each country → Returns the ports

---

## Architecture

```
You (Chat with Claude Desktop)
    ↓
Claude Desktop (Understands your request)
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

1. **No Express API needed** - MCP connects directly to PostgreSQL
2. **Real-time data** - Changes are immediate in the database
3. **Safe deletes** - Delete operations require confirmation
4. **Automatic tool selection** - Claude picks the right tool for your question
5. **Natural language** - No need to learn commands or syntax

## Configuration Files

- **Claude Desktop Config:** `C:\Users\Admin\AppData\Roaming\Claude\claude_desktop_config.json`
- **MCP Server:** `mcp-server/index.js`
- **Database Config:** `.env` (DATABASE_URL)
- **Kiro Config:** `.kiro/settings/mcp.json`

## Troubleshooting

### Tools Not Working

1. Check Settings → Developer in Claude Desktop
2. Verify "ports-api" is listed and connected
3. Restart Claude Desktop if needed

### Database Errors

1. Ensure PostgreSQL is running
2. Check `.env` has correct DATABASE_URL
3. Test: `node mcp-server/index.js` (should show "Ports MCP Server running")

### Wrong Results

1. Check your question is clear
2. Claude might need more context
3. You can ask Claude to explain which tool it used

---

## Start Using Now!

Just open Claude Desktop and start asking questions about your ports!

Try: **"How many ports are in the database?"**

🚀 Enjoy your AI-powered Ports API!
