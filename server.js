#!/usr/bin/node
const PORT = process.env.PORT || 3000;
const FILENAME = "file.txt";
const {createServer} = require("http");
const fs = require("fs");
const path = require("path");
const get_date = require("./modules/util.js");

const mimeLookup = {
  '.js': 'application/javascript',
  '.html': 'text/html',
  '.css': 'text/css',
};

createServer((req, res) => {
  if (req.url?.includes("/COMP4537/labs/3/date")) {
    const searchParams = new URLSearchParams(req.url.split("?")[1]);
    const name = searchParams.get("name") ?? "stranger"
    res.writeHead(200, {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "s-max-age=1, stale-while-revalidate",
    });
    res.end(
      `<h2 style="color: blue">Hello ${name.toUpperCase()},
      What a beautiful day. Server current date and time is ${get_date()}</h2>`
    );
  } else if (req.url?.includes("/COMP4537/labs/3/writeFile")) {
    const searchParams = new URLSearchParams(req.url.split("?")[1]);
    const text = searchParams.get("text");
    if (!text) res.end("Add new text by writing ?text=yourtexthere at the end of the address");
    fs.appendFileSync(FILENAME, text, 'utf8');
    res.writeHead(200, {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "s-max-age=1, stale-while-revalidate",
    });
    res.end(`<h1>"${text}" appended.<h1>`);
  } else if (req.url?.includes("/COMP4537/labs/3/readFile")) {
    const filename = req.url.split("/").at(-1);
    fs.readFile(filename,(err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text" });
        res.end(`file: ${filename} is invalid`);
      }
      res.writeHead(200, {
        "Content-Type": "text; charset=UTF-8",
        "Cache-Control": "s-max-age=1, stale-while-revalidate",
      });
      res.end(data);
    });
  } else {
    let filepath = path.join(__dirname + req.url);
    const stream = fs.createReadStream(filepath);
    stream.on('error', () => {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(`<h1 style="color: red">ERROR 404:</h1></br></br></br><h2>please go to /COMP4537/labs/3/date</h2>`);
    });
    let mimeType = mimeLookup[path.extname(filepath)];
    res.writeHead(200, {'Content-Type': mimeType});
    stream.pipe(res);
  }
}).listen(PORT);
