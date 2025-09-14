import { BaseModel } from './BaseModel.js';

export class FavoriteModel extends BaseModel {
    constructor() {
        super('favorites');
    }

    async add({ user_id, post_id }) {
        // первичный ключ (user_id, post_id) — дубликаты не вставятся
        await this.query(
            `INSERT IGNORE INTO favorites (user_id, post_id) VALUES (:user_id, :post_id)`,
            { user_id, post_id }
        );
        // возвращаем признак — было ли добавлено
        const rows = await this.query(
            `SELECT 1 FROM favorites WHERE user_id = :user_id AND post_id = :post_id`,
            { user_id, post_id }
        );
        return rows.length > 0;
    }

    async remove({ user_id, post_id }) {
        await this.query(
            `DELETE FROM favorites WHERE user_id = :user_id AND post_id = :post_id`,
            { user_id, post_id }
        );
        return true;
    }

    async listByUser({ user_id, limit = 20, offset = 0 }) {
        return this.query(
            `SELECT p.*
         FROM favorites f
         JOIN posts p ON p.id = f.post_id
        WHERE f.user_id = :user_id
        ORDER BY p.publish_date DESC
        LIMIT :limit OFFSET :offset`,
            { user_id, limit: +limit, offset: +offset }
        );
    }

    async isFavorited({ user_id, post_id }) {
        const rows = await this.query(
            `SELECT 1 FROM favorites WHERE user_id = :user_id AND post_id = :post_id`,
            { user_id, post_id }
        );
        return rows.length > 0;
    }
}

export const Favorites = new FavoriteModel();
