var webDB = {};

webDB.verbose = function (verbose) {
  var msg;
  if (verbose) {
    html5sql.logInfo = true;
    html5sql.logErrors = true;
    html5sql.putSelectResultsInArray = true;
    msg = 'html5sql verbosity on';
  } else {
    html5sql.logInfo = false;
    html5sql.logErrors = false;
    html5sql.putSelectResultsInArray = false;
    msg = 'html5sql verbosity off';
  }
  console.log(msg);
};

webDB.init = function() {
  // Open and init DB
  try {
    if (openDatabase) {
      webDB.verbose(true);
      webDB.connect('blogDB', 'Blog Database', 5*1024*1024);
      webDB.setupTables();
    } else {
      console.log('Web Databases not supported.');
    }
  } catch (e) {
    console.error('Error occured during DB init. Web Database may not be supported.');
  }
};

webDB.connect = function (database, title, size) {
  html5sql.openDatabase(database, title, size);
};

webDB.defer = function (callback) {
  callback = callback || function() {};
  html5sql.process(
    'SELECT * FROM articles WHERE 0=1;',
    function(tx, result, resultArray) {
      callback(resultArray);
    }
  );
};

webDB.importArticlesFrom = function (path) {
  // Import articles from JSON file
  $.getJSON(path, webDB.insertAllRecords);
};

webDB.insertAllRecords = function (articles) {
  articles.forEach(function(item) {
    webDB.insertRecord(item, function() {});
  });
  //articles.forEach(webDB.insertRecord);
};

webDB.setupTables = function () {
  html5sql.process(
    ['DROP TABLE articles', 'CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY, title VARCHAR(255) NOT NULL, author VARCHAR(255) NOT NULL, authorUrl VARCHAR(255), category VARCHAR(20), publishedOn DATETIME, body TEXT NOT NULL, status VARCHAR(255), edit VARCHAR(20));'],
    function() {
      // on success
      console.log('Success setting up tables.');
    },
    function(error) {
      console.log('Error ' + error.message);
    }
  );
};

webDB.insertRecord = function (a, callback) {
  // insert article record into database
  callback = (typeof(callback) === 'function') ? callback : function() {};
  html5sql.process(
    [
      {
        'sql': 'INSERT INTO articles (title, author, authorUrl, category, publishedOn, body, status) VALUES (?, ?, ?, ?, ?, ?, ?);',
        'data': [a.title, a.author, a.authorUrl, a.category, a.publishedOn, a.body, a.status],
      }
    ],
    function () {
      console.log('Success inserting record for ' + a.title);
      callback();
    }
  );
};

webDB.execute = function (sql, callback) {
  callback = callback || function() {};
  html5sql.process(
    sql,
    function (tx, result, resultArray) {
      callback(resultArray);
    }
  );
};
