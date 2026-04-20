# Troubleshooting Claude Desktop MCP Connection

## Issue: "No servers added" after restart

Your config file is correct, but Claude Desktop may need manual configuration through the UI.

## Solution Steps

### Option 1: Use the "Edit Config" Button (Recommended)

1. In Claude Desktop, go to **Settings** (gear icon)
2. Click **Developer** in the left sidebar
3. Under "Local MCP servers", click **Edit Config** button
4. This will open the config file in your default text editor
5. Paste this configuration:

```json
{
  "mcpServers": {
    "ports-api": {
      "command": "node",
      "args": [
        "C:\\Users\\Admin\\Documents\\P99SoftTraining\\week2\\day2\\ports-api\\mcp-server\\index.js"
      ],
      "autoApprove": [
        "search_ports",
        "get_port_by_code",
        "get_statistics",
        "list_countries",
        "create_port",
        "update_port",
        "delete_port"
      ]
    }
  }
}
```

6. Save the file
7. Restart Claude Desktop completely

### Option 2: Manual File Edit

The config file is already updated at:
```
C:\Users\Admin\AppData\Roaming\Claude\claude_desktop_config.json
```

But Claude Desktop might not be reading it. Try:

1. Close Claude Desktop completely
2. Delete the config file
3. Restart Claude Desktop
4. Click "Edit Config" button
5. Paste the configuration above
6. Save and restart

### Option 3: Check Claude Desktop Version

Claude Desktop may have changed how MCP servers are configured. Check:

1. Go to Settings → General
2. Check your Claude Desktop version
3. If it's a very new version, MCP configuration might have moved

### Option 4: Use Environment Variable for Node

Some versions of Claude Desktop need the full path to node.exe:

1. Find your Node.js installation:
```powershell
where.exe node
```

2. Update the config to use the full path:
```json
{
  "mcpServers": {
    "ports-api": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": [
        "C:\\Users\\Admin\\Documents\\P99SoftTraining\\week2\\day2\\ports-api\\mcp-server\\index.js"
      ],
      "autoApprove": [
        "search_ports",
        "get_port_by_code",
        "get_statistics",
        "list_countries",
        "create_port",
        "update_port",
        "delete_port"
      ]
    }
  }
}
```

## Verification Steps

After making changes:

1. **Restart Claude Desktop completely**
   - Close all windows
   - Check system tray for Claude icon and close it
   - Reopen Claude Desktop

2. **Check Developer Settings**
   - Go to Settings → Developer
   - You should see "ports-api" listed under "Local MCP servers"
   - Status should show as "Connected" or "Running"

3. **Test in Chat**
   - Look for 🔌 icon in the chat interface
   - Ask: "What tools do you have access to?"
   - Claude should list the 7 ports-api tools

## Alternative: Test MCP Server Directly

To verify the MCP server works independently:

```powershell
cd C:\Users\Admin\Documents\P99SoftTraining\week2\day2\ports-api
node mcp-server/index.js
```

You should see: "Ports MCP Server running on stdio"

This confirms the server itself is working - the issue is just the Claude Desktop connection.

## Common Issues

### Issue: Node not found
**Solution:** Add Node.js to your PATH or use full path to node.exe in config

### Issue: Config file not being read
**Solution:** Use the "Edit Config" button in Claude Desktop UI instead of manually editing

### Issue: Server starts but no tools appear
**Solution:** Check that autoApprove array includes all tool names exactly as defined in the server

### Issue: Permission errors
**Solution:** Run Claude Desktop as administrator (right-click → Run as administrator)

## Current Status

✅ Config file exists and is valid
✅ MCP server runs successfully
✅ Node.js is installed and accessible
✅ Database connection works (335 ports)
❌ Claude Desktop not detecting the server

**Next Step:** Use the "Edit Config" button in Claude Desktop UI to ensure it reads the configuration.

## Need More Help?

If none of these work, check:
1. Claude Desktop version (Help → About)
2. Claude Desktop logs (if available)
3. Try creating a simpler test MCP server to isolate the issue
