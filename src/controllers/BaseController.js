// @flow
import { validationResult } from 'express-validator/check';
import type { StoreAdapter } from './../adapters/MysqlStoreAdapter';

export default class BaseController {
    storeAdapter: StoreAdapter;

    constructor(adapter: StoreAdapter) {
        this.storeAdapter = adapter;
    }

    handleErrors(req: express$Request, res: express$Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        return null;
    }
}
