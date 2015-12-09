
//create an array of unique authors
function uniqueAuthors(articlesArray) {
  var unique = [];
  articlesArray.forEach(function(currentObj) {
    if (unique.indexOf(currentObj.author) === -1) {
      unique.push(currentObj.author);
    };
  });
  return unique;
}

//function that strips the html tags and returns the text
function stripTags(articleHTML) {
  var $temp = $('<div></div>');
  $temp.html(articleHTML);
  return $temp.text() || '';
}

//function that counts total words
//If no index is passed, then counts total words
//If an index is passed, then counts total words only in
//the article of that index
function numWords(articlesArray, index) {
  var count = 0;
  if (index || index === 0) {
    count = wordCount(articlesArray[index]);
  } else {
    articlesArray.forEach(function(currentObj) {
      count += wordCount(currentObj);
    });
  }
  return count;
}

//function that counts the number of words of an article object
function wordCount(currentObj) {
  var html = currentObj.body;
  var text = stripTags(html);
  var newArray = text.split(/\s+/);
  // console.log(newArray);
  // console.log(newArray.length);
  return newArray.length - 1;
}

//function that returns an array of words
function arrayOfWords(currentObj) {
  var html = currentObj.body;
  var text = stripTags(html);
  var newArray = text.split(/\s+/);
  return newArray;
}

//returns how many articles fit the criteria
function articlesByType(articlesArray, keyType, value) {
  var filteredArray = articlesArray.filter(makeSearchFilter(keyType, value));
  return filteredArray.length;
}


//function that calculates average word count
//If keyType and author are specified, it will return the average
//word count of all articles of the type(ex 'author', 'Macklemore')
function averageWordCount(articlesArray, keyType, value) {
  var arrayOfLengths = [];
  if (keyType && value) {
    var articlesByType = articlesArray.filter(makeSearchFilter(keyType, value));
    articlesByType.forEach(function(currentObj) {
      arrayOfLengths.push(wordCount(currentObj));
    });
  } else {
    articlesArray.forEach(function(currentObj) {
      arrayOfLengths.push(wordCount(currentObj));
    });
  }
  var total = arrayOfLengths.reduce(function(a, b) {
    return a + b;
  });
  total = total/(arrayOfLengths.length);
  return Math.round(total * 100) / 100;
}

//function will create a filter that sorts through an array and
//looks into each object to see if the keyType (ex 'author') matches
//value (ex 'Brook')
function makeSearchFilter(keyType, value) {
  return function(article) {
    return article[keyType] === value;
  };
}

//computes the average word length of all the articles,
//or of a specific filtered type
function averageWordLength(articlesArray, keyType, value) {
  var arrayOfLengths = [];
  if (keyType && value) {
    var articlesByType = articlesArray.filter(makeSearchFilter(keyType, value));
    articlesByType.forEach(function(currentObj) {
      var wordArray = arrayOfWords(currentObj);
      wordArray.forEach(function(item) {
        arrayOfLengths.push(item.length);
      });
    });
  } else {
    articlesArray.forEach(function(currentObj) {
      var wordArray = arrayOfWords(currentObj);
      wordArray.forEach(function(item) {
        arrayOfLengths.push(item.length);
      });
    });
  }
  var total = arrayOfLengths.reduce(function(a, b) {
    return a + b;
  });
  total = total/(arrayOfLengths.length);
  return Math.round(total * 100) / 100;
}
