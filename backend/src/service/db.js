import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config({ path: "./.env" });

let pool = null;

const createTables = async () => {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                address VARCHAR(255) NULL,
                status VARCHAR(20) DEFAULT 'Inactive',
                refreshToken TEXT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT NULL,
                date DATETIME NOT NULL,
                venue VARCHAR(255) NULL,
                category VARCHAR(100) NULL,
                bannerImage VARCHAR(255) NULL,
                createdBy INT NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
    } finally {
        connection.release();
    }
};

const connectDB = async () => {
    if (pool) return pool;

    try {
        pool = mysql.createPool({
            host: process.env.MYSQL_HOST || "localhost",
            port: Number(process.env.MYSQL_PORT || 3306),
            user: process.env.MYSQL_USER || "root",
            password: process.env.MYSQL_PASSWORD || "",
            database: process.env.MYSQL_DATABASE || "assignment",
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        const connection = await pool.getConnection();
        try {
            await connection.ping();
            await createTables();
        } finally {
            connection.release();
        }

        console.log("MySQL connected successfully");
        return pool;
    } catch (error) {
        console.log("MySQL connection failed", error);
        throw error;
    }
};

export const query = async (sql, params = []) => {
    const activePool = pool ?? (await connectDB());
    return activePool.execute(sql, params);
};

export const getPool = () => pool;

export default connectDB;