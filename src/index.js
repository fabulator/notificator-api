// eslint-disable-next-line filenames/match-exported
import { body, query } from 'express-validator/check';
import webpush from 'web-push';
import './../db/migration';
import app from './app';
import { MysqlStoreAdapter } from './adapters';
import { privateWrap, routeWrap } from './helpers';
import { SubscriptionController, NotificationController } from './controllers';
import { MYSQL_SETTINGS, VAPID_KEYS, GCM_API_KEY } from './config';

const mysqlAdapter = new MysqlStoreAdapter(MYSQL_SETTINGS);

webpush.setGCMAPIKey(GCM_API_KEY);
webpush.setVapidDetails(VAPID_KEYS.email, VAPID_KEYS.publicKey, VAPID_KEYS.privateKey);

const subscriptionController = new SubscriptionController(mysqlAdapter);
const notificationController = new NotificationController(mysqlAdapter, webpush);

app.use((err, req, res, next) => {
    res.send({
        error: err.stack,
    });
    next(err);
});

app.put('/subscription', [
    body('namespace').isString(),
    body('subscription.endpoint').isString(),
], routeWrap(subscriptionController.addSubscription.bind(subscriptionController)));

app.delete('/subscription', [
    body('namespace').isString(),
    body('subscription.endpoint').isString(),
], routeWrap(subscriptionController.removeSubscription.bind(subscriptionController)));

app.get('/subscription', [
    query('namespace').isString(),
    query('subscription').isString(),
], routeWrap(subscriptionController.getSubscription.bind(subscriptionController)));

app.get('/notifications', [
    query('endpoint').isString(),
], routeWrap(notificationController.getNotifications.bind(notificationController)));

app.put('/notification', [
    body('namespace').isString(),
    body('notification.title').isString(),
], privateWrap(notificationController.pushNotification.bind(notificationController)));

app.all('*', (req, res) => {
    res.status(404).send({});
});


app.listen(6666);

export default app;
