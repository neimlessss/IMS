// Required packages
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // Your MySQL password here
    database: 'IMS'
};

const pool = mysql.createPool(dbConfig);

// Secret key for JWT (JSON Web Tokens)
const JWT_SECRET = 'neimlesss-001'; // Change this to a secure random string

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.locationId = decoded.locationId;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { locationName, password } = req.body;

        // Get location from database
        const [locations] = await pool.execute(
            'SELECT * FROM locations WHERE name = ?',
            [locationName]
        );

        if (locations.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const location = locations[0];

        // Compare password
        const validPassword = await bcrypt.compare(password, location.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { locationId: location.id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Log activity
        await pool.execute(
            'INSERT INTO activity_log (id, location_id, action_type, action_details) VALUES (UUID(), ?, ?, ?)',
            [location.id, 'LOGIN', `${locationName} logged in`]
        );

        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Register new location
app.post('/api/register', async (req, res) => {
    try {
        const { locationName, password } = req.body;

        // Check if location already exists
        const [existing] = await pool.execute(
            'SELECT * FROM locations WHERE name = ?',
            [locationName]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Location already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new location
        await pool.execute(
            'INSERT INTO locations (id, name, password_hash) VALUES (UUID(), ?, ?)',
            [locationName, hashedPassword]
        );

        res.json({ message: 'Location registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully!');
        connection.release();
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
}

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    testConnection();
});


// require('dotenv').config();
// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const PDFDocument = require('pdfkit');
// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
// const moment = require('moment');
// const path = require('path');

// const app = express();

// // Security middleware
// app.use(helmet());
// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:5000',
//     methods: ['GET', 'POST', 'PATCH', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Rate limiting
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);
// app.use(express.json());

// // Database configuration
// const pool = mysql.createPool({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME || 'IMS',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// // Email configuration
// const transporter = nodemailer.createTransport({
//     service: process.env.EMAIL_SERVICE || 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });

// // JWT middleware
// const authenticateToken = async (req, res, next) => {
//     try {
//         const authHeader = req.headers['authorization'];
//         const token = authHeader && authHeader.split(' ')[1];
        
//         if (!token) {
//             return res.status(401).json({ error: 'No token provided' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.locationId = decoded.locationId;
//         next();
//     } catch (error) {
//         return res.status(403).json({ error: 'Invalid token' });
//     }
// };

// // Authentication endpoints
// app.post('/api/login', async (req, res) => {
//     try {
//         const { locationName, password } = req.body;

//         const [locations] = await pool.execute(
//             'SELECT * FROM locations WHERE name = ?',
//             [locationName]
//         );

//         if (locations.length === 0) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }

//         const location = locations[0];
//         const validPassword = await bcrypt.compare(password, location.password_hash);
        
//         if (!validPassword) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }

//         const token = jwt.sign(
//             { locationId: location.id },
//             process.env.JWT_SECRET,
//             { expiresIn: '24h' }
//         );

//         await pool.execute(
//             'INSERT INTO activity_log (id, location_id, action_type, action_details, created_at) VALUES (UUID(), ?, ?, ?, NOW())',
//             [location.id, 'LOGIN', `${locationName} logged in`]
//         );

//         res.json({ token, locationName: location.name });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// app.post('/api/register', async (req, res) => {
//     try {
//         const { locationName, password } = req.body;

//         const [existing] = await pool.execute(
//             'SELECT * FROM locations WHERE name = ?',
//             [locationName]
//         );

//         if (existing.length > 0) {
//             return res.status(400).json({ error: 'Location already exists' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
        
//         await pool.execute(
//             'INSERT INTO locations (id, name, password_hash, created_at) VALUES (UUID(), ?, ?, NOW())',
//             [locationName, hashedPassword]
//         );

//         res.json({ message: 'Location registered successfully' });
//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Item management endpoints
// app.get('/api/items', authenticateToken, async (req, res) => {
//     try {
//         const [items] = await pool.execute(
//             'SELECT * FROM items WHERE location_id = ?',
//             [req.locationId]
//         );
//         res.json(items);
//     } catch (error) {
//         console.error('Error fetching items:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// app.post('/api/items', authenticateToken, async (req, res) => {
//     try {
//         const { name, category, purchase_price, quantity } = req.body;
        
//         const prefix = category === 'IT Equipment' ? 'ICIT' :
//                       category === 'Furniture' ? 'ICFU' :
//                       category === 'Stationery' ? 'ICST' : 'ICEQ';
        
//         const [existing] = await pool.execute(
//             'SELECT id FROM items WHERE id LIKE ? ORDER BY id DESC LIMIT 1',
//             [`${prefix}%`]
//         );
        
//         const newNumber = existing.length > 0 ? 
//             parseInt(existing[0].id.slice(-4)) + 1 : 1;
//         const itemId = `${prefix}${String(newNumber).padStart(4, '0')}`;

//         await pool.execute(
//             `INSERT INTO items (id, name, category, purchase_price, quantity, status, location_id, date_added, last_updated) 
//              VALUES (?, ?, ?, ?, ?, 'active', ?, NOW(), NOW())`,
//             [itemId, name, category, purchase_price, quantity, req.locationId]
//         );

//         await pool.execute(
//             'INSERT INTO activity_log (id, location_id, item_id, action_type, action_details, created_at) VALUES (UUID(), ?, ?, ?, ?, NOW())',
//             [req.locationId, itemId, 'ADD_ITEM', `Added new ${category}: ${name}`]
//         );

//         res.json({ message: 'Item added successfully', itemId });
//     } catch (error) {
//         console.error('Error adding item:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// app.patch('/api/items/:itemId/status', authenticateToken, async (req, res) => {
//     try {
//         const { itemId } = req.params;
//         const { status } = req.body;
        
//         const [items] = await pool.execute(
//             'SELECT * FROM items WHERE id = ? AND location_id = ?',
//             [itemId, req.locationId]
//         );
        
//         if (items.length === 0) {
//             return res.status(404).json({ error: 'Item not found' });
//         }

//         await pool.execute(
//             'UPDATE items SET status = ?, last_updated = NOW() WHERE id = ?',
//             [status, itemId]
//         );

//         await pool.execute(
//             'INSERT INTO activity_log (id, location_id, item_id, action_type, action_details, created_at) VALUES (UUID(), ?, ?, ?, ?, NOW())',
//             [req.locationId, itemId, 'UPDATE_STATUS', `Updated status to ${status}`]
//         );

//         res.json({ message: 'Item status updated successfully' });
//     } catch (error) {
//         console.error('Error updating item status:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Lending endpoints
// app.get('/api/lending', authenticateToken, async (req, res) => {
//     try {
//         const [history] = await pool.execute(
//             `SELECT lh.*, 
//                 i.name as item_name,
//                 fl.name as from_location_name,
//                 tl.name as to_location_name
//             FROM lending_history lh
//             JOIN items i ON lh.item_id = i.id
//             JOIN locations fl ON lh.from_location_id = fl.id
//             JOIN locations tl ON lh.to_location_id = tl.id
//             WHERE lh.from_location_id = ? OR lh.to_location_id = ?
//             ORDER BY lh.lend_date DESC`,
//             [req.locationId, req.locationId]
//         );
//         res.json(history);
//     } catch (error) {
//         console.error('Error fetching lending history:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// app.post('/api/lending', authenticateToken, async (req, res) => {
//     const connection = await pool.getConnection();
//     try {
//         await connection.beginTransaction();
        
//         const { itemId, toLocationId } = req.body;
        
//         const [items] = await connection.execute(
//             'SELECT * FROM items WHERE id = ? AND location_id = ? AND status = "active"',
//             [itemId, req.locationId]
//         );
        
//         if (items.length === 0) {
//             await connection.rollback();
//             return res.status(404).json({ error: 'Item not found or not available' });
//         }

//         await connection.execute(
//             `INSERT INTO lending_history 
//             (id, item_id, from_location_id, to_location_id, lend_date, status) 
//             VALUES (UUID(), ?, ?, ?, NOW(), 'pending')`,
//             [itemId, req.locationId, toLocationId]
//         );

//         await connection.execute(
//             'UPDATE items SET status = "lent", location_id = ?, last_updated = NOW() WHERE id = ?',
//             [toLocationId, itemId]
//         );

//         await connection.execute(
//             `INSERT INTO activity_log 
//             (id, location_id, item_id, action_type, action_details, created_at) 
//             VALUES (UUID(), ?, ?, 'LEND_ITEM', ?, NOW())`,
//             [req.locationId, itemId, `Item lent to location ${toLocationId}`]
//         );

//         await connection.commit();
//         res.json({ message: 'Item lent successfully' });
//     } catch (error) {
//         await connection.rollback();
//         console.error('Error lending item:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     } finally {
//         connection.release();
//     }
// });

// // Activity log endpoints
// app.get('/api/activity', authenticateToken, async (req, res) => {
//     try {
//         const { startDate, endDate } = req.query;
//         let query = `
//             SELECT al.*, i.name as item_name, l.name as location_name
//             FROM activity_log al
//             LEFT JOIN items i ON al.item_id = i.id
//             LEFT JOIN locations l ON al.location_id = l.id
//             WHERE al.location_id = ?
//         `;
//         const params = [req.locationId];

//         if (startDate && endDate) {
//             query += ' AND al.created_at BETWEEN ? AND ?';
//             params.push(startDate, endDate);
//         }

//         query += ' ORDER BY al.created_at DESC';
//         const [activities] = await pool.execute(query, params);
//         res.json(activities);
//     } catch (error) {
//         console.error('Error fetching activity log:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Report generation endpoint
// app.post('/api/reports', authenticateToken, async (req, res) => {
//     try {
//         const { startDate, endDate, email } = req.body;

//         // Fetch report data
//         const [items] = await pool.execute(
//             `SELECT * FROM items WHERE location_id = ? 
//              AND date_added BETWEEN ? AND ?`,
//             [req.locationId, startDate, endDate]
//         );

//         const [activities] = await pool.execute(
//             `SELECT * FROM activity_log WHERE location_id = ? 
//              AND created_at BETWEEN ? AND ?`,
//             [req.locationId, startDate, endDate]
//         );

//         // Generate PDF
//         const doc = new PDFDocument();
//         let buffers = [];
//         doc.on('data', buffers.push.bind(buffers));
//         doc.on('end', async () => {
//             let pdfData = Buffer.concat(buffers);
            
//             // Send email with PDF attachment
//             const mailOptions = {
//                 from: process.env.EMAIL_USER,
//                 to: email,
//                 subject: 'Inventory Report',
//                 text: 'Please find attached the inventory report for the specified period.',
//                 attachments: [{
//                     filename: 'inventory-report.pdf',
//                     content: pdfData
//                 }]
//             };

//             await transporter.sendMail(mailOptions);
//             res.json({ message: 'Report generated and sent successfully' });
//         });

//         // Generate PDF content
//         doc.fontSize(25).text('Inventory Report', { align: 'center' });
//         doc.moveDown();
//         doc.fontSize(12).text(`Period: ${startDate} to ${endDate}`);
//         doc.moveDown();

//         // Add items table
//         doc.fontSize(16).text('Inventory Items');
//         items.forEach(item => {
//             doc.fontSize(10).text(`${item.id} - ${item.name} - ${item.category} - ₦${item.purchase_price}`);
//         });

//         doc.moveDown();

//         // Add activity log
//         doc.fontSize(16).text('Activity Log');
//         activities.forEach(activity => {
//             doc.fontSize(10).text(`${moment(activity.created_at).format('YYYY-MM-DD HH:mm')} - ${activity.action_type} - ${activity.action_details}`);
//         });

//         doc.end();
//     } catch (error) {
//         console.error('Error generating report:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Serve static files in production
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, 'public')));
// }

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Something broke!' });
// });

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//     // Test database connection
//     pool.getConnection()
//         .then(connection => {
//             console.log('Database connected successfully!');
//             connection.release();
//         })
//         .catch(error => {
//             console.error('Error connecting to database:', error);
//         });
// });