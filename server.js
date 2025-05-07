const { createServer } = require('node:http');
const { readFile } = require('node:fs');
const { join, extname } = require('node:path');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
  let filePath = '';
  let contentType = 'text/html';

  // Serve the index.html file for the root path
  if (req.url === '/app/' || req.url === '/app') {
    filePath = join(__dirname, 'index.html');
  } else if (req.url.startsWith('/app/')) {
    // Serve files from the /app directory
    const subPath = req.url.replace('/app/', '');
    filePath = join(__dirname, 'app', subPath);
  } else {
    // If the request does not match, return 404
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
    return;
  }

  // Determine the content type based on the file extension
  const ext = extname(filePath);
  switch (ext) {
    case '.html':
      contentType = 'text/html';
      break;
    case '.js':
      contentType = 'application/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    default:
      contentType = 'application/octet-stream';
  }

  // Read and serve the file
  readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(data);
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/app`);
});