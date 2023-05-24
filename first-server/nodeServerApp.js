/** No need to install any packages, neither have `package.json` */
const http = require('http');

const hostname = 'localhost';
const port = 4000;
/** Server listening at http://localhost:3000 */
// localhost = IP 127.0.0.1 (own computer)

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});