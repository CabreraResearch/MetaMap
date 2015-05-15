
# angular app definition for webfamily (using fewer dependencies that metamap)

app = angular.module('sandbank', ['ui.bootstrap', 'angularFileUpload'])

# TODO: figure out how to share directive defs...

app.directive 'sbUserTag', () -> 
  restrict: 'E'
  scope:
    tag: '='
    canDelete: '='
    showTooltip: '='
    delete: '&onDelete'
    follow: '&onFollow'
    unfollow: '&onUnfollow'
  templateUrl: 'template_sb_user_tag.html'  

app.directive 'sbUser', () -> 
  restrict: 'E'
  scope:
    user: '='
    currentUserId: '='
    follow: '&onFollow'
    unfollow: '&onUnfollow'
  templateUrl: 'template_sb_user.html'  

app.directive 'sbUserAvatar', () -> 
  restrict: 'E'
  scope:
    user: '='
  templateUrl: 'template_sb_user_avatar.html'  

app.directive 'sbBuyCourseButton', () -> 
  restrict: 'E'
  scope:
    id: '='
  templateUrl: 'template_sb_buy_course_button.html'  

# tweak wysihtml5 to accept this custom tag with the "id" attribute - otherwise it will wipe it out...
#if (wysihtml5ParserRules) 
#  wysihtml5ParserRules.tags["sb-buy-course-button"] = { "check_attributes": { "id": "numbers" }}
