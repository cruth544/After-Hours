var mongoose = require('mongoose')

var restaurantSchema = mongoose.Schema({
      name     : String,
      image_uri: String,
      hours    :{
              monday: { monday: String,
                        scheduled: Boolean,
                        time: [{
                                startTime: Number,
                                endTime  : Number
                        }]
              },
              tuesday: {
                        scheduled: Boolean,
                        time: [{
                                startTime: Number,
                                endTime  : Number
                        }]
              },
              wednesday: {
                        scheduled: Boolean,
                        time: [{
                                startTime: Number,
                                endTime  : Number
                        }]
              },
              thursday: {
                        scheduled: Boolean,
                        time: [{
                                startTime: Number,
                                endTime  : Number
                        }]
              },
              friday: {
                        scheduled: Boolean,
                        time: [{
                                startTime: Number,
                                endTime  : Number
                        }]
              },
              saturday: {
                        scheduled: Boolean,
                        time: [{
                                startTime: Number,
                                endTime  : Number
                        }]
              },
              sunday: {
                        scheduled: Boolean,
                        time: [{
                                startTime: Number,
                                endTime  : Number
                        }]
              }

      },
      drinks : Boolean,
      food   : Boolean,
      contact: { website: String,
                 phone  : String,
                 address: String,
                 yelpUrl: String
                }
})



module.exports = mongoose.model('Restaurant', restaurantSchema)
