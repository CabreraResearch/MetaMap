
# angular app definition for metamap (plus error reporting stuff)

app = angular.module('sandbank', ['ngResource', 'ui.bootstrap', 'angularFileUpload', 'infinite-scroll'])

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


# === ERROR REPORTING === #

#if (document.location.port != 3000) # local dev
#  `(function(e,t,r){if(!r.version&&!r.__ai){e.debuggify=r;var a,n,s,o="debuggify",g=Array.prototype.slice,i={};r._e=[];s=e.onerror;e.onerror=function(){r._e&&r._e.push(arguments);return s?s.apply(this,arguments):void 0};r.init=function(e,s,c){function u(e,t,r,a){var n=r.split(".");if(2==n.length){e=e[n[0]];r=n[1]}e[r]=function(){var e=a?a+"#"+r:r;t.push([e].concat(g.call(arguments,0)))}}function p(e,t,r,a){var n,s=r.split(" ");for(n=0;s.length>n;n++)u(e,t,s[n],a)}a=t.createElement("script");a.type="text/javascript";a.async=!0;a.src="https://cdn.debuggify.net/js/"+e+"/debuggify.logger.http.js";n=t.getElementsByTagName("script")[0];n.parentNode.insertBefore(a,n);var d=r;c!==void 0?d=r[c]=[]:c=o;d.Logger=d.Logger||[];var l=d.Logger;p(d,d,"Logger.get setEnv addTransport setDefaults onload alias metadata",null);var f=function(e){var t=this,r=i[n],a={},n=t&&t.namespace?t.namespace+"__"+e:e;if(r!==void 0)return i[n];p(a,l,"setLevel setFlag get message setNamespace addTransport sendToCollector report track untrack setUID isTracked genericMessage attach log warn error info debug",n);a.name=e;a.get=f;a.namespace=n;a.parent=t;i[n]=a;l.push(["get"].concat(g.call(arguments,0)));return a};l.get=f};r.__ai="0.2.0"}})(window,document,window.debuggify||[]);debuggify.init("9ac238864482d16832ba1c7852c57634");`
#  _logger = debuggify.Logger.get('project');

reportError = (err) ->
  try
    if !err.stack
      err.stack = (new Error('make stack')).stack
      if err.stack
        err.stack = err.stack.toString()
  catch e
    if typeof err != 'string'
      err = JSON.stringify(err)
  console.error(err)
#  $.ajax
#    url: "/users/error"
#    type: "POST"
#    data: { error: err, url: document.location.href }

# delegate AngularJS error-handler:
# http://docs.angularjs.org/api/ng.$exceptionHandler
#app.factory '$exceptionHandler', ->
#  return (exception, cause) ->
#    exception.message += ' (caused by "' + cause + '")'
#    if (document.location.port == 3000) # local dev
#    console.error(exception)
#    else
#      _logger.report(exception)
