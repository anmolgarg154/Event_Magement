import { query } from "../service/db.js";

class Event {
    static tableName = "events";

    constructor(data = {}) {
        Object.assign(this, data);
        this._id = this._id ?? this.id ?? null;
        this.id = this.id ?? this._id ?? null;
    }

    static async findById(id) {
        const [rows] = await query(`SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`, [id]);
        if (!rows.length) return null;
        return new this(rows[0]);
    }

    static async findAll() {
        const [rows] = await query(`SELECT * FROM ${this.tableName} ORDER BY date DESC`);
        return rows.map((row) => new this(row));
    }

    static async findByUser(userId) {
        const [rows] = await query(`SELECT * FROM ${this.tableName} WHERE createdBy = ? ORDER BY date DESC`, [userId]);
        return rows.map((row) => new this(row));
    }

    static async create(data = {}) {
        const event = new this(data);
        await event.save();
        return event;
    }

    static async deleteById(id) {
        await query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
    }

    async save() {
        const payload = {};
        if (this.name !== undefined) payload.name = this.name;
        if (this.description !== undefined) payload.description = this.description;
        if (this.date !== undefined) payload.date = this.date;
        if (this.venue !== undefined) payload.venue = this.venue;
        if (this.category !== undefined) payload.category = this.category;
        if (this.bannerImage !== undefined) payload.bannerImage = this.bannerImage;
        if (this.createdBy !== undefined) payload.createdBy = this.createdBy;

        const columns = Object.keys(payload);
        if (!columns.length) {
            throw new Error("No event data provided");
        }

        const values = columns.map((key) => payload[key]);

        if (this.id) {
            const assignments = columns.map((key) => `${key} = ?`).join(", ");
            await query(`UPDATE ${this.constructor.tableName} SET ${assignments} WHERE id = ?`, [...values, this.id]);
            return this;
        }

        const placeholders = columns.map(() => "?").join(", ");
        const sql = `INSERT INTO ${this.constructor.tableName} (${columns.join(", ")}) VALUES (${placeholders})`;
        const [result] = await query(sql, values);
        this.id = result.insertId;
        this._id = result.insertId;
        return this;
    }
}

export default Event;
