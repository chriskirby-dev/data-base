# 🔥 Data Manager - API Examples Collection

Complete working examples for all API endpoints.

## Table of Contents
- [JSON Examples](#json-examples)
- [SQLite Examples](#sqlite-examples)
- [Real-World Scenarios](#real-world-scenarios)
- [Integration Examples](#integration-examples)

---

## JSON Examples

### Example 1: Basic JSON CRUD

```javascript
const axios = require('axios');
const API = 'http://localhost:3000/api';

// CREATE: New JSON file with initial data
const createFile = async () => {
  const response = await axios.post(`${API}/json/create`, {
    filename: 'employees',
    data: [
      { id: 1, name: 'John Doe', department: 'IT', salary: 75000 },
      { id: 2, name: 'Jane Smith', department: 'HR', salary: 65000 },
      { id: 3, name: 'Bob Johnson', department: 'IT', salary: 80000 }
    ]
  });
  console.log('Created:', response.data);
};

// READ: Get all data
const readFile = async () => {
  const response = await axios.get(`${API}/json/read/employees`);
  console.log('Data:', response.data.data);
  return response.data.data;
};

// UPDATE: Modify entire file
const updateFile = async () => {
  const data = await readFile();
  // Give everyone a 10% raise
  data.forEach(emp => emp.salary *= 1.1);
  
  const response = await axios.put(`${API}/json/update/employees`, { data });
  console.log('Updated:', response.data);
};

// DELETE: Remove file
const deleteFile = async () => {
  const response = await axios.delete(`${API}/json/delete/employees`);
  console.log('Deleted:', response.data);
};

// Run all operations
(async () => {
  await createFile();
  await readFile();
  await updateFile();
  // await deleteFile(); // Uncomment to delete
})();
```

### Example 2: JSON Property Management

```javascript
const axios = require('axios');
const API = 'http://localhost:3000/api';

// Setup: Create file
await axios.post(`${API}/json/create`, {
  filename: 'products',
  data: [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 29 },
    { id: 3, name: 'Keyboard', price: 79 }
  ]
});

// ADD property: Add 'stock' field to all products
await axios.post(`${API}/json/property/add/products`, {
  propertyName: 'stock',
  defaultValue: 0
});

// ADD property: Add 'category' field
await axios.post(`${API}/json/property/add/products`, {
  propertyName: 'category',
  defaultValue: 'Electronics'
});

// RENAME property: Change 'category' to 'productCategory'
await axios.put(`${API}/json/property/rename/products`, {
  oldName: 'category',
  newName: 'productCategory'
});

// REMOVE property: Remove 'productCategory'
await axios.delete(`${API}/json/property/remove/products`, {
  data: { propertyName: 'productCategory' }
});

// Check result
const result = await axios.get(`${API}/json/read/products`);
console.log(result.data.data);
// Each product now has: id, name, price, stock
```

### Example 3: JSON Record Operations

```javascript
const axios = require('axios');
const API = 'http://localhost:3000/api';

// Setup
await axios.post(`${API}/json/create`, {
  filename: 'tasks',
  data: []
});

// INSERT: Add multiple records
const tasks = [
  { id: 1, title: 'Design UI', status: 'done', priority: 'high' },
  { id: 2, title: 'Write tests', status: 'in-progress', priority: 'medium' },
  { id: 3, title: 'Deploy', status: 'pending', priority: 'high' }
];

for (const task of tasks) {
  await axios.post(`${API}/json/record/tasks`, task);
}

// UPDATE: Change status of first task (index 0)
await axios.put(`${API}/json/record/tasks/0`, {
  status: 'completed',
  completedAt: new Date().toISOString()
});

// DELETE: Remove last task (index 2)
await axios.delete(`${API}/json/record/tasks/2`);

// Read final result
const result = await axios.get(`${API}/json/read/tasks`);
console.log('Final tasks:', result.data.data);
```

---

## SQLite Examples

### Example 1: Database and Table Creation

```javascript
const axios = require('axios');
const API = 'http://localhost:3000/api';

// Step 1: Create database
await axios.post(`${API}/sqlite/database`, {
  dbName: 'company'
});

// Step 2: Create employees table with all constraint types
await axios.post(`${API}/sqlite/table/company`, {
  tableName: 'employees',
  columns: [
    {
      name: 'id',
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true
    },
    {
      name: 'employee_id',
      type: 'TEXT',
      unique: true,
      notNull: true
    },
    {
      name: 'first_name',
      type: 'TEXT',
      notNull: true
    },
    {
      name: 'last_name',
      type: 'TEXT',
      notNull: true
    },
    {
      name: 'email',
      type: 'TEXT',
      unique: true,
      notNull: true
    },
    {
      name: 'department',
      type: 'TEXT',
      default: "'General'"
    },
    {
      name: 'salary',
      type: 'REAL',
      default: '0.0'
    },
    {
      name: 'status',
      type: 'TEXT',
      default: "'active'"
    },
    {
      name: 'hire_date',
      type: 'TEXT',
      default: 'CURRENT_DATE'
    },
    {
      name: 'created_at',
      type: 'TEXT',
      default: 'CURRENT_TIMESTAMP'
    }
  ]
});

// Step 3: Verify table schema
const schema = await axios.get(`${API}/sqlite/schema/company/employees`);
console.log('Table schema:', schema.data.schema);
```

### Example 2: CRUD Operations

```javascript
const axios = require('axios');
const API = 'http://localhost:3000/api';

// CREATE: Insert employees
const employees = [
  { employee_id: 'E001', first_name: 'John', last_name: 'Doe', email: 'john@company.com', department: 'IT', salary: 75000 },
  { employee_id: 'E002', first_name: 'Jane', last_name: 'Smith', email: 'jane@company.com', department: 'HR', salary: 65000 },
  { employee_id: 'E003', first_name: 'Bob', last_name: 'Johnson', email: 'bob@company.com', department: 'IT', salary: 80000 }
];

for (const emp of employees) {
  await axios.post(`${API}/sqlite/record/company/employees`, emp);
}

// READ: Get all employees
const allEmployees = await axios.get(`${API}/sqlite/records/company/employees`);
console.log('All employees:', allEmployees.data.records);

// READ: Get IT department employees only
const itEmployees = await axios.get(`${API}/sqlite/records/company/employees`, {
  params: { where: "department='IT'" }
});
console.log('IT employees:', itEmployees.data.records);

// UPDATE: Give raises to IT department
await axios.put(`${API}/sqlite/records/company/employees`, {
  updates: { salary: 'salary * 1.1' }, // 10% raise
  where: "department = 'IT'"
});

// DELETE: Remove inactive employees
await axios.delete(`${API}/sqlite/records/company/employees`, {
  data: { where: "status = 'inactive'" }
});
```

### Example 3: Complex Queries

```javascript
const axios = require('axios');
const API = 'http://localhost:3000/api';

// Query 1: Count employees by department
const countByDept = await axios.post(`${API}/sqlite/query/company`, {
  sql: 'SELECT department, COUNT(*) as count FROM employees GROUP BY department'
});
console.log('Count by department:', countByDept.data.result);

// Query 2: Average salary by department
const avgSalary = await axios.post(`${API}/sqlite/query/company`, {
  sql: 'SELECT department, AVG(salary) as avg_salary FROM employees GROUP BY department ORDER BY avg_salary DESC'
});
console.log('Average salary:', avgSalary.data.result);

// Query 3: Find high earners
const highEarners = await axios.post(`${API}/sqlite/query/company`, {
  sql: 'SELECT first_name, last_name, salary FROM employees WHERE salary > ? ORDER BY salary DESC',
  params: [70000]
});
console.log('High earners:', highEarners.data.result);

// Query 4: Recent hires
const recentHires = await axios.post(`${API}/sqlite/query/company`, {
  sql: "SELECT * FROM employees WHERE hire_date >= date('now', '-30 days') ORDER BY hire_date DESC"
});
console.log('Recent hires:', recentHires.data.result);

// Query 5: Search by name
const search = await axios.post(`${API}/sqlite/query/company`, {
  sql: "SELECT * FROM employees WHERE first_name LIKE ? OR last_name LIKE ?",
  params: ['%John%', '%John%']
});
console.log('Search results:', search.data.result);
```

### Example 4: Table Relationships

```javascript
const axios = require('axios');
const API = 'http://localhost:3000/api';

// Create departments table
await axios.post(`${API}/sqlite/table/company`, {
  tableName: 'departments',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'name', type: 'TEXT', unique: true, notNull: true },
    { name: 'budget', type: 'REAL', default: '0.0' }
  ]
});

// Create projects table with foreign key (using custom SQL)
await axios.post(`${API}/sqlite/query/company`, {
  sql: `CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department_id INTEGER NOT NULL,
    budget REAL DEFAULT 0.0,
    status TEXT DEFAULT 'planning',
    FOREIGN KEY (department_id) REFERENCES departments(id)
  )`
});

// Insert departments
await axios.post(`${API}/sqlite/record/company/departments`, {
  name: 'IT', budget: 500000
});
await axios.post(`${API}/sqlite/record/company/departments`, {
  name: 'HR', budget: 200000
});

// Insert projects
await axios.post(`${API}/sqlite/record/company/projects`, {
  name: 'Website Redesign', department_id: 1, budget: 50000, status: 'active'
});
await axios.post(`${API}/sqlite/record/company/projects`, {
  name: 'Recruitment Drive', department_id: 2, budget: 30000, status: 'active'
});

// JOIN query
const projectsWithDept = await axios.post(`${API}/sqlite/query/company`, {
  sql: `SELECT p.name as project, d.name as department, p.budget, p.status 
        FROM projects p 
        JOIN departments d ON p.department_id = d.id 
        WHERE p.status = ?`,
  params: ['active']
});
console.log('Active projects:', projectsWithDept.data.result);
```

---

## Real-World Scenarios

### Scenario 1: E-Commerce Product Management

```javascript
const axios = require('axios');
const API = 'http://localhost:3000/api';

// Setup database
await axios.post(`${API}/sqlite/database`, { dbName: 'ecommerce' });

// Create products table
await axios.post(`${API}/sqlite/table/ecommerce`, {
  tableName: 'products',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'sku', type: 'TEXT', unique: true, notNull: true },
    { name: 'name', type: 'TEXT', notNull: true },
    { name: 'description', type: 'TEXT' },
    { name: 'price', type: 'REAL', notNull: true },
    { name: 'cost', type: 'REAL', default: '0.0' },
    { name: 'stock', type: 'INTEGER', default: '0' },
    { name: 'category', type: 'TEXT', default: "'Uncategorized'" },
    { name: 'status', type: 'TEXT', default: "'active'" },
    { name: 'created_at', type: 'TEXT', default: 'CURRENT_TIMESTAMP' },
    { name: 'updated_at', type: 'TEXT', default: 'CURRENT_TIMESTAMP' }
  ]
});

// Add products
const products = [
  { sku: 'LAP-001', name: 'Laptop Pro 15"', price: 1299.99, cost: 800, stock: 25, category: 'Electronics' },
  { sku: 'MOU-001', name: 'Wireless Mouse', price: 29.99, cost: 15, stock: 150, category: 'Accessories' },
  { sku: 'KEY-001', name: 'Mechanical Keyboard', price: 129.99, cost: 70, stock: 50, category: 'Accessories' }
];

for (const product of products) {
  await axios.post(`${API}/sqlite/record/ecommerce/products`, product);
}

// Business Operations

// 1. Get low stock products
const lowStock = await axios.post(`${API}/sqlite/query/ecommerce`, {
  sql: 'SELECT * FROM products WHERE stock < ? AND status = ?',
  params: [30, 'active']
});
console.log('Low stock:', lowStock.data.result);

// 2. Calculate profit margins
const profitMargins = await axios.post(`${API}/sqlite/query/ecommerce`, {
  sql: `SELECT sku, name, price, cost, 
        (price - cost) as profit, 
        ROUND(((price - cost) / cost * 100), 2) as margin_percent 
        FROM products 
        ORDER BY margin_percent DESC`
});
console.log('Profit margins:', profitMargins.data.result);

// 3. Update stock after sale
const sellProduct = async (sku, quantity) => {
  await axios.post(`${API}/sqlite/query/ecommerce`, {
    sql: 'UPDATE products SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE sku = ?',
    params: [quantity, sku]
  });
};
await sellProduct('LAP-001', 2);

// 4. Get inventory value by category
const inventoryValue = await axios.post(`${API}/sqlite/query/ecommerce`, {
  sql: `SELECT category, 
        COUNT(*) as product_count, 
        SUM(stock) as total_units,
        ROUND(SUM(stock * price), 2) as retail_value,
        ROUND(SUM(stock * cost), 2) as cost_value
        FROM products 
        GROUP BY category`
});
console.log('Inventory value:', inventoryValue.data.result);
```

### Scenario 2: Task Management System

```javascript
const axios = require('axios');
const API = 'http://localhost:3000/api';

// Setup
await axios.post(`${API}/sqlite/database`, { dbName: 'taskmanager' });

// Users table
await axios.post(`${API}/sqlite/table/taskmanager`, {
  tableName: 'users',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'username', type: 'TEXT', unique: true, notNull: true },
    { name: 'email', type: 'TEXT', unique: true, notNull: true },
    { name: 'created_at', type: 'TEXT', default: 'CURRENT_TIMESTAMP' }
  ]
});

// Tasks table
await axios.post(`${API}/sqlite/table/taskmanager`, {
  tableName: 'tasks',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'title', type: 'TEXT', notNull: true },
    { name: 'description', type: 'TEXT' },
    { name: 'status', type: 'TEXT', default: "'pending'" },
    { name: 'priority', type: 'TEXT', default: "'medium'" },
    { name: 'assigned_to', type: 'INTEGER' },
    { name: 'due_date', type: 'TEXT' },
    { name: 'created_at', type: 'TEXT', default: 'CURRENT_TIMESTAMP' },
    { name: 'updated_at', type: 'TEXT', default: 'CURRENT_TIMESTAMP' }
  ]
});

// Add users
await axios.post(`${API}/sqlite/record/taskmanager/users`, {
  username: 'alice', email: 'alice@example.com'
});
await axios.post(`${API}/sqlite/record/taskmanager/users`, {
  username: 'bob', email: 'bob@example.com'
});

// Add tasks
const tasks = [
  { title: 'Design homepage', status: 'in-progress', priority: 'high', assigned_to: 1, due_date: '2026-02-01' },
  { title: 'Write documentation', status: 'pending', priority: 'medium', assigned_to: 2, due_date: '2026-02-05' },
  { title: 'Setup CI/CD', status: 'pending', priority: 'high', assigned_to: 1, due_date: '2026-01-28' }
];

for (const task of tasks) {
  await axios.post(`${API}/sqlite/record/taskmanager/tasks`, task);
}

// Queries

// 1. Get user's tasks
const aliceTasks = await axios.post(`${API}/sqlite/query/taskmanager`, {
  sql: `SELECT t.*, u.username 
        FROM tasks t 
        JOIN users u ON t.assigned_to = u.id 
        WHERE u.username = ?`,
  params: ['alice']
});

// 2. Overdue tasks
const overdueTasks = await axios.post(`${API}/sqlite/query/taskmanager`, {
  sql: `SELECT t.*, u.username 
        FROM tasks t 
        JOIN users u ON t.assigned_to = u.id 
        WHERE t.due_date < date('now') AND t.status != 'completed'`
});

// 3. Task summary by user
const taskSummary = await axios.post(`${API}/sqlite/query/taskmanager`, {
  sql: `SELECT u.username, 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN t.status = 'in-progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) as pending
        FROM users u
        LEFT JOIN tasks t ON u.id = t.assigned_to
        GROUP BY u.id`
});

console.log('Task summary:', taskSummary.data.result);
```

---

## Integration Examples

### Express.js Integration

```javascript
const express = require('express');
const axios = require('axios');

const app = express();
const DATA_API = 'http://localhost:3000/api';

app.use(express.json());

// Get all products
app.get('/products', async (req, res) => {
  try {
    const response = await axios.get(`${DATA_API}/json/read/products`);
    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product
app.post('/products', async (req, res) => {
  try {
    const response = await axios.post(`${DATA_API}/json/record/products`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders from SQLite
app.get('/orders', async (req, res) => {
  try {
    const response = await axios.get(`${DATA_API}/sqlite/records/shop/orders`);
    res.json(response.data.records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(4000, () => console.log('App running on port 4000'));
```

### React Integration

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000/api';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const response = await axios.get(`${API}/json/read/products`);
    setProducts(response.data.data);
  };

  const addProduct = async (product) => {
    await axios.post(`${API}/json/record/products`, product);
    loadProducts();
  };

  const updateProduct = async (index, updates) => {
    await axios.put(`${API}/json/record/products/${index}`, updates);
    loadProducts();
  };

  return (
    <div>
      <h1>Products</h1>
      {products.map((product, index) => (
        <div key={index}>
          <span>{product.name} - ${product.price}</span>
          <button onClick={() => updateProduct(index, { price: product.price * 1.1 })}>
            Increase Price
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

**For complete API documentation, see README.md or visit http://localhost:3000/api-docs.html**
