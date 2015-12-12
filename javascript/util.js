var util = {};

util.getParameterByKey = function (key) {
  //Return a value stored in a given key from browser query string.
  var match = RegExp('[?&]' + key + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

Handlebars.registerHelper('getDate', function(strDate){
  var strDate = strDate || '';
  var date = parseInt((new Date() - new Date(strDate))/60/60/24/1000);
  return date;
});

Handlebars.registerHelper('getWordCount', function(obj) {
  return wordCount(obj);
});
