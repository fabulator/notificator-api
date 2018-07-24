// @flow
import mysql from 'promise-mysql';

type Subscription = {
    endpoint: string,
}

type DbSubscription = {
    id: number,
    endpoint: string,
    body: Object,
    last_viewed: ?string,
}

type Notification = {
    title: string,
}

export interface StoreAdapter {
    isSubscribed(subscription: Subscription, namespace: string): Promise<boolean>;
    addSubscription(subscription: Subscription, namespace: string): Promise<typeof undefined>;
    removeSubscription(subscription: Subscription, namespace: string): Promise<typeof undefined>;
    getSubscription(subscription: Subscription, namespace: string): Promise<?DbSubscription>;
    getSubscriptions(namespace: string): Promise<Array<DbSubscription>>;
    getNotifications(endpoint: string): Promise<Array<Notification>>;
    addNotificationToQueue(notificationId: number, namespace: string): Promise<*>;
    addNotification(notification: Object): Promise<Object>;
}

export default class MysqlStoreAdapter implements StoreAdapter {
    connection: *;
    settings: Object;

    constructor(settings: Object) {
        this.connection = null;
        this.settings = settings;
    }

    async _query(...parameters: *) {
        if (!this.connection) {
            this.connection = mysql.createConnection(this.settings);
        }

        return (await this.connection).query(...parameters);
    }

    async getSubscription(subscription: Subscription, namespace: string): Promise<?DbSubscription> {
        const result = await this._query(
            'SELECT * FROM subscribers WHERE endpoint = ? AND namespace = ?',
            [subscription.endpoint, namespace],
        );

        if (result.length === 0) {
            return null;
        }

        return {
            ...result[0],
            body: JSON.parse(result[0].body),
        };
    }

    async isSubscribed(subscription: Subscription, namespace: string): Promise<boolean> {
        return !!await this.getSubscription(subscription, namespace);
    }

    async addSubscription(subscription: Subscription, namespace: string): Promise<typeof undefined> {
        if (!await this.isSubscribed(subscription, namespace)) {
            const { endpoint, ...data } = subscription;
            await this._query('INSERT INTO subscribers SET ?', {
                endpoint,
                namespace,
                body: JSON.stringify(data),
            });
        }
    }

    async removeSubscription(subscription: Subscription, namespace: string): Promise<typeof undefined> {
        await this._query('DELETE FROM subscribers WHERE endpoint = ? AND namespace = ?', [subscription.endpoint, namespace]);
    }

    getSubscriptions(namespace: string): Promise<Array<DbSubscription>> {
        return this._query('SELECT * FROM subscribers WHERE namespace = ?', namespace);
    }

    async addNotification(notification: Object): Promise<Object> {
        const { insertId } = await this._query('INSERT INTO notifications (body) VALUES (?)', JSON.stringify(notification));
        return {
            ...notification,
            id: insertId,
        };
    }

    async getNotifications(endpoint: string): Promise<Array<Notification>> {
        const results = await this._query('SELECT notifications.body as notification, queue.id FROM subscribers ' +
            'JOIN queue ON queue.subscriber_id = subscribers.id JOIN notifications ON queue.notification_id = notifications.id ' +
            'WHERE endpoint = ? AND viewed = 0', endpoint);

        if (results.length > 0) {
            await this._query(`UPDATE queue SET viewed = 1 WHERE id IN(${results.map(item => item.id).join(',')})`);
        }

        return results.map(item => JSON.parse(item.notification));
    }


    async addNotificationToQueue(notificationId: number, namespace: string): Promise<*> {
        const subscriptions = await this.getSubscriptions(namespace);

        return this._query(`INSERT INTO queue (notification_id, subscriber_id) VALUES ${
            subscriptions.map((subscription) => {
                return `(${notificationId}, ${subscription.id})`;
            }).join(',')
        }`);
    }
}
