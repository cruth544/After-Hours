var mongoose = require('mongoose')

var restaurantSchema = mongoose.Schema({
      name   : String,
      image  : String,
      hours  :{
              monday: {
                        time: [{
                                startTime: Number,
                                endTime  : Number
                        }]
              },
              tuesday:{
                        time: [{
                                startTime: Number,
                                endTime  : Number
                        }]
              },
              wednesday: {
                        time: [{
                                startTime: Number,
                                endTime  : Number
                        }]
              },
              thursday: {
                        time: [{
                                startTime: Number,
                                endTime  : Number
                        }]
              },
              friday: {
                        time: [{
                                startTime: Number,
                                endTime  : Number
                        }]
              },
              saturday: {
                        time: [{
                                startTime: Number,
                                endTime  : Number
                        }]
              },
              sunday: {
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
