var Restaurant = require('../models/restaurant');
var restaurantsController = require('../controllers/restaurants')


exports.seedRestaurants = function seedRestaurants(){
  Restaurant.find({}).exec(function (err, collection) {
    if (collection.length === 0) {
      Restaurant.create({

        name: 'Bar',
        image_uri: 'http://bar-ama.com/img/super_nachos_v1.jpg',
        hours: {
            monday:{
                scheduled: true,
                time:[{
                    startTime: 17.5,
                    endTime  : 19.0
                    },
                    {
                    startTime: 22.0,
                    endTime  : 23.0
                }]
            },
            tuesday:{
                scheduled: true,
                time:[{
                    startTime: 12.5,
                    endTime  : 19.0
                  },
                  {
                    startTime: 22.0,
                    endTime  : 23.0
                }]
            },
            wednesday:{
                scheduled: true,
                time:[{
                    startTime: 17.5,
                    endTime  : 19.0
                  },
                  {
                    startTime: 22.0,
                    endTime  : 23.0
                }]
            },
            thursday:{
                scheduled: true,
                time:[{
                    startTime: 17.5,
                    endTime  : 19.0
                  },
                  {
                    startTime: 22.0,
                    endTime  : 23.0
                  }]
            },
            friday:{
                scheduled: true,
                time:[{
                    startTime: 17.5,
                    endTime  : 19.0
                },
                {
                    startTime: 22.0,
                    endTime  : 0.0
                }]
            },
            saturday:{
                scheduled: true,
                time:[{
                    startTime: 22.0,
                    endTime  : 0.0
                }]
            },
            sunday:{
                scheduled: true,
                time:[{
                    startTime: 15.0,
                    endTime  : 17.5
                }]
            }
        },
        drinks : true,
        food   : true,
        contact:{
                  phone  : '(213) 687-7000',
                  address: '118 W. 4th St Los Angeles, CA 90013',
                  website: 'http://bar-ama.com/media/snh.pdf',
                  yelpUrl: 'http://www.yelp.com/biz/bar-ama-los-angeles'
                }
      })

      Restaurant.create({
        name: 'Izakaya Fu-ga',
        image_uri: 'http://www-tc.pbs.org/food/files/2012/09/Sushi-5-1.jpg',
        hours:{
            monday:{
                  scheduled: true,
                  time: [{
                        startTime: 14.0,
                        endTime  : 18.0
                  }]
            },
            tuesday:{
                  scheduled: true,
                  time: [{
                        startTime: 14.0,
                        endTime  : 18.0
                  }]
            },
            wednesday:{
                  scheduled: true,
                  time: [{
                        startTime: 14.0,
                        endTime  : 18.0
                  }]
            },
            thursday:{
                  scheduled: true,
                  time: [{
                        startTime: 14.0,
                        endTime  : 18.0
                  }]
            },
            friday:{
                  scheduled: true,
                  time:[{
                        startTime: 14.0,
                        endTime  : 18.0
                  }]
            },
            saturday:{
                  scheduled: false,
                  time:[{
                        startTime: null,
                        endTime: null
                  }]
            },
            sunday: {
                  scheduled: false,
                  time:[{
                        startTime: null,
                        endTime: null
                  }]
            }
        },
        drinks : true,
        food   : true,
        contact:{
                  phone  : '(213) 625-1722',
                  address: '111 S San Pedro St Los Angeles, CA 90012',
                  website: 'http://www.izakayafu-ga.com/menus.php',
                  yelpUrl: 'http://www.yelp.com/biz/izakaya-fu-ga-los-angeles'
                }

      })

      Restaurant.create({
        name: 'EMC Seafood',
        image_uri: 'http://www.emcseafood.com/wp-content/uploads/2014/05/emc-front-1024x680.jpg',
        hours: {
            monday:{
                  scheduled: true,
                  time:[{
                      startTime: 16.0,
                      endTime  : 19.0
                    },
                    {
                      startTime: 22.0,
                      endTime  : 2.0
                  }]
            },
            tuesday:{
                  scheduled: true,
                  time:[{
                      startTime: 16.0,
                      endTime  : 19.0
                    },
                    {
                      startTime: 22.0,
                      endTime  : 2.0
                  }]
            },
            wednesday:{
                  scheduled: true,
                  time:[{
                      startTime: 16.0,
                      endTime  : 19.0
                    },
                    {
                      startTime: 22.0,
                      endTime  : 2.0
                  }]
            },
            thursday:{
                  scheduled: true,
                  time:[{
                      startTime: 16.0,
                      endTime  : 19.0
                    },
                    {
                      startTime: 22.0,
                      endTime  : 2.0
                  }]
            },
            friday:{
                  schedule: true,
                  time:[{
                      startTime: 16.0,
                      endTime  : 19.0
                  }]
            },
            saturday:{
                  scheduled: true,
                  time:[{
                      startTime: 16.0,
                      endTime  : 19.0
                  }]
            },
            sunday:{
                  scheduled: true,
                  time:[{
                      startTime: 16.0,
                      endTime  : 19.0
                    },
                    {
                      startTime: 22.0,
                      endTime  : 0.0
                  }]
            }
        },
        drinks : true,
        food   : true,
        contact:{
                  phone       : '(213) 351-9988',
                  address     : '3500 W 6th St #101 Los Angeles, CA 90020',
                  website     : 'http://www.emcseafood.com',
                  yelpUrl     : 'http://www.yelp.com/biz/emc-seafood-and-raw-bar-los-angeles'
                }
      })
    }
  })
}
