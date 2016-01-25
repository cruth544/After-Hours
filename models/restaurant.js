var mongoose = require('mongoose')

var restaurantSchema = mongoose.Schema({
      name          : String,
      startTime     : Number,
      endTime       : Number,
      drinks        : Boolean,
      food          : Boolean,
      contact       : {

                      }

})



module.exports = mongoose.model('Restaurant', restaurantSchema)
