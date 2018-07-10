// @flow
import BaseController from './BaseController';

export default class SubscriptionController extends BaseController {
    async addSubscription(req: express$Request, res: express$Response) {
        if (this.handleErrors(req, res)) {
            return;
        }

        // $FlowFixMe
        const { subscription, namespace } = req.body;

        this.storeAdapter.addSubscription(subscription, namespace);

        res.json({ });
    }

    async removeSubscription(req: express$Request, res: express$Response) {
        if (this.handleErrors(req, res)) {
            return;
        }

        // $FlowFixMe
        const { subscription, namespace } = req.body;

        this.storeAdapter.removeSubscription(subscription, namespace);

        res.json({ });
    }

    async getSubscription(req: express$Request, res: express$Response) {
        if (this.handleErrors(req, res)) {
            return;
        }

        const { subscription, namespace } = req.query;

        // $FlowFixMe
        const foundSubscription = await this.storeAdapter.getSubscription(JSON.parse(subscription), namespace);

        if (!foundSubscription) {
            res.status(404).send({});
            return;
        }

        res.json(foundSubscription);
    }
}
