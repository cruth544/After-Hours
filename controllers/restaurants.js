var Restaurant = require("../models/restaurant");

module.exports = {

    show: function (req, res, next) {
      Restaurant.findOne({ name: String(req.params.name)}, function (err, restaurant) {
        res.render('restaurants/show', {restaurant: restaurant})
      })

    }
}
