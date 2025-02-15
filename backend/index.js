const express = require("express");
const rootRouter = require("./routes/index");
const cors = require("cors");
const app = express();
const serveHandler = require("serve-handler");
const path = require("path");

app.use(cors());
app.use(express.json());
app.use("/api/v1", rootRouter);
app.use((req, res) => {
  return serveHandler(req, res, {
    public: path.join(__dirname, "../frontend/dist"),
  });
});

app.listen(3000);
