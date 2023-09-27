#!/usr/bin/node
const PORT = process.env.PORT || 3000;
const http = require("http");

const get_today = () => {
  const today = new Date(Date.now());
  return today.toString();
};

http
  .createServer((req, res) => {
    if (req.url === "/COMP4537/labs/3/date") {
      res.writeHead(200, {
        "Content-Type": "text/html; charset=UTF-8",
        "Cache-Control": "s-max-age=1, stale-while-revalidate",
      });
      res.end(
        `<h2 style="color: blue">Hello, the time right now is ${get_today()}</h2>`
      );
    } else if (!req.url.includes("/COMP4537/labs/1")) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h2>Error!</h2>");
    }
  })
  .listen(PORT);
