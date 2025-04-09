const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const router = require("./src/routes");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(morgan("dev"));

mongoose.set("debug", true);

mongoose.set("debug", function (coll, method, query, doc, options) {
  console.log(`Mongoose ${method} on ${coll}: ${JSON.stringify(query)}`);
});

mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Failed to connect to MongoDB", err));

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
