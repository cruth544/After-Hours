var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
      name                : { first : String,
                              last  : String
                            },
      username            : String,
      email               : String,
      password            : String,
      profile_image_url   : String,
      reviews             : [ restaurantName : String,
                              body           : String,
                              rating         : Number
                            ],
      restaurants         : [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }]

})


module.exports = mongoose.model('User', userSchema)
