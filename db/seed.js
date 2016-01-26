var mongoose = require('mongoose')
var Restaurant = require('..models/restaurant.js')


var barAma = new Restaurant({
      name          : 'Bar Ama',
      hours         :
                      { monday:
                                [{ time:
                                        { startTime: 17.5,
                                          endTime  : 19.0 },
                                        { startTime: 22.0,
                                          endTime  : 23.0}
                                }],
                        tuesday:
                                [{ time:
                                        { startTime: 12.5,
                                          endTime  : 19.0 },
                                        { startTime: 22.0,
                                          endTime  : 23.0}
                                }],
                        wednesday:
                                [{ time:
                                        { startTime: 17.5,
                                          endTime  : 19.0 },
                                        { startTime: 22.0,
                                          endTime  : 23.0}
                                }],
                        thursday:
                                [{ time:
                                        { startTime: 17.5,
                                          endTime  : 19.0 },
                                        { startTime: 22.0,
                                          endTime  : 23.0}
                                }],
                        friday:
                                [{ time:
                                        { startTime: 17.5,
                                          endTime  : 19.0 },
                                        { startTime: 22.0,
                                          endTime  : 0.0}
                                }],
                        saturday:
                                [{ time:
                                        { startTime: 22.0,
                                          endTime  : 0.0 }
                                }],
                        sunday:
                                [{ time:
                                        { startTime: 15.0,
                                          endTime  : 17.5 }
                                }]
                      },
      drinks        : true,
      food          : true,
      contact       : { website     : 'http://bar-ama.com/media/snh.pdf',
                        phone       : '(213) 687-7000',
                        address     : '118 W. 4th St Los Angeles, CA 90013',
                        yelpUrl     : 'http://www.yelp.com/biz/bar-ama-los-angeles'
                      }
})

var fuga = new Restaurant({
      name          : 'Izakaya Fu-ga',
      hours         :
                      { monday:
                                [{ time:
                                        { startTime: 14.0,
                                          endTime  : 18.0 }
                                }],
                        tuesday:
                                [{ time:
                                        { startTime: 14.0,
                                          endTime  : 18.0 }
                                }],
                        wednesday:
                                [{ time:
                                        { startTime: 14.0,
                                          endTime  : 18.0 }
                                }],
                        thursday:
                                [{ time:
                                        { startTime: 14.0,
                                          endTime  : 18.0 }
                                }],
                        friday:
                                [{ time:
                                        { startTime: 14.0,
                                          endTime  : 18.0 }
                                }]
                      },
      drinks        : true,
      food          : true,
      contact       : { website     : 'http://www.izakayafu-ga.com/menus.php',
                        phone       : '(213) 625-1722',
                        address     : '111 S San Pedro St Los Angeles, CA 90012',
                        yelpUrl     : 'http://www.yelp.com/biz/izakaya-fu-ga-los-angeles'
                      }
})

var emc = new Restaurant({
      name          : 'EMC Seafood',
      hours         :
                      { monday:
                                [{ time:
                                        { startTime: 16.0,
                                          endTime  : 19.0 },
                                        { startTime: 22.0,
                                          endTime  : 2.0}
                                }],
                        tuesday:
                                [{ time:
                                        { startTime: 16.0,
                                          endTime  : 19.0},
                                        { startTime: 22.0,
                                          endTime  : 2.0 }
                                }],
                        wednesday:
                                [{ time:
                                        { startTime: 16.0,
                                          endTime  : 19.0}.
                                        { startTime: 22.0,
                                          endTime  : 2.0 }
                                }],
                        thursday:
                                [{ time:
                                        { startTime: 16.0,
                                          endTime  : 19.0},
                                        { startTime: 22.0,
                                          endTime  : 2.0 }
                                }],
                        friday:
                                [{ time:
                                        { startTime: 16.0,
                                          endTime  : 19.0}
                                }],
                        saturday:
                                [{ time:
                                        { startTime: 16.0,
                                          endTime  : 19.0}
                                }],
                        sunday:
                                [{ time:
                                        { startTime: 16.0,
                                          endTime  : 19.0},
                                        { startTime: 22.0,
                                          endTime  : 0.0}
                                }]
                      },
      drinks        : true,
      food          : true,
      contact       : { website     : 'http://www.emcseafood.com',
                        phone       : '(213) 351-9988',
                        address     : '3500 W 6th St #101 Los Angeles, CA 90020',
                        yelpUrl     : 'http://www.yelp.com/biz/emc-seafood-and-raw-bar-los-angeles'
                      }
})




db.restaurants.save(seedRestaurant)
