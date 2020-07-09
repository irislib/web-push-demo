const express = require('express');
const webpush = require('web-push');
const cors = require('cors');

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
const contactEmail = process.env.CONTACT_EMAIL || 'mailto:user@example.com';
const port = process.env.PORT || 3000;

webpush.setVapidDetails(contactEmail, publicVapidKey, privateVapidKey);

function handleSubscription(s) {
  const subscription = s.subscription;
  const payload = JSON.stringify(s.payload);

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
}

function handleNotify(req, res) {
  res.status(201).json({});
  if (req.body.subscriptions) {
    req.body.subscriptions.forEach(handleSubscription);
  } else if (req.body.subscription && req.body.payload) {
    handleSubscription(req.body);
  }
}

const app = express();
app.use(cors());
app.options('*', cors());

app.use(require('body-parser').json());

app.post('/subscribe', handleNotify);
app.post('/notify', handleNotify);

app.use(require('express-static')('./'));

app.listen(port);
