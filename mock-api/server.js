import express from "express";
import "dotenv/config";

const app = express();

app.get("/", (req, res) => {
  res.send("Server is ready");
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
