# basic JS stuff shared by webfamily and metamap

window.startSpinner = -> $('#loading-indicator').show()

window.stopSpinner = ->  $('#loading-indicator').hide()

# put code to execute on each page load here
pageLoad = ->
  window.alerts or= []
  window.alertifyInit()
  alertify.set delay: 2000
  for alert in window.alerts
    alertify[alert[0]](alert[1])
  window.alerts = []

  # TODO: only load editor stuff on map form?
  ngapp = angular.element('body')
  if ngapp.size() > 0
    angular.bootstrap(angular.element('body'), ['sandbank'])
  stopSpinner()
  return

# put code that runs on document.ready here
ready = ->
  window.alertifyInit = alertify.init

window.insert_fields = (link, method, content) ->
  new_id = new Date().getTime()
  regexp = new RegExp("new_" + method, "g")
  target = $(link).parents("div.row").find('div.nested-form')
  target.append(content.replace(regexp, new_id))
  false

$(document).ready ready
$(document).on 'ready page:load page:restore', pageLoad
$(document).on "page:fetch", startSpinner
