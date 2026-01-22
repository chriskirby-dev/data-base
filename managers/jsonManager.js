const fs = require("fs");
const path = require("path");

class JSONManager {
    constructor(dataDir = "./data/json") {
        this.dataDir = dataDir;
        this.ensureDataDir();
    }

    ensureDataDir() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    getFilePath(filename) {
        return path.join(this.dataDir, `${filename}.json`);
    }

    // List all JSON files
    listFiles() {
        const files = fs
            .readdirSync(this.dataDir)
            .filter((file) => file.endsWith(".json"))
            .map((file) => file.replace(".json", ""));
        return files;
    }

    // Create new JSON file/dataset
    create(filename, data = []) {
        const filePath = this.getFilePath(filename);
        if (fs.existsSync(filePath)) {
            throw new Error(`File ${filename} already exists`);
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return { success: true, message: `Created ${filename}` };
    }

    // Read JSON file
    read(filename) {
        const filePath = this.getFilePath(filename);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File ${filename} not found`);
        }
        const content = fs.readFileSync(filePath, "utf8");
        return JSON.parse(content);
    }

    // Update entire JSON file
    update(filename, data) {
        const filePath = this.getFilePath(filename);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File ${filename} not found`);
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return { success: true, message: `Updated ${filename}` };
    }

    // Delete JSON file
    delete(filename) {
        const filePath = this.getFilePath(filename);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File ${filename} not found`);
        }
        fs.unlinkSync(filePath);
        return { success: true, message: `Deleted ${filename}` };
    }

    // Insert new record/object
    insertRecord(filename, record) {
        const data = this.read(filename);
        if (!Array.isArray(data)) {
            throw new Error("Data must be an array to insert records");
        }
        data.push(record);
        this.update(filename, data);
        return { success: true, message: "Record inserted", data: record };
    }

    // Update specific record by index
    updateRecord(filename, index, updates) {
        const data = this.read(filename);
        if (!Array.isArray(data)) {
            throw new Error("Data must be an array");
        }
        if (index < 0 || index >= data.length) {
            throw new Error("Index out of bounds");
        }
        data[index] = { ...data[index], ...updates };
        this.update(filename, data);
        return { success: true, message: "Record updated", data: data[index] };
    }

    // Delete record by index
    deleteRecord(filename, index) {
        const data = this.read(filename);
        if (!Array.isArray(data)) {
            throw new Error("Data must be an array");
        }
        if (index < 0 || index >= data.length) {
            throw new Error("Index out of bounds");
        }
        const deleted = data.splice(index, 1)[0];
        this.update(filename, data);
        return { success: true, message: "Record deleted", data: deleted };
    }

    // Add property to all records
    addProperty(filename, propertyName, defaultValue = null) {
        const data = this.read(filename);
        if (!Array.isArray(data)) {
            throw new Error("Data must be an array");
        }
        data.forEach((record) => {
            if (!record.hasOwnProperty(propertyName)) {
                record[propertyName] = defaultValue;
            }
        });
        this.update(filename, data);
        return { success: true, message: `Property ${propertyName} added` };
    }

    // Remove property from all records
    removeProperty(filename, propertyName) {
        const data = this.read(filename);
        if (!Array.isArray(data)) {
            throw new Error("Data must be an array");
        }
        data.forEach((record) => {
            delete record[propertyName];
        });
        this.update(filename, data);
        return { success: true, message: `Property ${propertyName} removed` };
    }

    // Rename property in all records
    renameProperty(filename, oldName, newName) {
        const data = this.read(filename);
        if (!Array.isArray(data)) {
            throw new Error("Data must be an array");
        }
        data.forEach((record) => {
            if (record.hasOwnProperty(oldName)) {
                record[newName] = record[oldName];
                delete record[oldName];
            }
        });
        this.update(filename, data);
        return { success: true, message: `Property renamed from ${oldName} to ${newName}` };
    }

    // Import from JSON string or object
    import(filename, jsonData) {
        let data;
        if (typeof jsonData === "string") {
            data = JSON.parse(jsonData);
        } else {
            data = jsonData;
        }
        this.create(filename, data);
        return { success: true, message: `Imported ${filename}` };
    }

    // Export as JSON string
    export(filename) {
        const data = this.read(filename);
        return JSON.stringify(data, null, 2);
    }
}

module.exports = JSONManager;
