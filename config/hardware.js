module.exports = function(){
  return {
    'trap-door' : {
      'min'       : 140,
      'max'       : 50,
      'mode'      : 'SERVO',
      'action'    : 'servoWrite',
      'reset'     : 50
    },
    'coin'      : {
      'on'        : 1,
      'off'       : 0,
      'mode'      : 'OUTPUT',
      'action'    : 'digitalWrite',
      'reset'     : 0
    },
    'portal'      : {
      'on'        : 1,
      'off'       : 0,
      'mode'      : 'OUTPUT',
      'action'    : 'digitalWrite',
      'reset'     : 0
    },
    'toggle' : {
      'min'       : 30,
      'max'       : 70,
      'mode'      : 'SERVO',
      'action'    : 'servoWrite',
      'reset'     : 70
    },
  };
};
