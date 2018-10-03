var moment = require('moment');


var generatemessage = function(from, text) {
  return {
    from,
    text,
    createdAt: moment.valueOf()
  };
};

var generatelocationmessage = function(from,lat,long){
  return{
    from,
    url:`https://www.google.com/maps?q=${lat},${long}`,
    createdAt: moment.valueOf()
  };
};

module.exports = {
  generatemessage,generatelocationmessage
};
