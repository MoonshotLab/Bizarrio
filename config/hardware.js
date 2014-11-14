module.exports = function(){
  return {
    'trap-door' : {
      'min'       : 25,
      'max'       : 50,
      'mode'      : 'SERVO',
      'action'    : 'servoWrite',
      'reset'     : 25
    },
    'coin'      : {
      'on'        : 1,
      'off'       : 0,
      'mode'      : 'OUTPUT',
      'action'    : 'digitalWrite',
      'reset'     : 0
    }
  };
};
