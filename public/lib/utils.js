var utils = {
  getUrlVars : function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++){
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }

    return vars;
  },

  formatTime : function(milliseconds){
    var date = new Date(milliseconds);
    var m = date.getMinutes();
    var s = date.getSeconds();
    if(s < 10) s = '0' + s;
    return (m + ':' + s);
  }
};
