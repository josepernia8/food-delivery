const dbService = require('./index');
const auth = require('../helpers/authentication');

/**
 * Description: List all users registered in the database.
 * 
 * @param {request}  req   Request from the EndPoint.
 * @param {response} res   Response from the EndPoint.
 * @param {function} next  Method to call the next Request.
 * @return {json-response} Response sent back as JSON.
 * */
getAllUsers = (req, res, next) => {
  const query = 'SELECT * FROM users';
  dbService.db.any(query)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'All users Retrieved'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

/**
 * Description: Login to the application and sent back a JWT
 * 
 * @param {request}  req   Request from the EndPoint.
 * @param {response} res   Response from the EndPoint.
 * @param {function} next  Method to call the next Request.
 * @return {json-response} Response sent back as JSON.
 * */
userLogin = (req, res, next) => {
  const query = `SELECT * FROM users WHERE username='${req.body.username}' AND password='${req.body.password}'`;
  dbService.db.one(query)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: {Token: auth.createToken(data)},
          message: 'User Logged In'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllUsers,
  userLogin,
};