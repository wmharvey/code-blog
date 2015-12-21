var repoController = {};

repoController.index = function() {
  blog.baseDOM();
  $('#about').show();
  $('#first-view').show();
  $.ajax({
    url: 'https://api.github.com/users/wmharvey/repos' +
          '?per_page=100' +
          '&sort=updated' +
          '&access_token=' + GITHUB_TOKEN,
    type: 'GET',
    success: function(data, message, xhr) {
      repoController.repoArray = data;
    }
  }).done(repoController.render);
  $.ajax({
    url: 'https://api.github.com/users/wmharvey/starred',
        //  '&access_token=' + GITHUB_TOKEN,
    type: 'GET',
    success: function(data, message, xhr) {
      repoController.starArray = data;
    }
  }).done(repoController.renderStars);
};

repoController.render = function() {
  $('.repo_list').empty();
  repoController.repoArray.forEach(function(repo) {
    $('.repo_list').append($('<li>').html('<a href="' + repo.html_url + '">' + repo.full_name + '</a>'));
  });
};

repoController.renderStars = function() {
  $('.star_list').empty();
  repoController.starArray.forEach(function(repo) {
    $('.star_list').append($('<li>').html('<a href="' + repo.html_url + '">' + repo.full_name + '</a>'));
  });
};
