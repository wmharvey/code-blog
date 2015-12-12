$(function(){

  webDB.connect('blogDB', 'Blog Database', 5*1024*1024);

  var $title = $('#title');
  var $category = $('#category');
  var $author = $('#author');
  var $authorUrl = $('#authorUrl');
  var $pubDate = $('#pubDate');
  var $body = $('#body');
  var $jsonPrint = $('#JSON');
  var newArticle = {};

  webDB.execute(
    'SELECT * FROM articles WHERE edit = "true";'
    , function(resultArray) {
      if (resultArray[0] !== undefined) {
        console.log('not undefined');
        $title.val(resultArray[0].title);
        $category.val(resultArray[0].category);
        $author.val(resultArray[0].author);
        $authorUrl.val(resultArray[0].authorUrl);
        $pubDate.val(resultArray[0].publishedOn);
        $body.val(stripTags(resultArray[0].body));
        localStorage.setItem('selectedArticle', resultArray[0].id);
        webDB.execute('UPDATE articles SET edit = "false";', render);
      } else {
        console.log('was undefined');
        var stringObj = localStorage.getItem('draftArticle');
        //console.log(stringObj);
        if (stringObj) {
          var prevArticle = JSON.parse(stringObj);
          //console.log(prevArticle);
          $title.val(prevArticle.title);
          $category.val(prevArticle.category);
          $author.val(prevArticle.author);
          $authorUrl.val(prevArticle.authorUrl);
          $pubDate.val(prevArticle.publishedOn);
          $body.html(prevArticle.withoutTagsBody);
        }
        render();
      }
    }
  );

  //var stringObj = localStorage.getItem('draftArticle');

  // if (stringObj) {
  //   var prevArticle = JSON.parse(stringObj);
  //   $title.attr('value', prevArticle.title);
  //   $category.attr('value', prevArticle.category);
  //   $author.attr('value', prevArticle.author);
  //   $authorUrl.attr('value', prevArticle.authorUrl);
  //   $pubDate.attr('value', prevArticle.publishedOn);
  //   $body.html(prevArticle.withoutTagsBody);
  // }


  function render (){

    var title = ($title.val());
    var category = ($category.val());
    var author = ($author.val());
    var authorUrl = ($authorUrl.val());
    var date = ($pubDate.val());
    var markedBody = marked($body.val());

    newArticle.title = title;
    newArticle.category = category;
    newArticle.author = author;
    newArticle.authorUrl = authorUrl;
    newArticle.publishedOn = date;
    newArticle.body = markedBody;
    newArticle.withoutTagsBody = $body.val();
    //console.log(newArticle.body);
    //console.log(newArticle.withoutTagsBody);

    localStorage.setItem('draftArticle', JSON.stringify(newArticle));

    //console.log(localStorage.getItem('draftArticle'));

    $jsonPrint.text(JSON.stringify(newArticle));

    $.get('templates/template.html', function(data) {
      var template = Handlebars.compile(data);
      var compiledArticleHtml = template(newArticle);
      $('#articleContainer').html(compiledArticleHtml);
//Use syntax highlighting on author written code
      $('#articleContainer').find('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
      });
//Hide the first paragraph and enable 'See More' to drop down paragraphs
      blog.hideFirstParagraph();
      blog.addEventListernerMore();
    });
//Calculate live article stats
    var tempArray = [newArticle];
    var wordCount = averageWordCount(tempArray);
    $('.wordCount').text('Word Count: ' + wordCount);
    var wordLength = averageWordLength(tempArray);
    $('.wordLength').text('Average Word Length: ' + wordLength);

    //console.log(newArticle);
  };

  $title.on('input', render);
  $category.on('input', render);
  $author.on('input', render);
  $authorUrl.on('input', render);
  $pubDate.on('input', render);
  $body.on('input', render);

  $('#submit').on('click', function() {
    newArticle.status = 'final';
    addNewArticle();
  });

  $('#draft').on('click', function() {
    newArticle.status = 'draft';
    addNewArticle();
  });

  function addNewArticle() {
    localStorage.setItem('draftArticle', '');
    $title.val('');
    $category.val('');
    $author.val('');
    $authorUrl.val('');
    $pubDate.val('');
    $body.val('');
    var oldID = localStorage.getItem('selectedArticle');
    if (oldID) {
      localStorage.setItem('selectedArticle', '');
      webDB.execute('DELETE FROM articles WHERE id = "' + oldID + '";'
      , function() {
        webDB.insertRecord(newArticle, function() {
          console.log('inserted newArticle');
          newArticle = {};
          render();
        });
      }
      );
    } else {
      webDB.insertRecord(newArticle, function() {
        newArticle = {};
        render();
      });
    }
  };


});
