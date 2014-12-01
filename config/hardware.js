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
      'hi'        : 70,
      'lo'        : 30,
      'mode'      : 'SERVO',
      'action'    : 'servoWrite',
      'reset'     : 70
    },
    'waterfall' : {
      'hi'        : 1,
      'lo'        : 0,
      'mode'      : 'OUTPUT',
      'action'    : 'digitalWrite',
      'reset'     : 0
    },
    'conveyor' : {
      'hi'        : 1,
      'lo'        : 0,
      'mode'      : 'OUTPUT',
      'action'    : 'digitalWrite',
      'reset'     : 0
    }
  };
};
