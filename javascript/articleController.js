var articleController = {};
articleController.haveDataAlready = false;
articleController.inDOM = false;
var conditions = {};

articleController.main = function(ctx, next) {
  blog.baseDOM();
  blog.articlePage();
  if (articleController.inDOM) {
    console.log('is in DOM');
    blog.revealAll();
    blog.hideFirstParagraph();
    //next();
  } else {
    console.log('not in DOM');
    if (articleController.haveDataAlready) {
      console.log('have data already');
      blog.initArticles();
      articleController.haveDataAlready = true;
      //next();
    } else {
      console.log('getting data now');
      blog.getData();
      articleController.inDOM = true;
      articleController.haveDataAlready = true;
      console.log(articleController);
      //next();
    }
  }
};

articleController.contact = function() {
  blog.baseDOM();
  $('#first-view').show();
  $('#contact').show();
};


articleController.about = function() {
  blog.baseDOM();
  $('#about').show();
  $('#first-view').show();
};

articleController.authorFilter = function(ctx) {
  blog.searchThisAuthor = ctx.params.author;
  console.log(blog.searchThisAuthor);
  blog.baseDOM();
  blog.articlePage();
  blog.getData();
  articleController.inDOM = true;
  articleController.haveDataAlready = true;
};

articleController.categoryFilter = function(ctx) {
  blog.searchThisCategory = ctx.params.category;
  console.log(blog.searchThisCategory);
  blog.baseDOM();
  blog.articlePage();
  blog.getData();
  articleController.inDOM = true;
  articleController.haveDataAlready = true;
};

articleController.articleFilter = function(ctx) {
  blog.searchThisArticle = ctx.params.article;
  console.log(blog.searchThisArticle);
  blog.baseDOM();
  blog.articlePage();
  blog.getData();
  articleController.inDOM = true;
  articleController.haveDataAlready = true;
};
