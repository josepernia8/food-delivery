const express = require('express');
const router = express.Router();
const auth = require('../helpers/authentication');
const restaurantService = require('../services/restaurant');

// GET home page.
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Restaurant Delivery API' });
});

router.get('/restaurants', auth.ensureAuthenticated, restaurantService.getAllRestaurants);
router.get('/restaurants/:id', auth.ensureAuthenticated, restaurantService.getSingleRestaurant);
router.post('/restaurants', auth.ensureAuthenticated, restaurantService.createRestaurant);
router.put('/restaurants/:id', auth.ensureAuthenticated, restaurantService.updateRestaurant);
router.delete('/restaurants/:id', auth.ensureAuthenticated, restaurantService.removeRestaurant);
router.get('/orders', auth.ensureAuthenticated, restaurantService.getOrders);
router.post('/order/create', auth.ensureAuthenticated, restaurantService.createOrder);

module.exports = router;
