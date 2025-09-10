import { BaseModel } from './BaseModel.js';

export class FavoriteModel extends BaseModel {
  constructor() { super('favorites'); }
  async add({ user_id, post_id }) {
    await this.query(`INSERT INTO favorites (user_id, post_id) VALUES (:user_id, :post_id)`, { user_id, post_id });
    return true;
  }
  async remove({ user_id, post_id }) {
    await this.query(`DELETE FROM favorites WHERE user_id = :user_id AND post_id = :post_id`, { user_id, post_id });
    return true;
  }
  async listForUser(user_id) {
    return this.query(
      `SELECT p.* FROM favorites f JOIN posts p ON p.id = f.post_id WHERE f.user_id = :user_id`,
      { user_id }
    );
  }
}
export const Favorites = new FavoriteModel();
