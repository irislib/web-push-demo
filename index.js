const express = require('express');
const webpush = require('web-push');

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
const contactEmail = process.env.CONTACT_EMAIL || 'mailto:user@example.com';
const port = process.env.PORT || 3000;

webpush.setVapidDetails(contactEmail, publicVapidKey, privateVapidKey);

const app = express();

app.use(require('body-parser').json());

app.post('/subscribe', (req, res) => {
  const subscription = req.body.subscription;
  res.status(201).json({});
  const payload = JSON.stringify(req.body.payload);

  console.log(req.body);

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
});

app.use(require('express-static')('./'));

app.listen(port);
