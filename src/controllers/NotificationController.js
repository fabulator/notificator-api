// @flow
import BaseController from './BaseController';
import type { StoreAdapter } from './../adapters/MysqlStoreAdapter';

export default class NotificationController extends BaseController {
    webpush: *;

    constructor(adapter: StoreAdapter, webpush: *) {
        super(adapter);
        this.webpush = webpush;
    }

    async pushNotification(req: express$Request, res: express$Response) {
        // $FlowFixMe
        const { namespace, notification } = req.body;

        const subscriptions = await this.storeAdapter.getSubscriptions(namespace);

        const { id } = await this.storeAdapter.addNotification(notification);
        await this.storeAdapter.addNotificationToQueue(id, namespace);

        const responses = await Promise.all(subscriptions.map(async (subscriber) => {
            try {
                const body = subscriber.body ? JSON.parse(subscriber.body) : null;
                const haveKeys = body && body.keys;
                return await this.webpush.sendNotification({
                    endpoint: subscriber.endpoint,
                    ...(haveKeys ? { keys: body.keys } : {}),
                }, haveKeys ? JSON.stringify(notification) : null);
            } catch (error) {
                console.log(error);
                return error;
            }
        }));

        res.json(responses);
    }

    async getNotifications(req: express$Request, res: express$Response) {
        if (this.handleErrors(req, res)) {
            return;
        }

        const { endpoint } = req.query;

        // $FlowFixMe
        const notifications = await this.storeAdapter.getNotifications(endpoint);

        if (!notifications) {
            res.status(404).send({});
            return;
        }

        res.json(notifications);
    }
}
