var Restaurant = require("../models/restaurants");

module.exports = {

    show: function (req, res, next) {
      Restaurant.findOne({ name: String(req.params.name)}, function (err, restaurant) {
        res.render('restaurants/show', {restaurant: restaurant})
      })

    }
}
