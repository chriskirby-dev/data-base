const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const JSONManager = require("./managers/jsonManager");
const SQLiteManager = require("./managers/sqliteManager");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));

// File upload configuration
const upload = multer({ dest: "uploads/" });

// Initialize managers
const jsonManager = new JSONManager();
const sqliteManager = new SQLiteManager();

// ==================== JSON ENDPOINTS ====================

// List all JSON files
app.get("/api/json/list", (req, res) => {
    try {
        const files = jsonManager.listFiles();
        res.json({ success: true, files });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new JSON file
app.post("/api/json/create", (req, res) => {
    try {
        const { filename, data } = req.body;
        const result = jsonManager.create(filename, data || []);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Read JSON file
app.get("/api/json/read/:filename", (req, res) => {
    try {
        const data = jsonManager.read(req.params.filename);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update JSON file
app.put("/api/json/update/:filename", (req, res) => {
    try {
        const result = jsonManager.update(req.params.filename, req.body.data);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete JSON file
app.delete("/api/json/delete/:filename", (req, res) => {
    try {
        const result = jsonManager.delete(req.params.filename);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Insert record into JSON array
app.post("/api/json/record/:filename", (req, res) => {
    try {
        const result = jsonManager.insertRecord(req.params.filename, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update specific record
app.put("/api/json/record/:filename/:index", (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const result = jsonManager.updateRecord(req.params.filename, index, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete specific record
app.delete("/api/json/record/:filename/:index", (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const result = jsonManager.deleteRecord(req.params.filename, index);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Add property to all records
app.post("/api/json/property/add/:filename", (req, res) => {
    try {
        const { propertyName, defaultValue } = req.body;
        const result = jsonManager.addProperty(req.params.filename, propertyName, defaultValue);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Remove property from all records
app.delete("/api/json/property/remove/:filename", (req, res) => {
    try {
        const { propertyName } = req.body;
        const result = jsonManager.removeProperty(req.params.filename, propertyName);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Rename property in all records
app.put("/api/json/property/rename/:filename", (req, res) => {
    try {
        const { oldName, newName } = req.body;
        const result = jsonManager.renameProperty(req.params.filename, oldName, newName);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Import JSON
app.post("/api/json/import", (req, res) => {
    try {
        const { filename, data } = req.body;
        const result = jsonManager.import(filename, data);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Export JSON
app.get("/api/json/export/:filename", (req, res) => {
    try {
        const data = jsonManager.export(req.params.filename);
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename=${req.params.filename}.json`);
        res.send(data);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== SQLITE ENDPOINTS ====================

// List all databases
app.get("/api/sqlite/databases", (req, res) => {
    try {
        const databases = sqliteManager.listDatabases();
        res.json({ success: true, databases });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create database
app.post("/api/sqlite/database", async (req, res) => {
    try {
        const { dbName } = req.body;
        const result = await sqliteManager.createDatabase(dbName);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Import database from file
app.post("/api/sqlite/import", async (req, res) => {
    try {
        const { dbName, data } = req.body;
        const result = await sqliteManager.importDatabase(dbName, data);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete database
app.delete("/api/sqlite/database/:dbName", (req, res) => {
    try {
        const result = sqliteManager.deleteDatabase(req.params.dbName);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// List tables in database
app.get("/api/sqlite/tables/:dbName", async (req, res) => {
    try {
        const tables = await sqliteManager.listTables(req.params.dbName);
        res.json({ success: true, tables });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create table
app.post("/api/sqlite/table/:dbName", async (req, res) => {
    try {
        const { tableName, columns } = req.body;
        const result = await sqliteManager.createTable(req.params.dbName, tableName, columns);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Drop table
app.delete("/api/sqlite/table/:dbName/:tableName", async (req, res) => {
    try {
        const result = await sqliteManager.dropTable(req.params.dbName, req.params.tableName);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get table schema
app.get("/api/sqlite/schema/:dbName/:tableName", async (req, res) => {
    try {
        const schema = await sqliteManager.getTableSchema(req.params.dbName, req.params.tableName);
        res.json({ success: true, schema });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Insert record
app.post("/api/sqlite/record/:dbName/:tableName", async (req, res) => {
    try {
        const result = await sqliteManager.insertRecord(req.params.dbName, req.params.tableName, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Select records
app.get("/api/sqlite/records/:dbName/:tableName", async (req, res) => {
    try {
        const { where, limit } = req.query;
        const records = await sqliteManager.selectRecords(
            req.params.dbName,
            req.params.tableName,
            where,
            limit ? parseInt(limit) : null
        );
        res.json({ success: true, records });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update records
app.put("/api/sqlite/records/:dbName/:tableName", async (req, res) => {
    try {
        const { updates, where } = req.body;
        const result = await sqliteManager.updateRecord(req.params.dbName, req.params.tableName, updates, where);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete records
app.delete("/api/sqlite/records/:dbName/:tableName", async (req, res) => {
    try {
        const { where } = req.body;
        const result = await sqliteManager.deleteRecord(req.params.dbName, req.params.tableName, where);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Add column
app.post("/api/sqlite/column/:dbName/:tableName", async (req, res) => {
    try {
        const { columnName, columnType, defaultValue } = req.body;
        const result = await sqliteManager.addColumn(
            req.params.dbName,
            req.params.tableName,
            columnName,
            columnType,
            defaultValue
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Execute custom SQL query
app.post("/api/sqlite/query/:dbName", async (req, res) => {
    try {
        const { sql, params } = req.body;
        const result = await sqliteManager.executeQuery(req.params.dbName, sql, params);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve main page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API Documentation endpoint
app.get("/api", (req, res) => {
    res.json({
        title: "Data Manager REST API",
        version: "1.0.0",
        description: "REST API for managing JSON files and SQLite databases",
        baseUrl: `http://localhost:${PORT}/api`,
        endpoints: {
            json: {
                "GET /api/json/list": {
                    description: "List all JSON files",
                    response: { success: true, files: ["file1", "file2"] }
                },
                "POST /api/json/create": {
                    description: "Create a new JSON file",
                    body: { filename: "string", data: "array" },
                    response: { success: true, message: "File created" }
                },
                "GET /api/json/read/:filename": {
                    description: "Read a JSON file",
                    response: { success: true, data: [] }
                },
                "PUT /api/json/update/:filename": {
                    description: "Update entire JSON file",
                    body: { data: "array" },
                    response: { success: true, message: "File updated" }
                },
                "DELETE /api/json/delete/:filename": {
                    description: "Delete a JSON file",
                    response: { success: true, message: "File deleted" }
                },
                "POST /api/json/record/:filename": {
                    description: "Insert a record into JSON array",
                    body: { key: "value" },
                    response: { success: true, message: "Record inserted" }
                },
                "PUT /api/json/record/:filename/:index": {
                    description: "Update specific record by index",
                    body: { key: "value" },
                    response: { success: true, message: "Record updated" }
                },
                "DELETE /api/json/record/:filename/:index": {
                    description: "Delete specific record by index",
                    response: { success: true, message: "Record deleted" }
                },
                "POST /api/json/property/add/:filename": {
                    description: "Add a property to all records",
                    body: { propertyName: "string", defaultValue: "any" },
                    response: { success: true, message: "Property added" }
                },
                "DELETE /api/json/property/remove/:filename": {
                    description: "Remove a property from all records",
                    body: { propertyName: "string" },
                    response: { success: true, message: "Property removed" }
                },
                "PUT /api/json/property/rename/:filename": {
                    description: "Rename a property in all records",
                    body: { oldName: "string", newName: "string" },
                    response: { success: true, message: "Property renamed" }
                },
                "POST /api/json/import": {
                    description: "Import JSON data from text",
                    body: { filename: "string", data: "string" },
                    response: { success: true, message: "Data imported" }
                },
                "GET /api/json/export/:filename": {
                    description: "Export JSON file as download",
                    response: "JSON file download"
                }
            },
            sqlite: {
                "GET /api/sqlite/databases": {
                    description: "List all SQLite databases",
                    response: { success: true, databases: ["db1", "db2"] }
                },
                "POST /api/sqlite/database": {
                    description: "Create a new database",
                    body: { dbName: "string" },
                    response: { success: true, message: "Database created" }
                },
                "POST /api/sqlite/import": {
                    description: "Import database from base64",
                    body: { dbName: "string", data: "base64string" },
                    response: { success: true, message: "Database imported" }
                },
                "DELETE /api/sqlite/database/:dbName": {
                    description: "Delete a database",
                    response: { success: true, message: "Database deleted" }
                },
                "GET /api/sqlite/tables/:dbName": {
                    description: "List all tables in a database",
                    response: { success: true, tables: ["table1", "table2"] }
                },
                "POST /api/sqlite/table/:dbName": {
                    description: "Create a new table",
                    body: {
                        tableName: "string",
                        columns: [
                            {
                                name: "string",
                                type: "INTEGER|TEXT|REAL|BLOB",
                                primaryKey: "boolean",
                                autoIncrement: "boolean",
                                notNull: "boolean",
                                unique: "boolean",
                                default: "any"
                            }
                        ]
                    },
                    response: { success: true, message: "Table created" }
                },
                "DELETE /api/sqlite/table/:dbName/:tableName": {
                    description: "Drop a table",
                    response: { success: true, message: "Table dropped" }
                },
                "GET /api/sqlite/schema/:dbName/:tableName": {
                    description: "Get table schema/structure",
                    response: { success: true, schema: [] }
                },
                "POST /api/sqlite/record/:dbName/:tableName": {
                    description: "Insert a record into table",
                    body: { column: "value" },
                    response: { success: true, message: "Record inserted" }
                },
                "GET /api/sqlite/records/:dbName/:tableName": {
                    description: "Select records from table",
                    query: { where: "id=1", limit: "10" },
                    response: { success: true, records: [] }
                },
                "PUT /api/sqlite/records/:dbName/:tableName": {
                    description: "Update records in table",
                    body: { updates: { column: "value" }, where: "id=1" },
                    response: { success: true, message: "Records updated" }
                },
                "DELETE /api/sqlite/records/:dbName/:tableName": {
                    description: "Delete records from table",
                    body: { where: "id=1" },
                    response: { success: true, message: "Records deleted" }
                },
                "POST /api/sqlite/column/:dbName/:tableName": {
                    description: "Add a column to table",
                    body: { columnName: "string", columnType: "string", defaultValue: "any" },
                    response: { success: true, message: "Column added" }
                },
                "POST /api/sqlite/query/:dbName": {
                    description: "Execute custom SQL query",
                    body: { sql: "string", params: [] },
                    response: { success: true, result: [] }
                }
            }
        },
        examples: {
            "Create JSON file": {
                method: "POST",
                url: "/api/json/create",
                body: { filename: "users", data: [{ id: 1, name: "John" }] }
            },
            "Add property to JSON": {
                method: "POST",
                url: "/api/json/property/add/users",
                body: { propertyName: "email", defaultValue: "" }
            },
            "Create SQLite table": {
                method: "POST",
                url: "/api/sqlite/table/mydb",
                body: {
                    tableName: "users",
                    columns: [
                        { name: "id", type: "INTEGER", primaryKey: true, autoIncrement: true },
                        { name: "name", type: "TEXT", notNull: true },
                        { name: "email", type: "TEXT", unique: true },
                        { name: "created_at", type: "TEXT", default: "CURRENT_TIMESTAMP" }
                    ]
                }
            },
            "Insert SQLite record": {
                method: "POST",
                url: "/api/sqlite/record/mydb/users",
                body: { name: "John Doe", email: "john@example.com" }
            }
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Data Manager Server running on http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});

// Cleanup on exit
process.on("SIGINT", () => {
    sqliteManager.closeAll();
    process.exit();
});
