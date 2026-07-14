const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const groupRoutes = require("./routes/group-routes");
const memberRoutes = require("./routes/member-routes")
const errorMiddleware = require("./middleware/error-middleware")
const permissionJSON = require("./constants/permission.json")
// Node.js is like the Java Virtual Machine (JVM) + Runtime Environment, running psvm
// while Express.js is like the Spring Boot framework. Handles REST endpoints, running web server application
const app = express();

// Set security HTTP headers
app.use(helmet());
// Enable CORS with default settings (Allows all origins)
app.use(cors());

// Extracts the JSON payload from the raw request stream, parses it,
// and populates it directly into the req.body object
app.use(express.json());
// parse URL-encoded payloads, attaches that parsed object to req.body
app.use(express.urlencoded({ extended: true }));

// HTTP request logger middleware for Node.js. 
// It automatically tracks, formats, and logs details about every 
// incoming HTTP request directly into your server console or log files
app.use(morgan("combined"));

// Endpoint using Node.js + Express.js
app.get("/api/health", (req, res) => {
    res.json({
        service: "SplitWise Service",
        status: "UP"
    });
});

// Endpoint using Pure Node.js
const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === "/api/health" && req.method === 'GET') {
        res.writeHead(200, {
            'content-type': 'application/json'
        });
        res.end(JSON.stringify({
            service: "SplitWise Service Native",
            status: "UP"
        }));
    }else{
        res.writeHead(404);
        res.end();
    }
});
//

app.use("/api/groups", groupRoutes);
app.use("/api/groups/:groupId/members", memberRoutes);
app.get("/api/permissions", (req, res) => {
    res.json(permissionJSON);
});

app.use(errorMiddleware);

module.exports = { app, server };
