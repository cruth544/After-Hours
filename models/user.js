var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = Schema({
      name                : { first : String,
                              last  : String
                            },
      username            : String,
      email               : String,
      password            : String,
      profile_image_url   : String,
      reviews             : [{ restaurant : { type  : Schema.Types.ObjectId,
                                              ref   : 'Restaurant'},
                               body  : String,
                               rating: Number
                            }],
      restaurants         : [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }]

})


module.exports = mongoose.model('User', userSchema)
