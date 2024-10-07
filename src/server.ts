import express from "express";
import fs from "fs";
import * as path from "path";
import swagger from "swagger-ui-express";
import yaml from "yaml";
import search from "./routes/api/search";
import summary from "./routes/api/summary";

// Read API spec file and parse the yaml
const filePath = path.resolve(__dirname, "openapi.yaml");
const file = fs.readFileSync(filePath, "utf8");
const apiSpecification = yaml.parse(file);

// Configure reading .env file
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

// Import cors module for enabling Cross-Origin Resource Sharing
const cors = require("cors");

// Create an Express application
const app = express();

app.use(cors()); // Enable CORS for all routes
app.set("host", process.env.HOST); // Set the host for the server
app.set("port", 443); // Set the port for the server to listen on
app.use(express.json()); // Parse JSON bodies in the request
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// Define a route for the API status
// @route   GET /
// @desc    Test the status of the API
// @access  Public
app.get("/", (_req, res) => {
  res.send({ status: "UP" }); // Send a simple response to confirm API is working
});

// Mount the API routes
app.use("/api/search", search);
app.use("/api/summarize", summary);

// Route for documentation
app.use("/docs", swagger.serve, swagger.setup(apiSpecification));

export default app;
