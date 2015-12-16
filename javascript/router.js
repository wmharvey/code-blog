page.base('/');

page('', articleController.main);
//page('article', articleController.main);
page('contact', articleController.contact);
page('about', articleController.about);
page('author/:author', articleController.authorFilter);
page('category/:category', articleController.categoryFilter);
page('article/:article', articleController.articleFilter);

page();
