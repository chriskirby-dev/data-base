const API_BASE = "/api";
let currentJSONFile = null;
let currentJSONData = [];
let currentDB = null;
let currentTable = null;

// ==================== Utility Functions ====================

function showStatus(message, type = "info") {
    const statusEl = document.getElementById("status-message");
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    statusEl.style.display = "block";
    setTimeout(() => {
        statusEl.style.display = "none";
    }, 5000);
}

function showModal(content) {
    document.getElementById("modal-body").innerHTML = content;
    document.getElementById("modal").style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// ==================== Data Source Switching ====================

document.querySelectorAll("[data-source]").forEach((btn) => {
    btn.addEventListener("click", function () {
        const source = this.dataset.source;
        console.log("Switching to:", source);

        // Update button states
        document.querySelectorAll("[data-source]").forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        // Show/hide sections
        document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));
        document.getElementById(`${source}-section`).classList.add("active");

        // Load data
        if (source === "json") {
            loadJSONFiles();
        } else if (source === "sqlite") {
            loadDatabases();
        }

        // Show status message
        showStatus(`Switched to ${source === "json" ? "JSON" : "SQLite"} mode`, "info");
    });
});

// ==================== JSON Functions ====================

async function loadJSONFiles() {
    try {
        const response = await fetch(`${API_BASE}/json/list`);
        const data = await response.json();

        const listEl = document.getElementById("json-files-list");
        if (data.files.length === 0) {
            listEl.innerHTML = '<p class="empty-message">No JSON files found. Create one to get started!</p>';
            return;
        }

        listEl.innerHTML = data.files
            .map(
                (file) => `
            <div class="file-item">
                <span class="file-name">${file}</span>
                <div class="file-actions">
                    <button class="btn btn-sm btn-primary" onclick="loadJSONFile('${file}')">Open</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteJSONFile('${file}')">Delete</button>
                </div>
            </div>
        `
            )
            .join("");
    } catch (error) {
        showStatus(`Error loading files: ${error.message}`, "error");
    }
}

async function createJSONFile() {
    const filename = document.getElementById("json-filename").value.trim();
    if (!filename) {
        showStatus("Please enter a filename", "warning");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/json/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename, data: [] })
        });
        const data = await response.json();

        if (data.success) {
            showStatus(`Created ${filename}.json`, "success");
            document.getElementById("json-filename").value = "";
            loadJSONFiles();
        } else {
            showStatus(data.error, "error");
        }
    } catch (error) {
        showStatus(`Error: ${error.message}`, "error");
    }
}

async function loadJSONFile(filename) {
    try {
        const response = await fetch(`${API_BASE}/json/read/${filename}`);
        const data = await response.json();

        if (data.success) {
            currentJSONFile = filename;
            // Ensure data is an array
            if (Array.isArray(data.data)) {
                currentJSONData = data.data;
            } else if (typeof data.data === "object" && data.data !== null) {
                // If it's an object, wrap it in an array
                currentJSONData = [data.data];
            } else {
                // If it's a primitive or null, create empty array
                currentJSONData = [];
            }
            document.getElementById("current-json-file").textContent = filename;
            document.getElementById("json-editor").style.display = "block";
            renderJSONTable();
            showStatus(`Loaded ${filename}.json`, "success");
        }
    } catch (error) {
        showStatus(`Error loading file: ${error.message}`, "error");
    }
}

function renderJSONTable() {
    const thead = document.getElementById("json-table-head");
    const tbody = document.getElementById("json-table-body");

    // Ensure currentJSONData is always an array
    if (!Array.isArray(currentJSONData)) {
        currentJSONData = [];
    }

    if (currentJSONData.length === 0) {
        thead.innerHTML = "";
        tbody.innerHTML =
            '<tr><td colspan="100%" class="empty-message">No records. Click "Add Record" to create one.</td></tr>';
        return;
    }

    // Get all unique keys
    const keys = [...new Set(currentJSONData.flatMap(Object.keys))];

    // Render header
    thead.innerHTML = `<tr>
        <th>#</th>
        ${keys.map((key) => `<th>${key}</th>`).join("")}
        <th>Actions</th>
    </tr>`;

    // Render body
    tbody.innerHTML = currentJSONData
        .map(
            (record, index) => `
        <tr>
            <td>${index}</td>
            ${keys.map((key) => `<td><input type="text" value="${record[key] || ""}" onchange="updateJSONCell(${index}, '${key}', this.value)"></td>`).join("")}
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteJSONRecord(${index})">Delete</button>
            </td>
        </tr>
    `
        )
        .join("");
}

function updateJSONCell(index, key, value) {
    currentJSONData[index][key] = value;
}

async function addJSONRecord() {
    if (currentJSONData.length > 0) {
        // Copy structure from first record
        const template = Object.keys(currentJSONData[0]).reduce((obj, key) => {
            obj[key] = "";
            return obj;
        }, {});
        currentJSONData.push(template);
    } else {
        // Create a simple object
        currentJSONData.push({ field1: "", field2: "" });
    }
    renderJSONTable();
}

function deleteJSONRecord(index) {
    if (confirm("Delete this record?")) {
        currentJSONData.splice(index, 1);
        renderJSONTable();
    }
}

async function saveJSON() {
    try {
        const response = await fetch(`${API_BASE}/json/update/${currentJSONFile}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: currentJSONData })
        });
        const data = await response.json();

        if (data.success) {
            showStatus("Changes saved successfully", "success");
        } else {
            showStatus(data.error, "error");
        }
    } catch (error) {
        showStatus(`Error saving: ${error.message}`, "error");
    }
}

function addJSONProperty() {
    const propName = prompt("Enter new property name:");
    if (!propName) return;

    const defaultValue = prompt("Enter default value (leave empty for null):") || null;

    currentJSONData.forEach((record) => {
        if (!record.hasOwnProperty(propName)) {
            record[propName] = defaultValue;
        }
    });

    renderJSONTable();
    showStatus(`Property "${propName}" added to all records`, "success");
}

function removeJSONProperty() {
    const propName = prompt("Enter property name to remove:");
    if (!propName) return;

    if (confirm(`Remove property "${propName}" from all records?`)) {
        currentJSONData.forEach((record) => {
            delete record[propName];
        });
        renderJSONTable();
        showStatus(`Property "${propName}" removed`, "success");
    }
}

function renameJSONProperty() {
    const oldName = prompt("Enter current property name:");
    if (!oldName) return;

    const newName = prompt("Enter new property name:");
    if (!newName) return;

    currentJSONData.forEach((record) => {
        if (record.hasOwnProperty(oldName)) {
            record[newName] = record[oldName];
            delete record[oldName];
        }
    });

    renderJSONTable();
    showStatus(`Property renamed from "${oldName}" to "${newName}"`, "success");
}

async function deleteJSONFile(filename) {
    if (!confirm(`Delete ${filename}.json?`)) return;

    try {
        const response = await fetch(`${API_BASE}/json/delete/${filename}`, {
            method: "DELETE"
        });
        const data = await response.json();

        if (data.success) {
            showStatus(`Deleted ${filename}.json`, "success");
            if (currentJSONFile === filename) {
                closeEditor();
            }
            loadJSONFiles();
        }
    } catch (error) {
        showStatus(`Error: ${error.message}`, "error");
    }
}

function exportJSON() {
    window.open(`${API_BASE}/json/export/${currentJSONFile}`, "_blank");
}

function showImportDialog() {
    showModal(`
        <h3>Import JSON File</h3>
        <div class="form-group">
            <input type="text" id="import-filename" placeholder="Filename (without .json)">
        </div>
        <div class="form-group">
            <textarea id="import-data" placeholder="Paste JSON data here..." rows="10" style="width: 100%; font-family: monospace;"></textarea>
        </div>
        <button class="btn btn-success" onclick="importJSON()">Import</button>
        <button class="btn" onclick="closeModal()">Cancel</button>
    `);
}

async function importJSON() {
    const filename = document.getElementById("import-filename").value.trim();
    const jsonText = document.getElementById("import-data").value.trim();

    if (!filename || !jsonText) {
        showStatus("Please provide filename and JSON data", "warning");
        return;
    }

    try {
        const data = JSON.parse(jsonText);
        const response = await fetch(`${API_BASE}/json/import`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename, data })
        });
        const result = await response.json();

        if (result.success) {
            showStatus(`Imported ${filename}.json`, "success");
            closeModal();
            loadJSONFiles();
        } else {
            showStatus(result.error, "error");
        }
    } catch (error) {
        showStatus(`Error: ${error.message}`, "error");
    }
}

// ==================== SQLite Functions ====================

async function loadDatabases() {
    try {
        const response = await fetch(`${API_BASE}/sqlite/databases`);
        const data = await response.json();

        const listEl = document.getElementById("databases-list");
        if (data.databases.length === 0) {
            listEl.innerHTML = '<p class="empty-message">No databases found. Create one to get started!</p>';
            return;
        }

        listEl.innerHTML = data.databases
            .map(
                (db) => `
            <div class="file-item">
                <span class="file-name">${db}</span>
                <div class="file-actions">
                    <button class="btn btn-sm btn-primary" onclick="loadDatabase('${db}')">Open</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDatabase('${db}')">Delete</button>
                </div>
            </div>
        `
            )
            .join("");
    } catch (error) {
        showStatus(`Error loading databases: ${error.message}`, "error");
    }
}

async function createDatabase() {
    const dbName = document.getElementById("db-name").value.trim();
    if (!dbName) {
        showStatus("Please enter a database name", "warning");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/sqlite/database`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dbName })
        });
        const data = await response.json();

        if (data.success) {
            showStatus(`Created database ${dbName}`, "success");
            document.getElementById("db-name").value = "";
            loadDatabases();
        } else {
            showStatus(data.error, "error");
        }
    } catch (error) {
        showStatus(`Error: ${error.message}`, "error");
    }
}

async function loadDatabase(dbName) {
    currentDB = dbName;
    document.getElementById("current-db").textContent = dbName;
    document.getElementById("db-editor").style.display = "block";
    document.getElementById("table-editor").style.display = "none";
    loadTables();
}

async function loadTables() {
    try {
        const response = await fetch(`${API_BASE}/sqlite/tables/${currentDB}`);
        const data = await response.json();

        const listEl = document.getElementById("tables-list");
        if (data.tables.length === 0) {
            listEl.innerHTML = '<p class="empty-message">No tables. Create one to get started!</p>';
            return;
        }

        listEl.innerHTML = data.tables
            .map(
                (table) => `
            <div class="file-item">
                <span class="file-name">${table}</span>
                <div class="file-actions">
                    <button class="btn btn-sm btn-primary" onclick="loadTable('${table}')">Open</button>
                    <button class="btn btn-sm btn-danger" onclick="dropTable('${table}')">Drop</button>
                </div>
            </div>
        `
            )
            .join("");
    } catch (error) {
        showStatus(`Error loading tables: ${error.message}`, "error");
    }
}

async function loadTable(tableName) {
    currentTable = tableName;
    document.getElementById("current-table").textContent = tableName;
    document.getElementById("table-editor").style.display = "block";
    refreshTableData();
}

async function refreshTableData() {
    try {
        const response = await fetch(`${API_BASE}/sqlite/records/${currentDB}/${currentTable}`);
        const data = await response.json();

        const thead = document.getElementById("sql-table-head");
        const tbody = document.getElementById("sql-table-body");

        if (data.records.length === 0) {
            thead.innerHTML = "";
            tbody.innerHTML =
                '<tr><td colspan="100%" class="empty-message">No records. Click "Add Record" to create one.</td></tr>';
            return;
        }

        const keys = Object.keys(data.records[0]);

        thead.innerHTML = `<tr>
            ${keys.map((key) => `<th>${key}</th>`).join("")}
            <th>Actions</th>
        </tr>`;

        tbody.innerHTML = data.records
            .map(
                (record, index) => `
            <tr>
                ${keys.map((key) => `<td>${record[key]}</td>`).join("")}
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editSQLRecord(${JSON.stringify(record).replace(/"/g, "&quot;")})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSQLRecord('${record[keys[0]]}', '${keys[0]}')">Delete</button>
                </td>
            </tr>
        `
            )
            .join("");
    } catch (error) {
        showStatus(`Error loading table data: ${error.message}`, "error");
    }
}

function showCreateTableDialog() {
    showModal(`
        <h3>Create New Table</h3>
        <div class="form-group">
            <input type="text" id="table-name" placeholder="Table name">
        </div>
        <div id="columns-builder">
            <h4>Columns:</h4>
            <div class="column-row" data-col-index="0">
                <div class="col-order-buttons">
                    <button class="btn-order btn-order-up" onclick="moveColumnUp(this)" title="Move up">↑</button>
                    <button class="btn-order btn-order-down" onclick="moveColumnDown(this)" title="Move down">↓</button>
                </div>
                <input type="text" placeholder="Column name" class="col-name">
                <select class="col-type" onchange="updateColumnOptions(this)">
                    <option value="INTEGER">INTEGER</option>
                    <option value="TEXT">TEXT</option>
                    <option value="REAL">REAL</option>
                    <option value="BLOB">BLOB</option>
                </select>
                <input type="text" placeholder="Default value (optional)" class="col-default">
                <label><input type="checkbox" class="col-pk" onchange="updateColumnOptions(this)"> Primary Key</label>
                <label><input type="checkbox" class="col-autoincrement" disabled> Auto Increment</label>
                <label><input type="checkbox" class="col-notnull"> Not Null</label>
                <label><input type="checkbox" class="col-unique"> Unique</label>
            </div>
        </div>
        <button class="btn btn-secondary" onclick="addColumnRow()">Add Column</button>
        <br><br>
        <button class="btn btn-success" onclick="createTable()">Create Table</button>
        <button class="btn" onclick="closeModal()">Cancel</button>
    `);
}

function addColumnRow() {
    const builder = document.getElementById("columns-builder");
    const rows = builder.querySelectorAll(".column-row");
    const newIndex = rows.length;

    const row = document.createElement("div");
    row.className = "column-row";
    row.dataset.colIndex = newIndex;
    row.innerHTML = `
        <div class="col-order-buttons">
            <button class="btn-order btn-order-up" onclick="moveColumnUp(this)" title="Move up">↑</button>
            <button class="btn-order btn-order-down" onclick="moveColumnDown(this)" title="Move down">↓</button>
        </div>
        <input type="text" placeholder="Column name" class="col-name">
        <select class="col-type" onchange="updateColumnOptions(this)">
            <option value="INTEGER">INTEGER</option>
            <option value="TEXT">TEXT</option>
            <option value="REAL">REAL</option>
            <option value="BLOB">BLOB</option>
        </select>
        <input type="text" placeholder="Default value (optional)" class="col-default">
        <label><input type="checkbox" class="col-pk" onchange="updateColumnOptions(this)"> Primary Key</label>
        <label><input type="checkbox" class="col-autoincrement" disabled> Auto Increment</label>
        <label><input type="checkbox" class="col-notnull"> Not Null</label>
        <label><input type="checkbox" class="col-unique"> Unique</label>
        <button class="btn btn-sm btn-danger" onclick="this.parentElement.remove(); updateColumnIndices()">Remove</button>
    `;
    builder.appendChild(row);
}

function updateColumnOptions(element) {
    // Find the parent column row
    const row = element.closest(".column-row");
    const typeSelect = row.querySelector(".col-type");
    const pkCheckbox = row.querySelector(".col-pk");
    const autoIncrementCheckbox = row.querySelector(".col-autoincrement");

    // Auto Increment is only available for INTEGER PRIMARY KEY
    const isInteger = typeSelect.value === "INTEGER";
    const isPrimaryKey = pkCheckbox.checked;

    if (isInteger && isPrimaryKey) {
        autoIncrementCheckbox.disabled = false;
    } else {
        autoIncrementCheckbox.disabled = true;
        autoIncrementCheckbox.checked = false;
    }
}

function moveColumnUp(button) {
    const row = button.closest(".column-row");
    const prev = row.previousElementSibling;
    if (prev && prev.classList.contains("column-row")) {
        row.parentNode.insertBefore(row, prev);
        updateColumnIndices();
    }
}

function moveColumnDown(button) {
    const row = button.closest(".column-row");
    const next = row.nextElementSibling;
    if (next && next.classList.contains("column-row")) {
        row.parentNode.insertBefore(next, row);
        updateColumnIndices();
    }
}

function updateColumnIndices() {
    const rows = document.querySelectorAll(".column-row");
    rows.forEach((row, index) => {
        row.dataset.colIndex = index;
    });
}

async function createTable() {
    const tableName = document.getElementById("table-name").value.trim();
    if (!tableName) {
        showStatus("Please enter a table name", "warning");
        return;
    }

    const rows = document.querySelectorAll(".column-row");
    const columns = [];

    rows.forEach((row) => {
        const name = row.querySelector(".col-name").value.trim();
        const type = row.querySelector(".col-type").value;
        const defaultValue = row.querySelector(".col-default").value.trim();
        const primaryKey = row.querySelector(".col-pk").checked;
        const autoIncrement = row.querySelector(".col-autoincrement").checked;
        const notNull = row.querySelector(".col-notnull").checked;
        const unique = row.querySelector(".col-unique").checked;

        if (name) {
            const column = { name, type, primaryKey, autoIncrement, notNull, unique };
            if (defaultValue) {
                // Handle different default value formats
                if (type === "TEXT" || type === "BLOB") {
                    column.default = `'${defaultValue.replace(/'/g, "''")}'`;
                } else if (defaultValue.toUpperCase() === "NULL") {
                    column.default = "NULL";
                } else if (
                    defaultValue.toUpperCase() === "CURRENT_TIMESTAMP" ||
                    defaultValue.toUpperCase() === "CURRENT_DATE" ||
                    defaultValue.toUpperCase() === "CURRENT_TIME"
                ) {
                    column.default = defaultValue.toUpperCase();
                } else {
                    column.default = defaultValue;
                }
            }
            columns.push(column);
        }
    });

    if (columns.length === 0) {
        showStatus("Please add at least one column", "warning");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/sqlite/table/${currentDB}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tableName, columns })
        });
        const data = await response.json();

        if (data.success) {
            showStatus(`Table ${tableName} created`, "success");
            closeModal();
            loadTables();
        } else {
            showStatus(data.error, "error");
        }
    } catch (error) {
        showStatus(`Error: ${error.message}`, "error");
    }
}

async function addSQLRecord() {
    try {
        const response = await fetch(`${API_BASE}/sqlite/schema/${currentDB}/${currentTable}`);
        const data = await response.json();

        const fields = data.schema.filter((col) => !col.pk || !col.dflt_value);

        let formHTML = "<h3>Add New Record</h3>";
        fields.forEach((field) => {
            formHTML += `
                <div class="form-group">
                    <label>${field.name} (${field.type})</label>
                    <input type="text" id="field-${field.name}" placeholder="${field.name}">
                </div>
            `;
        });
        formHTML += `
            <button class="btn btn-success" onclick="submitSQLRecord()">Add Record</button>
            <button class="btn" onclick="closeModal()">Cancel</button>
        `;

        showModal(formHTML);
        window.currentSchemaFields = fields;
    } catch (error) {
        showStatus(`Error: ${error.message}`, "error");
    }
}

async function submitSQLRecord() {
    const record = {};
    window.currentSchemaFields.forEach((field) => {
        const value = document.getElementById(`field-${field.name}`).value;
        if (value) {
            record[field.name] = field.type === "INTEGER" ? parseInt(value) : value;
        }
    });

    try {
        const response = await fetch(`${API_BASE}/sqlite/record/${currentDB}/${currentTable}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(record)
        });
        const data = await response.json();

        if (data.success) {
            showStatus("Record added", "success");
            closeModal();
            refreshTableData();
        } else {
            showStatus(data.error, "error");
        }
    } catch (error) {
        showStatus(`Error: ${error.message}`, "error");
    }
}

async function addSQLColumn() {
    const columnName = prompt("Enter column name:");
    if (!columnName) return;

    const columnType = prompt("Enter column type (INTEGER, TEXT, REAL, BLOB):", "TEXT");

    try {
        const response = await fetch(`${API_BASE}/sqlite/column/${currentDB}/${currentTable}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ columnName, columnType })
        });
        const data = await response.json();

        if (data.success) {
            showStatus(`Column ${columnName} added`, "success");
            refreshTableData();
        } else {
            showStatus(data.error, "error");
        }
    } catch (error) {
        showStatus(`Error: ${error.message}`, "error");
    }
}

async function dropTable(tableName) {
    if (!confirm(`Drop table ${tableName}? This cannot be undone!`)) return;

    try {
        const response = await fetch(`${API_BASE}/sqlite/table/${currentDB}/${tableName}`, {
            method: "DELETE"
        });
        const data = await response.json();

        if (data.success) {
            showStatus(`Table ${tableName} dropped`, "success");
            if (currentTable === tableName) {
                document.getElementById("table-editor").style.display = "none";
            }
            loadTables();
        }
    } catch (error) {
        showStatus(`Error: ${error.message}`, "error");
    }
}

async function deleteDatabase(dbName) {
    if (!confirm(`Delete database ${dbName}? This cannot be undone!`)) return;

    try {
        const response = await fetch(`${API_BASE}/sqlite/database/${dbName}`, {
            method: "DELETE"
        });
        const data = await response.json();

        if (data.success) {
            showStatus(`Database ${dbName} deleted`, "success");
            if (currentDB === dbName) {
                document.getElementById("db-editor").style.display = "none";
            }
            loadDatabases();
        }
    } catch (error) {
        showStatus(`Error: ${error.message}`, "error");
    }
}

function executeSQLQuery() {
    showModal(`
        <h3>Execute Custom SQL Query</h3>
        <div class="form-group">
            <textarea id="sql-query" placeholder="Enter SQL query..." rows="5" style="width: 100%; font-family: monospace;"></textarea>
        </div>
        <button class="btn btn-primary" onclick="runSQLQuery()">Execute</button>
        <button class="btn" onclick="closeModal()">Cancel</button>
        <div id="query-result" style="margin-top: 20px;"></div>
    `);
}

async function runSQLQuery() {
    const sql = document.getElementById("sql-query").value.trim();
    if (!sql) return;

    try {
        const response = await fetch(`${API_BASE}/sqlite/query/${currentDB}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sql, params: [] })
        });
        const data = await response.json();

        const resultEl = document.getElementById("query-result");
        if (data.success) {
            resultEl.innerHTML = `<pre>${JSON.stringify(data.result, null, 2)}</pre>`;
            showStatus("Query executed successfully", "success");
            if (sql.trim().toUpperCase().startsWith("SELECT")) {
                refreshTableData();
            }
        } else {
            resultEl.innerHTML = `<p class="error">Error: ${data.error}</p>`;
        }
    } catch (error) {
        document.getElementById("query-result").innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

function closeEditor() {
    document.getElementById("json-editor").style.display = "none";
    document.getElementById("db-editor").style.display = "none";
    currentJSONFile = null;
    currentDB = null;
    currentTable = null;
}
// ==================== FILE UPLOAD & DRAG-AND-DROP ====================

// JSON File Selection Handler
function handleJSONFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        importJSONFile(file);
    }
}

// SQLite File Selection Handler
function handleSQLiteFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        importSQLiteFile(file);
    }
}

// Import JSON File
function importJSONFile(file) {
    const reader = new FileReader();
    reader.onload = async function (e) {
        try {
            const content = e.target.result;
            const data = JSON.parse(content);
            const filename = file.name.replace(".json", "");

            const response = await fetch(`${API_BASE}/json/import`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename, data })
            });
            const result = await response.json();

            if (result.success) {
                showStatus(`Successfully imported ${filename}.json`, "success");
                loadJSONFiles();
            } else {
                showStatus(result.error, "error");
            }
        } catch (error) {
            showStatus(`Error importing file: ${error.message}`, "error");
        }
    };
    reader.readAsText(file);
}

// Import SQLite File
function importSQLiteFile(file) {
    const reader = new FileReader();
    reader.onload = async function (e) {
        try {
            const arrayBuffer = e.target.result;
            const bytes = new Uint8Array(arrayBuffer);
            const filename = file.name.replace(/\.(db|sqlite|sqlite3)$/, "");

            // Convert to base64 for transmission
            const base64 = btoa(String.fromCharCode.apply(null, bytes));

            const response = await fetch(`${API_BASE}/sqlite/import`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dbName: filename, data: base64 })
            });
            const result = await response.json();

            if (result.success) {
                showStatus(`Successfully imported ${filename}.db`, "success");
                loadDatabases();
            } else {
                showStatus(result.error, "error");
            }
        } catch (error) {
            showStatus(`Error importing database: ${error.message}`, "error");
        }
    };
    reader.readAsArrayBuffer(file);
}

// Setup Drag and Drop for JSON
const jsonUploadZone = document.getElementById("json-upload-zone");

jsonUploadZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.add("drag-over");
});

jsonUploadZone.addEventListener("dragleave", function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove("drag-over");
});

jsonUploadZone.addEventListener("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove("drag-over");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.name.endsWith(".json")) {
            importJSONFile(file);
        } else {
            showStatus("Please drop a JSON file (.json)", "warning");
        }
    }
});

// Setup Drag and Drop for SQLite
const sqliteUploadZone = document.getElementById("sqlite-upload-zone");

sqliteUploadZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.add("drag-over");
});

sqliteUploadZone.addEventListener("dragleave", function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove("drag-over");
});

sqliteUploadZone.addEventListener("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove("drag-over");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.name.match(/\.(db|sqlite|sqlite3)$/)) {
            importSQLiteFile(file);
        } else {
            showStatus("Please drop a SQLite database file (.db, .sqlite, .sqlite3)", "warning");
        }
    }
});
// Close modal on outside click
window.onclick = function (event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
        closeModal();
    }
};

// Load initial data
loadJSONFiles();
