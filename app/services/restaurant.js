const dbService  = require('./index');
const request    = require('request');
const mapConfigs = require('../config/index');

/**
 * @param {request}  req   Request from the EndPoint.
 * @param {response} res   Response from the EndPoint.
 * @param {function} next  Method to call the next Request.
 * @return {json-response} Response sent back as JSON.
 * */
getAllRestaurants = (req, res, next) => {
  let mainQuery = `SELECT *, res.rating,
      (SELECT array_to_json(array_agg(r)) FROM (SELECT * FROM meal WHERE res.id = meal.restaurantId) r) AS meals,
      (SELECT array_to_json(array_agg(r)) FROM (SELECT * FROM review WHERE res.id = review.restaurantId) r) AS reviews
    FROM restaurant res`;
  const query = (req.query.filter) ?
    `${mainQuery} WHERE rating=${req.query.filter}` : mainQuery;
    dbService.db.any(query)
    .then(data => {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'All restaurants Retrieved'
        });
    })
    .catch(err => {
      return next(err);
    });
}

/**
 * @param {request}  req   Request from the EndPoint.
 * @param {response} res   Response from the EndPoint.
 * @param {function} next  Method to call the next Request.
 * @return {json-response} Response sent back as JSON.
 * */
getSingleRestaurant = (req, res, next) => {
  const restID = parseInt(req.params.id);
  dbService.db.one(`SELECT *, res.rating FROM restaurant res WHERE id = ${restID}`)
    .then(data => {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: `Specific restaurant with id ${restID} Retrieved`
        });
    })
    .catch(err => {
      return next(err);
    });
}

/**
 * @param {request}  req   Request from the EndPoint.
 * @param {response} res   Response from the EndPoint.
 * @param {function} next  Method to call the next Request.
 * @return {json-response} Response sent back as JSON.
 * */
createRestaurant = (req, res, next) => {
  const query = `INSERT INTO restaurant
    (
      logo, commercialname, legalname,commercialemail,
      adminnumber, address, lat, lng
    )
    VALUES
    (
      '${req.body.logo}', '${req.body.commercialname}', '${req.body.legalname}',
      '${req.body.commercialemail}', '${req.body.adminnumber}', '${req.body.address}',
      ${req.body.latitude}, ${req.body.longitude}
    )`;
    dbService.db.none(query)
    .then(() => {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one restaurant'
        });
    })
    .catch(err => {
      return next(err);
    });
}

/**
 * @param {request}  req   Request from the EndPoint.
 * @param {response} res   Response from the EndPoint.
 * @param {function} next  Method to call the next Request.
 * @return {json-response} Response sent back as JSON.
 * */
updateRestaurant = (req, res, next) => {
  const csGeneric = new dbService.pgp.helpers.ColumnSet([
    str('logo'), str('commercialname'), str('legalname'), str('commercialemail'),
    str('adminnumber'), str('address'), float('lat'), float('lng')
  ], {table: 'restaurant'});
  const query = dbService.pgp.helpers.update(req.body, csGeneric) + ' WHERE id = ' + parseInt(req.params.id);
  dbService.db.none(query)
    .then(() => {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated Restaurant'
        });
    })
    .catch(err => {
      return next(err);
    });
}

/**
 * @param {request}  req   Request from the EndPoint.
 * @param {response} res   Response from the EndPoint.
 * @param {function} next  Method to call the next Request.
 * @return {json-response} Response sent back as JSON.
 * */
removeRestaurant = (req, res, next) => {
  let restID = parseInt(req.params.id);
  dbService.db.result(`DELETE FROM restaurant WHERE id = ${restID}`)
    .then(result => {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} Restaurant`
        });
    })
    .catch(err => {
      return next(err);
    });
}

/**
 * @param {request}  req   Request from the EndPoint.
 * @param {response} res   Response from the EndPoint.
 * @param {function} next  Method to call the next Request.
 * @return {json-response} Response sent back as JSON.
 * */
getOrders = (req, res, next) => {
  let query = 'SELECT *, r.total_cost FROM rest_order res_ord r';
    dbService.db.any(query)
    .then(data => {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'All Orders Retrieved'
        });
    })
    .catch(err => {
      return next(err);
    });
}

/**
 * @param {request}  req   Request from the EndPoint.
 * @param {response} res   Response from the EndPoint.
 * @param {function} next  Method to call the next Request.
 * @return {json-response} Response sent back as JSON.
 * */
createOrder = (req, res, next) => {
  const user = req.user;
  const data  = {
    orderedby: user.username,
    address: user.address,
    lat: parseFloat(user.lat),
    lng: parseFloat(user.lng),
    restaurantid: req.body.restaurantid
  };
  const cs    = new dbService.pgp.helpers.ColumnSet(['orderedby', 'address', 'lat', 'lng', 'restaurantid'], {table: 'rest_order'});
  const query = dbService.pgp.helpers.insert(data, cs)  + 'RETURNING id';

  let restLocation = {};
  dbService.db.one(`SELECT lat, lng FROM restaurant WHERE id=${req.body.restaurantid}`)
  .then(data => {
    restLocation = data;
  })
  .catch(err => {
    return next(err);
  });

  dbService.db.task(t => {
    return t.one(query)
      .then(order => {
        return t.batch(req.body.meals.map(m=> {
          t.none(`INSERT INTO ordered_meal(quantity, mealid, orderid) VALUES(${m.quantity},${m.id},${order.id})`)
        }));
      })
  })
  .then(() => {
    // Mode is set to car since motorcycle/bicycle are in Beta
    request(`${mapConfigs.MAP_URL}?app_id=${mapConfigs.MAP_APP_ID}&app_code=${mapConfigs.MAP_APP_CODE}&&waypoint0=geo!${parseFloat(restLocation.lat)},${parseFloat(restLocation.lng)}&waypoint1=geo!${parseFloat(user.lat)},${parseFloat(user.lng)}&mode=fastest;car;traffic:enabled`,
    (error, response, body) => {
      if (error){
        return next(error);
      }

      // Access the RabbitMQ callback-based API
      const amqp    = require('amqplib').connect('amqp://rabbit');

      let q         = 'notify';
      let msg       = ' [x] You made a new order in the restaurant';
      const options = {durable: false, noAck: true};

      // Send Notifications Message to Queue
      amqp.then(function(conn) {
        return conn.createChannel();
      }).then(function(ch) {
        return ch.assertQueue(q, options).then(function(ok) {
          return ch.sendToQueue(q, new Buffer(msg));
        });
      }).catch(console.warn);

      // Send Order Message to Queue
      q   = 'order';
      msg = ' [x] An Order was made';
      amqp.then(function(conn) {
        return conn.createChannel();
      }).then(function(ch) {
        return ch.assertQueue(q, options).then(function(ok) {
          return ch.sendToQueue(q, new Buffer(msg));
        });
      }).catch(console.warn);

      const jsonBody = JSON.parse(body);
      res.status(200)
        .json({
          status: 'success',
          message: 'An Order was Succesfully created.',
          data: { ETA: jsonBody.response.route[0].summary.trafficTime/60 + ' Minutes' }
        });
    });
  })
  .catch(err => {
    return next(err);
  });
}


/**
 * 
 * Helpers
 * 
 */

/**
 * Description: Generic way to skip NULL/undefined values for strings
 * 
 * @param {string} col  The table column to parse. 
 * */
function str(col) {
  col = col.toLowerCase();
  return {
      name: col,
      skip: function () {
          var val = this[col];
          return val === null || val === undefined;
      }
  };
}

/**
 * Description: Generic way to skip NULL/undefined values for floats
 * 
 * @param {string} col  The table column to parse. 
 * */
function float(col) {
  col = col.toLowerCase();
  return {
      name: col,
      skip: function () {
          var val = this[col];
          return val === null || val === undefined;
      },
      init: function () {
          return parseFloat(this[col]);
      }
  };
}

module.exports = {
  getAllRestaurants,
  getSingleRestaurant,
  createRestaurant,
  updateRestaurant,
  removeRestaurant,
  getOrders,
  createOrder
};