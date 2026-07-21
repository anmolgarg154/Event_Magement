import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../service/db.js";

class User {
    static tableName = "users";

    constructor(data = {}) {
        Object.assign(this, data);
        this._id = this._id ?? this.id ?? null;
        this.id = this.id ?? this._id ?? null;
        this._originalPassword = data.password ?? null;
    }

    static async findById(id) {
        const [rows] = await query(`SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`, [id]);
        if (!rows.length) return null;
        return new this(rows[0]);
    }

    static async findOne(filter = {}) {
        if (filter.$or && Array.isArray(filter.$or) && filter.$or.length) {
            const clauses = [];
            const values = [];

            for (const item of filter.$or) {
                if (item && typeof item === "object") {
                    const [key, value] = Object.entries(item)[0] ?? [];
                    if (key && value !== undefined && value !== null) {
                        const column = key === "_id" ? "id" : key;
                        clauses.push(`${column} = ?`);
                        values.push(value);
                    }
                }
            }

            if (!clauses.length) return null;
            const [rows] = await query(`SELECT * FROM ${this.tableName} WHERE ${clauses.join(" OR ")} LIMIT 1`, values);
            if (!rows.length) return null;
            return new this(rows[0]);
        }

        const entries = Object.entries(filter).filter(([, value]) => value !== undefined && value !== null);
        if (!entries.length) return null;

        const whereClauses = entries.map(([key]) => `${key === "_id" ? "id" : key} = ?`);
        const values = entries.map(([, value]) => value);
        const [rows] = await query(`SELECT * FROM ${this.tableName} WHERE ${whereClauses.join(" AND ")} LIMIT 1`, values);

        if (!rows.length) return null;
        return new this(rows[0]);
    }

    static async create(data = {}) {
        const user = new this(data);
        await user.save({ validateBeforeSave: true });
        return user;
    }

    static async findByIdAndUpdate(id, update = {}, options = {}) {
        const user = await this.findById(id);
        if (!user) return null;

        if (update?.$unset?.refreshToken !== undefined) {
            await query(`UPDATE ${this.tableName} SET refreshToken = NULL WHERE id = ?`, [id]);
            user.refreshToken = null;
        }

        return options?.new === false ? null : user;
    }

    async select(fields = "") {
        const rawFields = typeof fields === "string" ? fields.split(" ").filter(Boolean) : [];
        const include = rawFields.filter((field) => !field.startsWith("-"));
        const exclude = rawFields.filter((field) => field.startsWith("-")).map((field) => field.slice(1));

        const selected = {};
        for (const [key, value] of Object.entries(this)) {
            if (key.startsWith("_")) continue;
            if (include.length && !include.includes(key)) continue;
            if (exclude.includes(key)) continue;
            selected[key] = value;
        }

        Object.assign(this, selected);
        return this;
    }

    async save(options = {}) {
        let hashedPassword = this.password;
        if (this.password !== undefined && options.validateBeforeSave !== false) {
            if (!this.id || this.password !== this._originalPassword) {
                hashedPassword = await bcrypt.hash(this.password, 10);
            }
        }

        const payload = {};
        if (this.username !== undefined) payload.username = this.username;
        if (this.email !== undefined) payload.email = this.email;
        if (hashedPassword !== undefined) payload.password = hashedPassword;
        if (this.address !== undefined) payload.address = this.address;
        if (this.status !== undefined) payload.status = this.status || "Inactive";
        if (this.refreshToken !== undefined) payload.refreshToken = this.refreshToken ?? null;

        const columns = Object.keys(payload);
        if (!columns.length) {
            if (this.id) return this;
            throw new Error("No data provided for save().");
        }

        const values = columns.map((key) => payload[key]);

        if (this.id) {
            const assignments = columns.map((key) => `${key} = ?`).join(", ");
            await query(
                `UPDATE ${this.constructor.tableName} SET ${assignments} WHERE id = ?`,
                [...values, this.id]
            );
            this._originalPassword = hashedPassword;
            return this;
        }

        const placeholders = columns.map(() => "?").join(", ");
        const sql = `INSERT INTO ${this.constructor.tableName} (${columns.join(", ")}) VALUES (${placeholders})`;
        const [result] = await query(sql, values);
        this.id = result.insertId;
        this._id = result.insertId;
        this._originalPassword = hashedPassword;
        return this;
    }

    async isPasswordCorrect(password) {
        return bcrypt.compare(password, this.password);
    }

    generateAccessToken() {
        return jwt.sign(
            {
                _id: this._id,
                email: this.email,
                username: this.username,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            }
        );
    }

    generateRefreshToken() {
        return jwt.sign(
            {
                _id: this._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            }
        );
    }
}

export default User;