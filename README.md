# 📊 Data Manager - Universal JSON & SQLite Manager

A powerful Node.js application for managing JSON files and SQLite databases with an intuitive web interface and comprehensive REST API.

> 📚 **Documentation:** This is the complete documentation. For quick reference, see [QUICK_REFERENCE.md](QUICK_REFERENCE.md). For code examples, see [API_EXAMPLES.md](API_EXAMPLES.md). For a documentation overview, see [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md).

---

## 📑 Table of Contents

- [Features](#-features)
- [Getting Started](#-getting-started)
- [Web Interface Guide](#-using-the-web-interface)
- [API Documentation](#-api-documentation)
  - [Complete API Reference](#-complete-api-reference)
  - [JSON API](#json-api-complete-reference)
  - [SQLite API](#sqlite-api-complete-reference)
- [Programming Examples](#-programming-language-examples)
- [Advanced Usage](#-advanced-usage-scenarios)
- [Data Migration](#-data-migration-examples)
- [Technologies](#️-technologies-used)
- [FAQ](#-frequently-asked-questions-faq)
- [Troubleshooting](#-troubleshooting)
- [Best Practices](#-best-practices)
- [Configuration](#-configuration-options)
- [Security](#-security-notes)
- [Project Structure](#-project-structure)
- [Use Cases](#-use-cases)
- [Roadmap](#-roadmap)

---

## ✨ Features

### JSON Management
- ✅ Create, read, update, and delete JSON files
- ✅ Insert, edit, and remove records
- ✅ Add, remove, and rename properties across all records
- ✅ Import and export JSON data
- ✅ Visual table editor for easy data manipulation

### SQLite Management
- ✅ Create and manage multiple SQLite databases
- ✅ Create tables with advanced column options:
  - Primary Key with Auto Increment
  - Default values (including CURRENT_TIMESTAMP)
  - NOT NULL, UNIQUE constraints
  - Reorder columns before creation (↑↓ buttons)
- ✅ Full CRUD operations on records
- ✅ Add columns dynamically
- ✅ Execute custom SQL queries
- ✅ View and manage table structures
- ✅ Import/export databases via file upload or drag & drop

### Web Interface
- 🎨 Modern, responsive design
- 📱 Mobile-friendly interface
- 🎯 Intuitive control panel
- ⚡ Real-time data editing
- 🔄 Easy switching between data sources

### API Features
- 🌐 RESTful API for programmatic access
- 🔌 CORS enabled for cross-origin requests
- 📝 JSON request/response format
- 🚀 Fast and efficient operations
- 📚 Complete API documentation at `/api` and `/api-docs.html`
- ⚡ Full support for all web interface features via API

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the server:**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

3. **Open your browser:**
```
http://localhost:3000
```

## 📖 Using the Web Interface

### JSON Files

1. **Create a new JSON file:**
   - Enter a filename (without .json extension)
   - Click "Create New"

2. **Import existing JSON:**
   - Click "Import JSON"
   - Enter filename and paste JSON data
   - Click "Import"

3. **Edit JSON data:**
   - Click "Open" on any file
   - Add/edit/delete records using the table
   - Add/remove/rename properties
   - Click "Save Changes"

4. **Manage properties:**
   - Add Property: Adds a new field to all records
   - Rename Property: Changes property name across all records
   - Remove Property: Deletes a field from all records

### SQLite Databases

1. **Create a database:**
   - Enter database name
   - Click "Create Database"
   - Or drag & drop a .db file to import

2. **Create a table:**
   - Open a database
   - Click "Create Table"
   - Define columns with:
     - Column name and data type (INTEGER, TEXT, REAL, BLOB)
     - Primary Key checkbox
     - Auto Increment (available for INTEGER PRIMARY KEY only)
     - NOT NULL constraint
     - UNIQUE constraint
     - Default value (optional)
   - Use ↑↓ buttons to reorder columns
   - Click "Create Table"

3. **Manage data:**
   - Open a table to view records
   - Add records with "Add Record"
   - Edit or delete existing records
   - Add columns with "Add Column"

4. **Execute custom queries:**
   - Click "Execute Custom Query"
   - Enter your SQL statement
   - View results immediately

## 🔌 API Documentation

The REST API exposes **all functionality** available in the web interface, including:
- JSON file operations (create, read, update, delete)
- JSON property management (add, remove, rename properties across all records)
- SQLite database operations (create, import, delete)
- SQLite table creation with full column options (PRIMARY KEY, AUTO INCREMENT, DEFAULT values, NOT NULL, UNIQUE)
- SQLite record operations (insert, select, update, delete)
- Custom SQL query execution

📚 **Interactive API Documentation:** Visit `http://localhost:3000/api-docs.html` for complete, interactive API documentation with examples.

### Base URL
```
http://localhost:3000/api
```

### Quick API Reference

Get complete API schema:
```http
GET /api
```
Returns JSON with all endpoints, parameters, and examples.

### JSON Endpoints

#### List all JSON files
```http
GET /api/json/list
```

#### Create new JSON file
```http
POST /api/json/create
Content-Type: application/json

{
  "filename": "users",
  "data": [{"name": "John", "age": 30}]
}
```

#### Read JSON file
```http
GET /api/json/read/:filename
```

#### Update JSON file
```http
PUT /api/json/update/:filename
Content-Type: application/json

{
  "data": [{"name": "Jane", "age": 25}]
}
```

#### Delete JSON file
```http
DELETE /api/json/delete/:filename
```

#### Insert record
```http
POST /api/json/record/:filename
Content-Type: application/json

{
  "name": "Alice",
  "age": 28
}
```

#### Update specific record
```http
PUT /api/json/record/:filename/:index
Content-Type: application/json

{
  "name": "Alice Updated"
}
```

#### Delete specific record
```http
DELETE /api/json/record/:filename/:index
```

#### Add property to all records
```http
POST /api/json/property/add/:filename
Content-Type: application/json

{
  "propertyName": "email",
  "defaultValue": ""
}
```

#### Remove property from all records
```http
DELETE /api/json/property/remove/:filename
Content-Type: application/json

{
  "propertyName": "email"
}
```

#### Rename property
```http
PUT /api/json/property/rename/:filename
Content-Type: application/json

{
  "oldName": "email",
  "newName": "emailAddress"
}
```

#### Export JSON
```http
GET /api/json/export/:filename
```

### SQLite Endpoints

#### List all databases
```http
GET /api/sqlite/databases
```

#### Create database
```http
POST /api/sqlite/database
Content-Type: application/json

{
  "dbName": "myapp"
}
```

#### Delete database
```http
DELETE /api/sqlite/database/:dbName
```

#### List tables in database
```http
GET /api/sqlite/tables/:dbName
```

#### Create table
```http
POST /api/sqlite/table/:dbName
Content-Type: application/json

{
  "tableName": "users",
  "columns": [
    {
      "name": "id",
      "type": "INTEGER",
      "primaryKey": true,
      "autoIncrement": true
    },
    {
      "name": "name",
      "type": "TEXT",
      "notNull": true
    },
    {
      "name": "email",
      "type": "TEXT",
      "unique": true,
      "notNull": true
    },
    {
      "name": "status",
      "type": "TEXT",
      "default": "'active'"
    },
    {
      "name": "created_at",
      "type": "TEXT",
      "default": "CURRENT_TIMESTAMP"
    }
  ]
}
```

**Column Options:**
- `primaryKey`: Mark as primary key
- `autoIncrement`: Auto-increment (INTEGER PRIMARY KEY only)
- `notNull`: NOT NULL constraint
- `unique`: UNIQUE constraint
- `default`: Default value (use quotes for text: `"'value'"`, or SQL functions: `"CURRENT_TIMESTAMP"`)

#### Drop table
```http
DELETE /api/sqlite/table/:dbName/:tableName
```

#### Get table schema
```http
GET /api/sqlite/schema/:dbName/:tableName
```

#### Insert record
```http
POST /api/sqlite/record/:dbName/:tableName
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Select records
```http
GET /api/sqlite/records/:dbName/:tableName?where=id=1&limit=10
```

#### Update records
```http
PUT /api/sqlite/records/:dbName/:tableName
Content-Type: application/json

{
  "updates": {"name": "Jane Doe"},
  "where": "id = 1"
}
```

#### Delete records
```http
DELETE /api/sqlite/records/:dbName/:tableName
Content-Type: application/json

{
  "where": "id = 1"
}
```

#### Add column
```http
POST /api/sqlite/column/:dbName/:tableName
Content-Type: application/json

{
  "columnName": "phone",
  "columnType": "TEXT",
  "defaultValue": null
}
```

#### Execute custom SQL query
```http
POST /api/sqlite/query/:dbName
Content-Type: application/json

{
  "sql": "SELECT * FROM users WHERE age > ?",
  "params": [18]
}
```

## 🌐 Embedding in Web Pages

You can embed the data manager interface in an iframe:

```html
<iframe 
  src="http://localhost:3000" 
  width="100%" 
  height="800px" 
  frameborder="0"
></iframe>
```

Or use the API to build custom interfaces:

```javascript
// Example: Fetch JSON data
fetch('http://localhost:3000/api/json/read/mydata')
  .then(res => res.json())
  .then(data => console.log(data));

// Example: Add record to JSON
fetch('http://localhost:3000/api/json/record/mydata', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({name: 'New User', status: 'active'})
})
  .then(res => res.json())
  .then(result => console.log(result));
```

## 📁 Project Structure

```
data-manager/
├── managers/
│   ├── jsonManager.js      # JSON operations handler
│   └── sqliteManager.js    # SQLite operations handler
├── public/
│   ├── index.html          # Main web interface
│   ├── api-docs.html       # Interactive API documentation
│   ├── app.js              # Frontend JavaScript
│   └── styles.css          # Styling
├── data/
│   ├── json/               # JSON files storage
│   └── sqlite/             # SQLite databases storage
├── server.js               # Express server & API
├── package.json            # Dependencies
├── README.md               # Complete documentation (this file)
├── QUICK_REFERENCE.md      # Quick reference card
├── API_EXAMPLES.md         # API examples collection
└── DOCUMENTATION_INDEX.md  # Documentation overview
```

## ⚙️ Configuration

You can customize the server by setting environment variables:

```bash
# Change server port (default: 3000)
PORT=8080 npm start
```

Modify data directories in the managers:
- JSON files: `./data/json`
- SQLite databases: `./data/sqlite`

## 🔒 Security Notes

⚠️ **Important:** This application is designed for local development and trusted environments. For production use, consider adding:
- Authentication and authorization
- Input validation and sanitization
- Rate limiting
- HTTPS encryption
- SQL injection protection (parameterized queries are already used)

## ❓ Frequently Asked Questions (FAQ)

### General Questions

**Q: Can I use this in production?**  
A: This tool is designed for development, prototyping, and internal tools. For production, add authentication, validation, and security measures.

**Q: What's the maximum file size for JSON files?**  
A: The body parser is configured for 50MB limit. You can adjust this in `server.js`.

**Q: Can I access this from another computer on my network?**  
A: Yes! Change the server to listen on `0.0.0.0` and access via `http://YOUR_IP:3000`. Make sure your firewall allows the connection.

**Q: Does this support MongoDB or PostgreSQL?**  
A: Currently only JSON files and SQLite. See the roadmap for future database support.

### JSON Questions

**Q: What happens if my JSON file is not an array?**  
A: The system automatically wraps non-array data in an array for consistent table display.

**Q: Can I import JSON from a URL?**  
A: Not directly, but you can fetch it with your code and POST to the import endpoint.

**Q: How do I handle nested JSON objects?**  
A: The current table editor works best with flat objects. For nested structures, use the API to manipulate data programmatically.

**Q: Can I add a property with a complex default value?**  
A: Yes! Use the API to set any JSON-compatible value as default (objects, arrays, etc.).

### SQLite Questions

**Q: Can I use foreign keys?**  
A: Yes! Use custom SQL queries to create tables with foreign key constraints:
```javascript
await axios.post('http://localhost:3000/api/sqlite/query/mydb', {
  sql: `CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  )`
});
```

**Q: How do I create indexes?**  
A: Use custom SQL queries:
```javascript
await axios.post('http://localhost:3000/api/sqlite/query/mydb', {
  sql: 'CREATE INDEX idx_email ON users(email)'
});
```

**Q: Can I backup my SQLite database?**  
A: Yes! The `.db` files are stored in `data/sqlite/`. Simply copy the files to backup.

**Q: What's the difference between INTEGER PRIMARY KEY and INTEGER PRIMARY KEY AUTOINCREMENT?**  
A: `AUTOINCREMENT` ensures IDs are never reused, even after deletion. Use it when ID uniqueness across time is critical.

**Q: Why can't I add AUTOINCREMENT to a TEXT column?**  
A: SQLite only supports AUTOINCREMENT on INTEGER PRIMARY KEY columns.

### API Questions

**Q: Do I need an API key?**  
A: No, the API is currently open. Add authentication middleware in `server.js` if needed.

**Q: Can I use this API from a React/Vue/Angular app?**  
A: Yes! CORS is enabled. Just make requests to `http://localhost:3000/api`.

**Q: How do I handle errors in API calls?**  
A: All responses include a `success` field. Check it and handle the `error` field if `success: false`.

**Q: Can I upload binary files to SQLite BLOB columns?**  
A: Currently, the API accepts JSON data. For binary data, encode it as Base64 and store it.

**Q: Is there a rate limit?**  
A: No rate limiting by default. Add it via middleware if needed.

## 🐛 Troubleshooting

### Server won't start

**Error: Port 3000 already in use**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=8080 npm start
```

**Error: Cannot find module**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

**Error: Database locked**
- Close all connections to the database
- Restart the server
- Check if another process is accessing the `.db` file

**Table not created**
- Verify column definitions are valid
- Check server console for SQL errors
- Ensure database exists before creating tables

**AUTOINCREMENT not working**
- Make sure the column is INTEGER type
- Ensure it's marked as PRIMARY KEY
- Only one column can be PRIMARY KEY with AUTOINCREMENT

### JSON File Issues

**Property not added to all records**
- Ensure the JSON file contains an array
- Check that all records are objects (not primitives)
- Verify the property name doesn't already exist

**File not found**
- Check `data/json/` directory
- Ensure filename doesn't include `.json` extension in API calls
- Verify file permissions

### API Issues

**CORS errors in browser**
- CORS is enabled by default
- If issues persist, check browser console for specific error
- May need to handle preflight OPTIONS requests for complex requests

**Request body empty**
- Ensure `Content-Type: application/json` header is set
- Verify JSON is valid (use JSON validator)
- Check body size doesn't exceed 50MB limit

**Response timeout**
- Large queries may take time
- Add `limit` parameter to SELECT queries
- Consider pagination for large datasets

## 🎓 Best Practices

### JSON Files
- ✅ Keep records as flat objects when possible
- ✅ Use consistent property names across records
- ✅ Add default values when adding new properties
- ✅ Export regularly as backups
- ❌ Avoid deeply nested structures
- ❌ Don't store binary data directly

### SQLite Databases
- ✅ Always define PRIMARY KEY columns
- ✅ Use AUTOINCREMENT for user-facing IDs
- ✅ Set NOT NULL on required fields
- ✅ Add UNIQUE constraint for unique values (email, username, etc.)
- ✅ Use appropriate data types (INTEGER for numbers, TEXT for strings)
- ✅ Set meaningful default values
- ✅ Use parameterized queries for security
- ❌ Don't use SELECT * in production (specify columns)
- ❌ Avoid concatenating values into SQL queries

### API Usage
- ✅ Handle errors gracefully
- ✅ Use async/await or Promises
- ✅ Implement retry logic for critical operations
- ✅ Validate data before sending to API
- ✅ Use bulk operations when possible
- ❌ Don't make synchronous blocking calls
- ❌ Don't ignore error responses

### Performance
- ✅ Use indexes on frequently queried columns
- ✅ Limit result sets with `limit` parameter
- ✅ Use WHERE clauses to filter data
- ✅ Batch multiple INSERT operations when possible
- ❌ Don't query entire tables if you only need a few records
- ❌ Don't repeatedly query for the same data (cache it)

## 🔧 Configuration Options

### Environment Variables

```bash
# Server port (default: 3000)
PORT=8080

# Node environment
NODE_ENV=production

# Custom data directories
JSON_DATA_DIR=./custom/json
SQLITE_DATA_DIR=./custom/sqlite
```

### Customizing the Server

Edit `server.js` to customize:

```javascript
// Change body size limit
app.use(bodyParser.json({ limit: '100mb' }));

// Add authentication middleware
app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== 'your-secret-key') {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  next();
});

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Change data directories
const jsonManager = new JSONManager('./custom/path/json');
const sqliteManager = new SQLiteManager('./custom/path/sqlite');
```

## 🔒 Security Notes

## 🛠️ Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** sql.js (Pure JavaScript SQLite implementation)
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **API:** RESTful architecture
- **File Upload:** Multer for multipart form data
- **CORS:** Enabled for cross-origin requests

## 📚 Complete API Reference

### Response Format

All API endpoints return JSON responses in the following format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* result data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### JSON API Complete Reference

#### 1. File Management

**List Files**
```bash
curl http://localhost:3000/api/json/list
```
Returns: `{ success: true, files: ["file1", "file2"] }`

**Create File**
```bash
curl -X POST http://localhost:3000/api/json/create \
  -H "Content-Type: application/json" \
  -d '{"filename": "products", "data": []}'
```

**Read File**
```bash
curl http://localhost:3000/api/json/read/products
```
Returns: `{ success: true, data: [...] }`

**Update File (Replace Entire Content)**
```bash
curl -X PUT http://localhost:3000/api/json/update/products \
  -H "Content-Type: application/json" \
  -d '{"data": [{"id": 1, "name": "Product 1"}]}'
```

**Delete File**
```bash
curl -X DELETE http://localhost:3000/api/json/delete/products
```

**Import JSON from Text**
```bash
curl -X POST http://localhost:3000/api/json/import \
  -H "Content-Type: application/json" \
  -d '{"filename": "imported", "data": "[{\"key\": \"value\"}]"}'
```

**Export File (Download)**
```bash
curl http://localhost:3000/api/json/export/products > products.json
```

#### 2. Record Operations

**Insert Record (Add to Array)**
```bash
curl -X POST http://localhost:3000/api/json/record/products \
  -H "Content-Type: application/json" \
  -d '{"name": "New Product", "price": 29.99, "stock": 100}'
```

**Update Record by Index**
```bash
curl -X PUT http://localhost:3000/api/json/record/products/0 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Product", "price": 39.99}'
```
Note: Index is 0-based (0 = first record)

**Delete Record by Index**
```bash
curl -X DELETE http://localhost:3000/api/json/record/products/0
```

#### 3. Property Management

**Add Property to All Records**
```bash
curl -X POST http://localhost:3000/api/json/property/add/products \
  -H "Content-Type: application/json" \
  -d '{"propertyName": "category", "defaultValue": "uncategorized"}'
```
Adds "category" field to all existing records with default value.

**Remove Property from All Records**
```bash
curl -X DELETE http://localhost:3000/api/json/property/remove/products \
  -H "Content-Type: application/json" \
  -d '{"propertyName": "category"}'
```
Removes "category" field from all records.

**Rename Property in All Records**
```bash
curl -X PUT http://localhost:3000/api/json/property/rename/products \
  -H "Content-Type: application/json" \
  -d '{"oldName": "category", "newName": "productCategory"}'
```
Renames "category" to "productCategory" across all records.

### SQLite API Complete Reference

#### 1. Database Management

**List All Databases**
```bash
curl http://localhost:3000/api/sqlite/databases
```
Returns: `{ success: true, databases: ["db1", "db2"] }`

**Create Database**
```bash
curl -X POST http://localhost:3000/api/sqlite/database \
  -H "Content-Type: application/json" \
  -d '{"dbName": "shop"}'
```

**Import Database (Base64)**
```bash
# First, encode your .db file to base64
# On Linux/Mac: base64 mydb.db
# On Windows PowerShell: [Convert]::ToBase64String([IO.File]::ReadAllBytes("mydb.db"))

curl -X POST http://localhost:3000/api/sqlite/import \
  -H "Content-Type: application/json" \
  -d '{"dbName": "imported_db", "data": "BASE64_ENCODED_DATA"}'
```

**Delete Database**
```bash
curl -X DELETE http://localhost:3000/api/sqlite/database/shop
```

#### 2. Table Management

**List Tables**
```bash
curl http://localhost:3000/api/sqlite/tables/shop
```
Returns: `{ success: true, tables: ["products", "orders"] }`

**Create Table with Full Options**
```bash
curl -X POST http://localhost:3000/api/sqlite/table/shop \
  -H "Content-Type: application/json" \
  -d '{
    "tableName": "products",
    "columns": [
      {
        "name": "id",
        "type": "INTEGER",
        "primaryKey": true,
        "autoIncrement": true
      },
      {
        "name": "name",
        "type": "TEXT",
        "notNull": true
      },
      {
        "name": "sku",
        "type": "TEXT",
        "unique": true,
        "notNull": true
      },
      {
        "name": "price",
        "type": "REAL",
        "notNull": true,
        "default": "0.0"
      },
      {
        "name": "stock",
        "type": "INTEGER",
        "default": "0"
      },
      {
        "name": "status",
        "type": "TEXT",
        "default": "'\''active'\''"
      },
      {
        "name": "created_at",
        "type": "TEXT",
        "default": "CURRENT_TIMESTAMP"
      }
    ]
  }'
```

**Column Type Options:**
- `INTEGER` - Whole numbers
- `TEXT` - Strings
- `REAL` - Floating-point numbers
- `BLOB` - Binary data

**Column Constraints:**
- `primaryKey: true` - Primary key column
- `autoIncrement: true` - Auto-increment (INTEGER PRIMARY KEY only)
- `notNull: true` - NOT NULL constraint
- `unique: true` - UNIQUE constraint
- `default: "value"` - Default value
  - Text: `"'value'"` (with quotes)
  - Numbers: `"0"`, `"100.5"`
  - SQL functions: `"CURRENT_TIMESTAMP"`, `"CURRENT_DATE"`, `"CURRENT_TIME"`
  - NULL: `"NULL"`

**Get Table Schema**
```bash
curl http://localhost:3000/api/sqlite/schema/shop/products
```
Returns column information including name, type, nullability, default values, and primary key status.

**Drop Table**
```bash
curl -X DELETE http://localhost:3000/api/sqlite/table/shop/products
```

**Add Column to Existing Table**
```bash
curl -X POST http://localhost:3000/api/sqlite/column/shop/products \
  -H "Content-Type: application/json" \
  -d '{"columnName": "description", "columnType": "TEXT", "defaultValue": null}'
```

#### 3. Record Operations

**Insert Record**
```bash
curl -X POST http://localhost:3000/api/sqlite/record/shop/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Widget", "sku": "WGT-001", "price": 19.99, "stock": 50}'
```
Note: Auto-increment fields are automatically populated.

**Select Records (All)**
```bash
curl http://localhost:3000/api/sqlite/records/shop/products
```

**Select Records with WHERE Clause**
```bash
curl "http://localhost:3000/api/sqlite/records/shop/products?where=price>10&limit=20"
```
Query parameters:
- `where` - SQL WHERE clause (without "WHERE" keyword)
- `limit` - Maximum number of records to return

**Update Records**
```bash
curl -X PUT http://localhost:3000/api/sqlite/records/shop/products \
  -H "Content-Type: application/json" \
  -d '{"updates": {"price": 24.99, "stock": 75}, "where": "sku = '\''WGT-001'\''"}'
```

**Delete Records**
```bash
curl -X DELETE http://localhost:3000/api/sqlite/records/shop/products \
  -H "Content-Type: application/json" \
  -d '{"where": "stock = 0"}'
```

#### 4. Custom SQL Queries

**Execute Custom Query**
```bash
curl -X POST http://localhost:3000/api/sqlite/query/shop \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "SELECT name, price FROM products WHERE price > ? ORDER BY price DESC",
    "params": [10]
  }'
```

**Parameterized Query Examples:**
```bash
# COUNT query
curl -X POST http://localhost:3000/api/sqlite/query/shop \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT COUNT(*) as total FROM products"}'

# JOIN query
curl -X POST http://localhost:3000/api/sqlite/query/shop \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "SELECT o.id, o.total, c.name FROM orders o JOIN customers c ON o.customer_id = c.id",
    "params": []
  }'

# Aggregate query
curl -X POST http://localhost:3000/api/sqlite/query/shop \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT category, AVG(price) as avg_price FROM products GROUP BY category"}'
```

## 💻 Programming Language Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');
const API_BASE = 'http://localhost:3000/api';

// Create JSON file
async function createJSONFile() {
  const response = await axios.post(`${API_BASE}/json/create`, {
    filename: 'customers',
    data: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]
  });
  console.log(response.data);
}

// Add property to all records
async function addEmailField() {
  const response = await axios.post(`${API_BASE}/json/property/add/customers`, {
    propertyName: 'phone',
    defaultValue: ''
  });
  console.log(response.data);
}

// Create SQLite table
async function createTable() {
  const response = await axios.post(`${API_BASE}/sqlite/table/mydb`, {
    tableName: 'orders',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
      { name: 'customer_id', type: 'INTEGER', notNull: true },
      { name: 'total', type: 'REAL', default: '0.0' },
      { name: 'status', type: 'TEXT', default: "'pending'" },
      { name: 'created_at', type: 'TEXT', default: 'CURRENT_TIMESTAMP' }
    ]
  });
  console.log(response.data);
}

// Query SQLite database
async function getOrders() {
  const response = await axios.get(`${API_BASE}/sqlite/records/mydb/orders`, {
    params: { where: 'status="pending"', limit: 10 }
  });
  console.log(response.data.records);
}
```

### Python

```python
import requests
import json

API_BASE = 'http://localhost:3000/api'

# Create JSON file
def create_json_file():
    response = requests.post(f'{API_BASE}/json/create', json={
        'filename': 'products',
        'data': [
            {'id': 1, 'name': 'Product 1', 'price': 29.99},
            {'id': 2, 'name': 'Product 2', 'price': 39.99}
        ]
    })
    print(response.json())

# Read JSON file
def read_json_file():
    response = requests.get(f'{API_BASE}/json/read/products')
    data = response.json()
    return data['data']

# Create SQLite database and table
def setup_database():
    # Create database
    requests.post(f'{API_BASE}/sqlite/database', json={'dbName': 'inventory'})
    
    # Create table
    requests.post(f'{API_BASE}/sqlite/table/inventory', json={
        'tableName': 'items',
        'columns': [
            {'name': 'id', 'type': 'INTEGER', 'primaryKey': True, 'autoIncrement': True},
            {'name': 'name', 'type': 'TEXT', 'notNull': True},
            {'name': 'quantity', 'type': 'INTEGER', 'default': '0'}
        ]
    })

# Insert records
def insert_items():
    items = [
        {'name': 'Item A', 'quantity': 100},
        {'name': 'Item B', 'quantity': 50}
    ]
    
    for item in items:
        requests.post(f'{API_BASE}/sqlite/record/inventory/items', json=item)

# Query with custom SQL
def get_low_stock():
    response = requests.post(f'{API_BASE}/sqlite/query/inventory', json={
        'sql': 'SELECT * FROM items WHERE quantity < ?',
        'params': [20]
    })
    return response.json()['result']
```

### PowerShell

```powershell
$API_BASE = "http://localhost:3000/api"

# Create JSON file
$body = @{
    filename = "users"
    data = @(
        @{ id = 1; name = "Alice"; role = "admin" },
        @{ id = 2; name = "Bob"; role = "user" }
    )
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "$API_BASE/json/create" -Method Post -Body $body -ContentType "application/json"

# Read JSON file
$users = Invoke-RestMethod -Uri "$API_BASE/json/read/users"
$users.data

# Create SQLite table
$tableBody = @{
    tableName = "logs"
    columns = @(
        @{ name = "id"; type = "INTEGER"; primaryKey = $true; autoIncrement = $true },
        @{ name = "message"; type = "TEXT"; notNull = $true },
        @{ name = "level"; type = "TEXT"; default = "'info'" },
        @{ name = "timestamp"; type = "TEXT"; default = "CURRENT_TIMESTAMP" }
    )
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "$API_BASE/sqlite/table/appdb" -Method Post -Body $tableBody -ContentType "application/json"

# Insert record
$record = @{ message = "Application started"; level = "info" } | ConvertTo-Json
Invoke-RestMethod -Uri "$API_BASE/sqlite/record/appdb/logs" -Method Post -Body $record -ContentType "application/json"

# Query records
$logs = Invoke-RestMethod -Uri "$API_BASE/sqlite/records/appdb/logs?limit=10"
$logs.records
```

## 🔧 Advanced Usage Scenarios

### Scenario 1: User Management System

```javascript
// Setup
await axios.post('http://localhost:3000/api/sqlite/database', { dbName: 'userdb' });

await axios.post('http://localhost:3000/api/sqlite/table/userdb', {
  tableName: 'users',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'username', type: 'TEXT', unique: true, notNull: true },
    { name: 'email', type: 'TEXT', unique: true, notNull: true },
    { name: 'status', type: 'TEXT', default: "'active'" },
    { name: 'created_at', type: 'TEXT', default: 'CURRENT_TIMESTAMP' }
  ]
});

// Add users
await axios.post('http://localhost:3000/api/sqlite/record/userdb/users', {
  username: 'john_doe',
  email: 'john@example.com'
});

// Query active users
const activeUsers = await axios.post('http://localhost:3000/api/sqlite/query/userdb', {
  sql: 'SELECT * FROM users WHERE status = ? ORDER BY created_at DESC',
  params: ['active']
});
```

### Scenario 2: Product Inventory with JSON

```javascript
// Create product catalog
await axios.post('http://localhost:3000/api/json/create', {
  filename: 'catalog',
  data: [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 29 }
  ]
});

// Add stock information to all products
await axios.post('http://localhost:3000/api/json/property/add/catalog', {
  propertyName: 'stock',
  defaultValue: 0
});

// Add supplier information
await axios.post('http://localhost:3000/api/json/property/add/catalog', {
  propertyName: 'supplier',
  defaultValue: 'Unknown'
});

// Update specific product
await axios.put('http://localhost:3000/api/json/record/catalog/0', {
  stock: 50,
  supplier: 'TechCorp'
});
```

### Scenario 3: Logging System

```javascript
// Create logs database
await axios.post('http://localhost:3000/api/sqlite/database', { dbName: 'logs' });

await axios.post('http://localhost:3000/api/sqlite/table/logs', {
  tableName: 'app_logs',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'level', type: 'TEXT', notNull: true },
    { name: 'message', type: 'TEXT', notNull: true },
    { name: 'source', type: 'TEXT' },
    { name: 'timestamp', type: 'TEXT', default: 'CURRENT_TIMESTAMP' }
  ]
});

// Log function
async function log(level, message, source = 'app') {
  await axios.post('http://localhost:3000/api/sqlite/record/logs/app_logs', {
    level, message, source
  });
}

// Usage
await log('INFO', 'Application started');
await log('ERROR', 'Database connection failed', 'database');

// Query logs
const errors = await axios.post('http://localhost:3000/api/sqlite/query/logs', {
  sql: 'SELECT * FROM app_logs WHERE level = ? ORDER BY timestamp DESC LIMIT 100',
  params: ['ERROR']
});
```

## 📊 Data Migration Examples

### JSON to SQLite

```javascript
// Read JSON data
const jsonData = await axios.get('http://localhost:3000/api/json/read/customers');
const customers = jsonData.data.data;

// Create SQLite table
await axios.post('http://localhost:3000/api/sqlite/database', { dbName: 'crm' });
await axios.post('http://localhost:3000/api/sqlite/table/crm', {
  tableName: 'customers',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true },
    { name: 'name', type: 'TEXT', notNull: true },
    { name: 'email', type: 'TEXT', unique: true }
  ]
});

// Migrate data
for (const customer of customers) {
  await axios.post('http://localhost:3000/api/sqlite/record/crm/customers', customer);
}
```

### SQLite to JSON

```javascript
// Export from SQLite
const records = await axios.get('http://localhost:3000/api/sqlite/records/crm/customers');

// Import to JSON
await axios.post('http://localhost:3000/api/json/create', {
  filename: 'customers_backup',
  data: records.data.records
});
```

## 🛠️ Technologies Used

## 📝 License

MIT License - feel free to use this project for any purpose!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 💡 Use Cases

- **Development:** Quick data prototyping and testing
- **Internal Tools:** Admin panels and data management dashboards
- **Learning:** Understanding REST APIs and database operations
- **Automation:** Scriptable data operations via API
- **Prototyping:** Rapid application development with persistent storage

## 🎯 Roadmap

- [ ] MongoDB support
- [ ] CSV import/export
- [ ] Data validation rules
- [ ] User authentication
- [ ] Real-time collaboration
- [ ] Data visualization
- [ ] Backup and restore
- [ ] Search and filtering

## 📧 Support

For issues, questions, or suggestions, please open an issue on the project repository.

---

## 📖 Documentation Summary

This README provides complete documentation for:

✅ **Features** - All capabilities of JSON and SQLite management  
✅ **Installation** - Step-by-step setup guide  
✅ **Web Interface** - Complete UI usage instructions with drag & drop  
✅ **API Reference** - Every endpoint with curl examples  
✅ **Code Examples** - JavaScript, Python, and PowerShell samples  
✅ **Advanced Scenarios** - Real-world usage patterns  
✅ **Data Migration** - JSON ↔ SQLite conversion examples  
✅ **FAQ** - Common questions and answers  
✅ **Troubleshooting** - Solutions to common issues  
✅ **Best Practices** - Recommended patterns and anti-patterns  
✅ **Configuration** - Customization options  
✅ **Security** - Important security considerations  

### Additional Resources

- 🌐 **Interactive API Docs:** http://localhost:3000/api-docs.html
- 📝 **API Schema:** http://localhost:3000/api
- 💻 **Web Interface:** http://localhost:3000

### Quick Links

- **Create JSON File:** [JSON Management](#json-files)
- **Create SQLite Table:** [SQLite Management](#sqlite-databases)
- **API Examples:** [Complete API Reference](#-complete-api-reference)
- **Code Samples:** [Programming Examples](#-programming-language-examples)

---

**Version:** 1.0.0  
**Last Updated:** January 2026  
**Node.js Compatibility:** v14+

Made with ❤️ for developers who need quick and easy data management!
