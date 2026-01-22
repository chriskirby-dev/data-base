const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

class SQLiteManager {
    constructor(dataDir = "./data/sqlite") {
        this.dataDir = dataDir;
        this.ensureDataDir();
        this.databases = new Map();
        this.SQL = null;
        this.initPromise = this.initialize();
    }

    async initialize() {
        if (!this.SQL) {
            this.SQL = await initSqlJs();
        }
    }

    ensureDataDir() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    getDbPath(dbName) {
        return path.join(this.dataDir, `${dbName}.db`);
    }

    // Get or create database connection
    async getDb(dbName) {
        await this.initPromise;

        if (!this.databases.has(dbName)) {
            const dbPath = this.getDbPath(dbName);
            let db;

            if (fs.existsSync(dbPath)) {
                const buffer = fs.readFileSync(dbPath);
                db = new this.SQL.Database(buffer);
            } else {
                db = new this.SQL.Database();
            }

            this.databases.set(dbName, db);
        }
        return this.databases.get(dbName);
    }

    // Save database to file
    saveDb(dbName) {
        const db = this.databases.get(dbName);
        if (db) {
            const data = db.export();
            const buffer = Buffer.from(data);
            const dbPath = this.getDbPath(dbName);
            fs.writeFileSync(dbPath, buffer);
        }
    }

    // List all database files
    listDatabases() {
        const files = fs
            .readdirSync(this.dataDir)
            .filter((file) => file.endsWith(".db"))
            .map((file) => file.replace(".db", ""));
        return files;
    }

    // Create new database
    async createDatabase(dbName) {
        const dbPath = this.getDbPath(dbName);
        if (fs.existsSync(dbPath)) {
            throw new Error(`Database ${dbName} already exists`);
        }
        await this.getDb(dbName);
        this.saveDb(dbName);
        return { success: true, message: `Database ${dbName} created` };
    }

    // Import database from base64 data
    async importDatabase(dbName, base64Data) {
        const dbPath = this.getDbPath(dbName);
        if (fs.existsSync(dbPath)) {
            throw new Error(`Database ${dbName} already exists. Please delete it first or choose a different name.`);
        }

        // Decode base64 and save to file
        const buffer = Buffer.from(base64Data, "base64");
        fs.writeFileSync(dbPath, buffer);

        // Load it into memory
        await this.getDb(dbName);

        return { success: true, message: `Database ${dbName} imported successfully` };
    }

    // Delete database
    deleteDatabase(dbName) {
        if (this.databases.has(dbName)) {
            const db = this.databases.get(dbName);
            db.close();
            this.databases.delete(dbName);
        }
        const dbPath = this.getDbPath(dbName);
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }
        return { success: true, message: `Database ${dbName} deleted` };
    }

    // List all tables in a database
    async listTables(dbName) {
        const db = await this.getDb(dbName);
        const result = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");

        if (result.length === 0) return [];
        return result[0].values.map((row) => row[0]);
    }

    // Create table
    async createTable(dbName, tableName, columns) {
        const db = await this.getDb(dbName);

        // columns should be an array of {name, type, constraints}
        const columnDefs = columns
            .map((col) => {
                let def = `${col.name} ${col.type || "TEXT"}`;
                if (col.primaryKey) def += " PRIMARY KEY";
                if (col.autoIncrement) def += " AUTOINCREMENT";
                if (col.notNull) def += " NOT NULL";
                if (col.unique) def += " UNIQUE";
                if (col.default !== undefined) def += ` DEFAULT ${col.default}`;
                return def;
            })
            .join(", ");

        const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefs})`;
        db.run(sql);
        this.saveDb(dbName);

        return { success: true, message: `Table ${tableName} created` };
    }

    // Drop table
    async dropTable(dbName, tableName) {
        const db = await this.getDb(dbName);
        db.run(`DROP TABLE IF EXISTS ${tableName}`);
        this.saveDb(dbName);
        return { success: true, message: `Table ${tableName} dropped` };
    }

    // Get table schema
    async getTableSchema(dbName, tableName) {
        const db = await this.getDb(dbName);
        const result = db.exec(`PRAGMA table_info(${tableName})`);

        if (result.length === 0) return [];

        // Convert to array of objects
        const columns = result[0].columns;
        return result[0].values.map((row) => {
            const obj = {};
            columns.forEach((col, idx) => {
                obj[col] = row[idx];
            });
            return obj;
        });
    }

    // Insert record
    async insertRecord(dbName, tableName, record) {
        const db = await this.getDb(dbName);
        const columns = Object.keys(record);
        const placeholders = columns.map(() => "?").join(", ");
        const values = Object.values(record);

        const sql = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`;
        db.run(sql, values);
        this.saveDb(dbName);

        return {
            success: true,
            message: "Record inserted"
        };
    }

    // Select records
    async selectRecords(dbName, tableName, where = null, limit = null) {
        const db = await this.getDb(dbName);
        let sql = `SELECT * FROM ${tableName}`;

        if (where) {
            sql += ` WHERE ${where}`;
        }
        if (limit) {
            sql += ` LIMIT ${limit}`;
        }

        const result = db.exec(sql);
        if (result.length === 0) return [];

        // Convert to array of objects
        const columns = result[0].columns;
        return result[0].values.map((row) => {
            const obj = {};
            columns.forEach((col, idx) => {
                obj[col] = row[idx];
            });
            return obj;
        });
    }

    // Update records
    async updateRecord(dbName, tableName, updates, where) {
        const db = await this.getDb(dbName);
        const setClauses = Object.keys(updates)
            .map((key) => `${key} = ?`)
            .join(", ");
        const values = Object.values(updates);

        const sql = `UPDATE ${tableName} SET ${setClauses} WHERE ${where}`;
        db.run(sql, values);
        this.saveDb(dbName);

        return {
            success: true,
            message: "Record(s) updated"
        };
    }

    // Delete records
    async deleteRecord(dbName, tableName, where) {
        const db = await this.getDb(dbName);
        const sql = `DELETE FROM ${tableName} WHERE ${where}`;
        db.run(sql);
        this.saveDb(dbName);

        return {
            success: true,
            message: "Record(s) deleted"
        };
    }

    // Add column to table
    async addColumn(dbName, tableName, columnName, columnType = "TEXT", defaultValue = null) {
        const db = await this.getDb(dbName);
        let sql = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`;
        if (defaultValue !== null) {
            sql += ` DEFAULT ${defaultValue}`;
        }
        db.run(sql);
        this.saveDb(dbName);

        return { success: true, message: `Column ${columnName} added` };
    }

    // Execute custom SQL query
    async executeQuery(dbName, sql, params = []) {
        const db = await this.getDb(dbName);
        try {
            if (sql.trim().toUpperCase().startsWith("SELECT")) {
                const result = db.exec(sql, params);
                if (result.length === 0) return [];

                // Convert to array of objects
                const columns = result[0].columns;
                return result[0].values.map((row) => {
                    const obj = {};
                    columns.forEach((col, idx) => {
                        obj[col] = row[idx];
                    });
                    return obj;
                });
            } else {
                db.run(sql, params);
                this.saveDb(dbName);
                return { success: true };
            }
        } catch (error) {
            throw new Error(`SQL Error: ${error.message}`);
        }
    }

    // Close all database connections
    closeAll() {
        this.databases.forEach((db, dbName) => {
            this.saveDb(dbName);
            db.close();
        });
        this.databases.clear();
    }
}

module.exports = SQLiteManager;
