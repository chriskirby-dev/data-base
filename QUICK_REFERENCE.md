npm start# 📋 Data Manager - Quick Reference Card

## 🚀 Quick Start
```bash
npm install
npm start
# Open http://localhost:3000
```

## 📄 JSON API Cheat Sheet

### File Operations
```bash
# List files
GET /api/json/list

# Create file
POST /api/json/create
{"filename": "myfile", "data": []}

# Read file
GET /api/json/read/:filename

# Update file
PUT /api/json/update/:filename
{"data": [...]}

# Delete file
DELETE /api/json/delete/:filename

# Export file
GET /api/json/export/:filename
```

### Record Operations
```bash
# Add record
POST /api/json/record/:filename
{"key": "value"}

# Update record (by index)
PUT /api/json/record/:filename/:index
{"key": "new value"}

# Delete record
DELETE /api/json/record/:filename/:index
```

### Property Operations
```bash
# Add property to all
POST /api/json/property/add/:filename
{"propertyName": "email", "defaultValue": ""}

# Remove property from all
DELETE /api/json/property/remove/:filename
{"propertyName": "email"}

# Rename property in all
PUT /api/json/property/rename/:filename
{"oldName": "email", "newName": "emailAddress"}
```

## 🗄️ SQLite API Cheat Sheet

### Database Operations
```bash
# List databases
GET /api/sqlite/databases

# Create database
POST /api/sqlite/database
{"dbName": "mydb"}

# Delete database
DELETE /api/sqlite/database/:dbName

# List tables
GET /api/sqlite/tables/:dbName
```

### Table Operations
```bash
# Create table
POST /api/sqlite/table/:dbName
{
  "tableName": "users",
  "columns": [
    {"name": "id", "type": "INTEGER", "primaryKey": true, "autoIncrement": true},
    {"name": "name", "type": "TEXT", "notNull": true},
    {"name": "email", "type": "TEXT", "unique": true},
    {"name": "status", "type": "TEXT", "default": "'active'"},
    {"name": "created_at", "type": "TEXT", "default": "CURRENT_TIMESTAMP"}
  ]
}

# Drop table
DELETE /api/sqlite/table/:dbName/:tableName

# Get schema
GET /api/sqlite/schema/:dbName/:tableName

# Add column
POST /api/sqlite/column/:dbName/:tableName
{"columnName": "phone", "columnType": "TEXT", "defaultValue": null}
```

### Record Operations
```bash
# Insert record
POST /api/sqlite/record/:dbName/:tableName
{"name": "John", "email": "john@example.com"}

# Select all records
GET /api/sqlite/records/:dbName/:tableName

# Select with filter
GET /api/sqlite/records/:dbName/:tableName?where=id>10&limit=20

# Update records
PUT /api/sqlite/records/:dbName/:tableName
{"updates": {"status": "active"}, "where": "id = 1"}

# Delete records
DELETE /api/sqlite/records/:dbName/:tableName
{"where": "status = 'inactive'"}
```

### Custom Queries
```bash
# Execute SQL
POST /api/sqlite/query/:dbName
{"sql": "SELECT * FROM users WHERE age > ?", "params": [18]}
```

## 🎯 Column Types

### SQLite Types
- **INTEGER** - Whole numbers (can be PRIMARY KEY with AUTOINCREMENT)
- **TEXT** - Strings and text data
- **REAL** - Floating-point numbers
- **BLOB** - Binary data

### Column Constraints
```json
{
  "name": "column_name",
  "type": "INTEGER|TEXT|REAL|BLOB",
  "primaryKey": true,           // PRIMARY KEY
  "autoIncrement": true,        // AUTOINCREMENT (INTEGER PK only)
  "notNull": true,              // NOT NULL
  "unique": true,               // UNIQUE
  "default": "'value'"          // DEFAULT value
}
```

### Default Value Examples
```json
// Text (needs quotes)
"default": "'active'"

// Numbers
"default": "0"
"default": "100.5"

// SQL Functions
"default": "CURRENT_TIMESTAMP"
"default": "CURRENT_DATE"
"default": "CURRENT_TIME"

// NULL
"default": "NULL"
```

## 💻 Code Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');
const API = 'http://localhost:3000/api';

// Create JSON file
await axios.post(`${API}/json/create`, {
  filename: 'users',
  data: [{id: 1, name: 'John'}]
});

// Create SQLite table
await axios.post(`${API}/sqlite/table/mydb`, {
  tableName: 'products',
  columns: [
    {name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true},
    {name: 'name', type: 'TEXT', notNull: true},
    {name: 'price', type: 'REAL', default: '0.0'}
  ]
});

// Insert record
await axios.post(`${API}/sqlite/record/mydb/products`, {
  name: 'Widget',
  price: 29.99
});

// Query
const result = await axios.post(`${API}/sqlite/query/mydb`, {
  sql: 'SELECT * FROM products WHERE price > ?',
  params: [20]
});
```

### Python
```python
import requests

API = 'http://localhost:3000/api'

# Create JSON file
requests.post(f'{API}/json/create', json={
    'filename': 'products',
    'data': [{'id': 1, 'name': 'Product 1'}]
})

# Read JSON
response = requests.get(f'{API}/json/read/products')
data = response.json()['data']

# Create table
requests.post(f'{API}/sqlite/table/mydb', json={
    'tableName': 'orders',
    'columns': [
        {'name': 'id', 'type': 'INTEGER', 'primaryKey': True, 'autoIncrement': True},
        {'name': 'total', 'type': 'REAL', 'default': '0.0'}
    ]
})

# Query
result = requests.post(f'{API}/sqlite/query/mydb', json={
    'sql': 'SELECT * FROM orders WHERE total > ?',
    'params': [100]
})
```

### PowerShell
```powershell
$API = "http://localhost:3000/api"

# Create JSON file
$body = @{filename='users'; data=@(@{id=1;name='John'})} | ConvertTo-Json -Depth 3
Invoke-RestMethod -Uri "$API/json/create" -Method Post -Body $body -ContentType "application/json"

# Create table
$table = @{
    tableName='logs'
    columns=@(
        @{name='id';type='INTEGER';primaryKey=$true;autoIncrement=$true},
        @{name='message';type='TEXT';notNull=$true},
        @{name='timestamp';type='TEXT';default='CURRENT_TIMESTAMP'}
    )
} | ConvertTo-Json -Depth 3
Invoke-RestMethod -Uri "$API/sqlite/table/logdb" -Method Post -Body $table -ContentType "application/json"
```

### cURL (Bash)
```bash
API="http://localhost:3000/api"

# Create JSON
curl -X POST "$API/json/create" \
  -H "Content-Type: application/json" \
  -d '{"filename":"test","data":[{"id":1}]}'

# Create table
curl -X POST "$API/sqlite/table/mydb" \
  -H "Content-Type: application/json" \
  -d '{
    "tableName":"users",
    "columns":[
      {"name":"id","type":"INTEGER","primaryKey":true,"autoIncrement":true},
      {"name":"name","type":"TEXT","notNull":true}
    ]
  }'

# Insert record
curl -X POST "$API/sqlite/record/mydb/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe"}'

# Query
curl -X POST "$API/sqlite/query/mydb" \
  -H "Content-Type: application/json" \
  -d '{"sql":"SELECT * FROM users WHERE id = ?","params":[1]}'
```

## 🎓 Common Patterns

### Pattern: User Management
```bash
# 1. Create database
POST /api/sqlite/database {"dbName": "app"}

# 2. Create users table
POST /api/sqlite/table/app
{
  "tableName": "users",
  "columns": [
    {"name": "id", "type": "INTEGER", "primaryKey": true, "autoIncrement": true},
    {"name": "username", "type": "TEXT", "unique": true, "notNull": true},
    {"name": "email", "type": "TEXT", "unique": true, "notNull": true},
    {"name": "status", "type": "TEXT", "default": "'active'"},
    {"name": "created_at", "type": "TEXT", "default": "CURRENT_TIMESTAMP"}
  ]
}

# 3. Add user
POST /api/sqlite/record/app/users
{"username": "john", "email": "john@example.com"}

# 4. Query active users
POST /api/sqlite/query/app
{"sql": "SELECT * FROM users WHERE status = 'active'"}
```

### Pattern: Product Catalog (JSON)
```bash
# 1. Create catalog
POST /api/json/create
{"filename": "catalog", "data": [{"id": 1, "name": "Product 1", "price": 29.99}]}

# 2. Add stock field to all products
POST /api/json/property/add/catalog
{"propertyName": "stock", "defaultValue": 0}

# 3. Add new product
POST /api/json/record/catalog
{"id": 2, "name": "Product 2", "price": 39.99, "stock": 50}

# 4. Update product
PUT /api/json/record/catalog/0
{"stock": 100}
```

### Pattern: Logging System
```bash
# 1. Create logs database
POST /api/sqlite/database {"dbName": "logs"}

# 2. Create logs table
POST /api/sqlite/table/logs
{
  "tableName": "app_logs",
  "columns": [
    {"name": "id", "type": "INTEGER", "primaryKey": true, "autoIncrement": true},
    {"name": "level", "type": "TEXT", "notNull": true},
    {"name": "message", "type": "TEXT", "notNull": true},
    {"name": "timestamp", "type": "TEXT", "default": "CURRENT_TIMESTAMP"}
  ]
}

# 3. Insert log
POST /api/sqlite/record/logs/app_logs
{"level": "ERROR", "message": "Connection failed"}

# 4. Query recent errors
POST /api/sqlite/query/logs
{"sql": "SELECT * FROM app_logs WHERE level = 'ERROR' ORDER BY timestamp DESC LIMIT 10"}
```

## 🔧 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed",
  "data": { /* results */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description"
}
```

## 🌐 Access Points

- **Web Interface:** http://localhost:3000
- **API Docs:** http://localhost:3000/api-docs.html
- **API Schema:** http://localhost:3000/api
- **API Base:** http://localhost:3000/api

## 🐛 Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Use different port
PORT=8080 npm start
```

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database locked
- Restart server
- Close all database connections
- Check no other process is using the .db file

---

**For complete documentation, see README.md**

**Interactive Docs:** http://localhost:3000/api-docs.html
