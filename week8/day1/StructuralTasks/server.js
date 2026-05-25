/**
 * Simple HTTP Server for UI Demo
 * Run with: node server.js
 * Then open: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Default to index.html
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  // Get file extension
  const ext = path.extname(filePath);

  // Set content type
  let contentType = 'text/html';
  if (ext === '.css') contentType = 'text/css';
  if (ext === '.js') contentType = 'text/javascript';
  if (ext === '.json') contentType = 'application/json';

  // Read and serve file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // File not found
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>404 - File Not Found</title>
          <style>
            body { font-family: Arial; text-align: center; padding: 50px; background: #f0f0f0; }
            h1 { color: #d32f2f; }
          </style>
        </head>
        <body>
          <h1>404 - File Not Found</h1>
          <p>Requested: ${req.url}</p>
          <a href="/">← Back to Home</a>
        </body>
        </html>
      `);
    } else {
      // File found
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  Structural Patterns UI Server              ║
╚════════════════════════════════════════════╝

✓ Server running on http://localhost:${PORT}

📖 Open your browser and go to:
   http://localhost:${PORT}

🎯 Demo:
   1. Try the Adapter - click "Get User" buttons
   2. Select a token and test operations
   3. See how Decorator blocks invalid tokens

Press Ctrl+C to stop the server
  `);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`✗ Port ${PORT} is already in use`);
    console.error('Try: node server.js (pick a different port)');
  } else {
    console.error('Server error:', err);
  }
});
