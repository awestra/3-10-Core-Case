import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);

function send(response, status, body, type = "application/json; charset=utf-8") {
  response.writeHead(status, { "Content-Type": type });
  response.end(type.startsWith("application/json") ? JSON.stringify(body) : body);
}

createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
    try {
      return send(response, 200, await readFile(join(root, "index.html")), "text/html; charset=utf-8");
    } catch {
      return send(response, 500, { error: "Could not load the website." });
    }
  }
  return send(response, 404, { error: "Not found." });
}).listen(port, () => {
  console.log(`Career Launchpad running at http://localhost:${port}`);
});
