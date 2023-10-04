const express = require("express");
const zlib = require("zlib");
const fs = require("fs");
const http = require("http");

const endpoint = "/metro";
const app = express();
const router = express.Router();

app.use(endpoint, router);

router.get("/", (_, res) => {
  res.send("Hello World!");
});

router.get("/:key", (req, res) => {
  const key = req.params.key;
  console.log("get?", key);
  try {
    const data = fs.readFileSync(`./cache/${key}`);
    const compressed = zlib.gzipSync(data);
    res.send(compressed);
  } catch (e) {
    res.status(404).send({ error: "not found" });
  }
});

router.put("/:key", (req, res) => {
  let chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", () => {
    try {
      const key = req.params.key;
      console.log("put?", key);
      // Decompress the incoming data
      const compressedData = Buffer.concat(chunks);
      const data = zlib.gunzipSync(compressedData);
      // Do something to store the cache artifact here. The below code assumes it's a file on the server
      fs.writeFileSync(`./cache/${key}`, data);
      res.send({ status: "ok" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ status: "error", message: err.message });
    }
  });
});

const server = http.createServer(app);
server.timeout = 5000;
server.listen(8989, () => console.log("HTTP Server running on port 8989"));
