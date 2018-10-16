const amqp    = require('amqplib').connect('amqp://rabbit');
const options = {durable: false, noAck: true};

/**
 * @param {request}  req   Request from the EndPoint.
 * @param {response} res   Response from the EndPoint.
 * @param {function} next  Method to call the next Request.
 * @return {json-response} Response sent back as JSON.
 * */
orderMessage = (req, res, next) => {
  amqp.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue('order', options).then(function(ok) {
      return ch.consume('order', function(msg) {
        if (msg !== null) {
          console.log(msg.content.toString());
          ch.ack(msg);
        }
      });
    });
  }).catch(console.warn);
  res.status(200)
    .json({
      status: 'success',
      message: 'Order Messages has been Sent'
    });
};

/**
 * @param {request}  req   Request from the EndPoint.
 * @param {response} res   Response from the EndPoint.
 * @param {function} next  Method to call the next Request.
 * @return {json-response} Response sent back as JSON.
 * */
notificationMessage = (req, res, next) => {
	amqp.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue('notify', options).then(function(ok) {
      return ch.consume('notify', function(msg) {
        if (msg !== null) {
          console.log(msg.content.toString());
          ch.ack(msg);
        }
      });
    });
  }).catch(console.warn);
  res.status(200)
    .json({
      status: 'success',
      message: 'Notification Messages has been Sent'
    });
};

module.exports = {
  orderMessage,
  notificationMessage,
};