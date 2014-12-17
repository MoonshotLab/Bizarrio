module.exports = function(){
  return {
    'trap-door' : {
      'hi'        : 140,
      'lo'        : 50,
      'mode'      : 'SERVO',
      'action'    : 'servoWrite',
      'reset'     : 50
    },
    'coin'      : {
      'hi'        : 1,
      'lo'        : 0,
      'mode'      : 'OUTPUT',
      'action'    : 'digitalWrite',
      'reset'     : 0
    },
    'portal'      : {
      'hi'        : 1,
      'lo'        : 0,
      'mode'      : 'OUTPUT',
      'action'    : 'digitalWrite',
      'reset'     : 0
    },
    'toggle' : {
      'hi'        : 110,
      'lo'        : 40,
      'mode'      : 'SERVO',
      'action'    : 'servoWrite',
      'reset'     : 70
    },
    'waterfall' : {
      'hi'        : 0,
      'lo'        : 1,
      'mode'      : 'OUTPUT',
      'action'    : 'digitalWrite',
      'reset'     : 0
    },
    'fan' : {
      'hi'        : 1,
      'lo'        : 0,
      'mode'      : 'OUTPUT',
      'action'    : 'digitalWrite',
      'reset'     : 0
    },
    'conveyor' : {
      'hi'        : 0,
      'lo'        : 90,
      'mode'      : 'SERVO',
      'action'    : 'servoWrite',
      'reset'     : 90
    },
    'jingleBell' : {
      'hi'        : 140,
      'lo'        : 50,
      'mode'      : 'SERVO',
      'action'    : 'servoWrite',
      'reset'     : 50
    }
  };
};
