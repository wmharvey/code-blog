function Article (opts) {
  Object.keys(opts).forEach(function(e, index, keys) {
    this[e] = opts[e];
  },this);

  this.body = opts.body || marked(this.markdown);
}

Article.prototype.template = '';

Article.prototype.toHtml = function() {
  if (!blog.isAdmin() && !this.publishedOn) {
    return '';
  }
  this.daysAgo =
    parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.authorSlug = util.slug(this.author);
  this.categorySlug = util.slug(this.category);

  return this.template(this);
};


// Article.prototype.insertRecord = function(callback) {
//   // insert article record into database
//   webDB.execute(
//     // TODO: Add SQL here...
//     ,
//     callback
//   );
// };
//
// Article.prototype.updateRecord = function(callback) {
//   //update article record in databse
//   webDB.execute(
//     // TODO: Add SQL here...
//     ,
//     callback
//   );
// };
//
// Article.prototype.deleteRecord = function(callback) {
//   // Delete article record in database
//   webDB.execute(
//     // TODO: Add SQL here...
//     ,
//     callback
//   );
// };
//
// Article.prototype.truncateTable = function(callback) {
//   // Delete all records from given table.
//   webDB.execute(
//     // TODO: Add SQL here...
//     ,
//     callback
//   );
// };
