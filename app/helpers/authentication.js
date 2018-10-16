const jwt    = require('jwt-simple');
const moment = require('moment');
const config = require('../config/index');

/**
 * Description: Create a JWT with User information encoded.
 * 
 * @param {object} user User to enconde to the payload.
 * @return {jwt}        JWT used to use private endpoints.
 * */
exports.createToken = function(user) {
	const payload = {
    sub: user,
    iat: moment().unix(),
    exp: moment().add(1, "days").unix(),
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
};


/**
 * Description: Gets User information decoded from JWT.
 * 
 * @param {request}  req   Request intercepted from the EndPoint.
 * @param {response} res   Response intercepted from the EndPoint.
 * @param {function} next  Method to call the next Request.
 * @return {object}  User information from JWT.
 * */
exports.ensureAuthenticated = function(req, res, next) {
  if(!req.headers.authorization) {
    return res
      .status(403)
      .send({message: 'Not Authorizated'});
  }
  
  const token = req.headers.authorization.split(' ')[1];
  const payload = jwt.decode(token, config.TOKEN_SECRET);
  
  if(payload.exp <= moment().unix()) {
  	return res
     	.status(401)
        .send({message: 'Session expired'});
  }
  
  req.user = payload.sub;
  next();
}