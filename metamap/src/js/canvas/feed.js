const SandbankEditor = require('./sbEditor');
// controller for public maps

const MapsFeedCtrl = function($scope, $http, $resource, $modal, $log) {

    $scope.showAdvancedSearch = true;
    $scope.loadingFeed = false;

    $scope.events = [];
    $scope.organizations = [];
    $scope.adminTags = [];

    $scope.sortOptions = [{
        name: 'MOST_RECENT',
        label: 'Most Recent'
    }, {
        name: 'MOST_LIKED',
        label: 'Most Liked'
    }, {
        name: 'MOST_COMMENTED',
        label: 'Most Commented'
    }];

    $scope.filters = [{
        name: 'ALL',
        label: 'All Public Maps'
    }, {
        name: 'FOLLOWED_MAPS',
        label: 'Maps I Follow'
    }, {
        name: 'LIKED_MAPS',
        label: "Maps I've Liked"
    }, {
        name: 'FOLLOWED_PEOPLE',
        label: 'Maps by People I Follow'
    }, {
        name: 'TAGGED_MAPS',
        label: "Maps Tagged with My Tags"
    }];

    function getDefaultSearchParams() {
        return {
            text: '',
            organizationId: '',
            adminTagId: '',
            tags: [],
            standards: [],
            withSlides: false,
            withActivitySlides: false,
            sortBy: 'MOST_RECENT',
            filter: 'ALL'
        };
    }

    $scope.searchParams = getDefaultSearchParams();

    $scope.searchParamsToQueryString = function() {
        var sp = $scope.searchParams;
        return 'text=' + sp.text +
            '&organizationId=' + sp.organizationId +
            '&adminTagId=' + sp.adminTagId +
            '&tags=' + sp.tags +
            '&standards=' + sp.standards +
            '&withSlides=' + sp.withSlides +
            '&withActivitySlides=' + sp.withActivitySlides +
            '&sortBy=' + sp.sortBy +
            '&filter=' + sp.filter;
    };

    // ----------- query string params to show single event for notifications -------------

    $scope.getNotificationSearchParams = function() {
        var params = _.map(['like', 'comment', 'share'], function(action) {
            return action + '_id=' +
                (_.has($scope.params, action + '_id') ? $scope.params[action + '_id'] : 'null');
        });
        return params.join('&');
    };

    // $scope.params is set in user.js
    $scope.isSingleCommentView = function() {
        return _.has($scope.params, 'comment_id') && $scope.params['comment_id'] != null;
    };

    // ---------------- map data -----------------

    $scope.eventLimit = 10;

    $scope.loadFeed = function(increment) {

        if (increment) {
            $scope.eventLimit += increment;
        }

        $scope.loadingFeed = true;
        startSpinner();
        $http.get('/maps/feed.json?' +
            $scope.searchParamsToQueryString() + '&' +
            $scope.getNotificationSearchParams() + '&limit=' + $scope.eventLimit
        ).then(function(response) {
                $scope.events = response.data.events;
                $scope.organizations = response.data.organizations;
                $scope.adminTags = response.data.adminTags;
                stopSpinner();
                $scope.loadingFeed = false;
            },
            function() {
                stopSpinner();
                $scope.loadingFeed = false;
                alert('Could not load MetaMap feed');
            });
    };

    $scope.loadFeed();

    // -------------- infinite scrolling ------------------

    $scope.moreEvents = function() {
        //console.log('moreEvents!');
        if (!$scope.loadingFeed) {
            $scope.loadFeed(10);
        }
    };

    // -------------- search form ------------------

    $scope.doSearch = function() {
        $scope.loadFeed();
    };

    $scope.resetSearch = function() {
        $scope.searchParams = getDefaultSearchParams();
        $scope.showAdvancedSearch = false;
        $scope.loadFeed();
    };

    // -------------- view helpers -----------------

    $scope.getTotalTagCount = function(event) {
        return event.map.userTags.length +
            event.map.adminTags.length +
            event.map.ccsTags.length;
    };

    // ------------- comment on a map -----------------

    // these are indexed by the index of the event in the feed
    $scope.showAllComments = [];
    $scope.newComments = [];

    // NB: when posting a new comment we don't reload the feed, so
    // that the new comment will stay visible rather than having the
    // feed scroll to the top. 
    $scope.addComment = function(eventIndex) {
        var event = $scope.events[eventIndex];
        var mapId = event.map.id;
        var comment = $scope.newComments[eventIndex];
        $http.post('/comments', {
            map_id: mapId,
            text: comment
        }).then(function(response) {
                event.map.comments.push({
                    authorId: $scope.userId,
                    text: comment,
                    updatedAt: event.now,
                    author: {
                        id: $scope.userId,
                        name: $scope.userName,
                        avatar: $scope.userProfile.user.avatar
                    }
                    // TODO: figure out how to show true current time, rather than event.now, 
                    // which could be a minute or two ago... ??
                });
                $scope.newComments[eventIndex] = ''; // clear edit field
            },
            function() {
                alert("Could not post your comment");
            });
    };

    $scope.deleteComment = function(eventIndex, commentId) {
        // //console.log('eventIndex: ' + eventIndex);
        var event = $scope.events[eventIndex];
        var mapId = event.map.id;
        $http.delete('/comments/' + commentId).then(function(response) {
                event.map.comments = _.filter(event.map.comments, function(elt) {
                    return elt.id != commentId
                });
            },
            function() {
                alert("Could not delete your comment");
            });
    };

    $scope.focusNewComment = function(eventIndex) {
        $scope.showAllComments[eventIndex] = !$scope.showAllComments[eventIndex];
        window.setTimeout(function() {
            $('#new-comment_' + eventIndex).focus();
        }, 300);
    }

    // ------------- like a map -----------------

    $scope.addLike = function(map) {
        $http.post('/likes', {
            map_id: map.id
        }).then(function(response) {
                //console.log('addLike, response:', response);
                map.likeCount = response.data;
            },
            function() {});
    };

    // ----------------- follow a map -----------------

    $scope.addMapFollow = function(map) {
        $http.post('/map_follows', {
            map_id: map.id
        }).then(function(response) {
                map.followCount = response.data;
            },
            function() {});
    };

};