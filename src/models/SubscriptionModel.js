import { BaseModel } from './BaseModel.js';

export class SubscriptionModel extends BaseModel {
  constructor() { super('subscriptions'); }
  async add({ user_id, post_id }) {
    await this.query(`INSERT INTO subscriptions (user_id, post_id) VALUES (:user_id, :post_id)`, { user_id, post_id });
    return true;
  }
  async remove({ user_id, post_id }) {
    await this.query(`DELETE FROM subscriptions WHERE user_id = :user_id AND post_id = :post_id`, { user_id, post_id });
    return true;
  }
  async listForUser(user_id) {
    return this.query(
      `SELECT p.* FROM subscriptions s JOIN posts p ON p.id = s.post_id WHERE s.user_id = :user_id`,
      { user_id }
    );
  }
  async listSubscribers(post_id) {
    return this.query(
      `SELECT u.id, u.login, u.email FROM subscriptions s JOIN users u ON u.id = s.user_id WHERE s.post_id = :post_id`,
      { post_id }
    );
  }
}
export const Subscriptions = new SubscriptionModel();
