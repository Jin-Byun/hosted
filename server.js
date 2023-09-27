#!/usr/bin/node
const PORT = process.env.PORT || 3000;
const http = require("http");
const fs = require("fs");

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
    } else if ("/COMP4537/labs/1/index.html/".includes(req.url)) {
    } else {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(`<h2>${process.cwd()}</h2>`);
    }
  })
  .listen(PORT);
