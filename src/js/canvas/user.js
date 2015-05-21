class User {
    constructor(profile) {
        this.profile = new Proxy(profile, {
            get: function(target, property) {
                if (property in target) {
                    return target[property];
                } else {
                    return '';
                }
            }
        });
        this.params = URI(window.location).query(true);
    }
}

module.exports = User;


window.UserCtrl = function($scope) {

    // query string params
    $scope.params = URI(window.location).query(true);

    // auto-open thinkquery?
    $scope.thinkquery = ($scope.params.thinkquery ? true : false);

    $scope.userId = window.userId; // set in layouts/user
    $scope.userIsAdmin = window.userIsAdmin;
    $scope.userName = '';
    $scope.userProfile = null;
    $scope.profileEditStatus = '';
    $scope.password = '';
    $scope.passwordConfirm = '';

    $scope.getNewWindowName = function(action, mapId) {
        if (action == 'VIEW_MAP') {
            return 'VIEW_MAP_' + mapId;
        }
    };

    // show/hide tests UI and model debug form
    $scope.showTests = false;
    $scope.showModel = false;

    $scope.toggleShowTests = function() {
        $scope.showTests = !$scope.showTests;
    };
    $scope.toggleShowModel = function() {
        $scope.showModel = !$scope.showModel;
    };

    $scope.setUserId = function(id) {
        $scope.userId = id;
    };

    function init() {
        window.addEventListener('resize', fixRowHeights);
    }

    // make all cells in a row the same height
    function fixRowHeights() {
        // window.setTimeout(function() {
        //     $('.row-height').each(function() {  
        //         var highestBox = 0;
        //         $('> div', this).each(function(){
        //             if ($(this).height() > highestBox) 
        //                 highestBox = $(this).height();
        //         });  
        //         $('> div', this).height(highestBox);
        //     });        
        // }, 300);
    }

    $scope.loadUserProfile = function(callback) {
        if ($scope.userId) {
            var url = '/users/' + $scope.userId + '/profile.json';
            window.startSpinner();
            $http.get(url).then(
                function(response) { // success
                    $scope.userProfile = response.data;
                    initSelectedAdminTags();
                    initSelectedFollowableOrgs();
                    if ($scope.ccsTagging) {
                        $scope.ccsTagging.loadCcsTags();
                    }
                    window.stopSpinner();
                    if (callback) {
                        callback.call();
                    }
                    fixRowHeights();
                },
                function(reason) { // error
                    window.stopSpinner();
                    alert('Could not load user profile data');
                }
            );
        }
    };

    $scope.loadUserProfile();

    // -------------- courses/subscriptions ------------------

    // open the Stripe Checkout dialog and get a token
    // NB: amount is stored in the Stripe plan definition
    $scope.addSubscription = function(plan) {
        var handler = StripeCheckout.configure({
            key: $scope.userProfile.account.stripeKey,
            name: "Subscribe to MetaMap",
            image: "/assets/badge-logo-64.png",
            description: plan.name,
            panelLabel: "Pay {{amount}}/" + plan.interval,
            amount: plan.price,
            allowRememberMe: false,
            email: $scope.userProfile.user.email,
            token: function(token, args) {
                console.log('token: ', token);
                window.startSpinner();
                $http.post('/charges/subscribe', {
                    plan_id: plan.code,
                    token_id: token.id
                }).then(function(response) {
                        $scope.loadUserProfile(function() {
                            alertify.success('Subscription created');
                        });
                    },
                    function() {
                        $scope.loadUserProfile(function() {
                            alertify.error('Subscription could not be created');
                        });
                    });
            }
        });
        handler.open();
    };

    // for buy-course-button directive
    $scope.getBuyButtonLabel = function(id) {
        var course;
        if (course = getFreeCourse(id)) {
            return 'Free';
        } else if (course = getEnrolledCourse(id)) {
            return 'Enrolled';
        } else if (course = getEnrollableCourse(id)) {
            return 'Enroll - $' + (course.price / 100).toFixed(2);
        } else {
            return '';
        }
    };

    $scope.getCourseStatusSummary = function(id) {
        var course = $scope.getCourse(id);
        if (course) {
            var text = course.stepsCompleted + ' of ' + course.steps + ' steps completed';
            if (course.enrolment) {
                text = "Enrolled " + course.enrolment.date +
                    (course.enrolment.stripeData.refunded ? " (Refunded)" : "") +
                    ' - ' +
                    text;
            }
            return course.code + ' - ' + text;
        } else {
            return null;
        }
    };

    $scope.getCourseCompletedPercent = function(id) {
        var course = $scope.getCourse(id);
        if (course) {
            return course.stepsCompletedPercent;
        } else {
            return null;
        }
    };

    $scope.maybeBuyCourse = function(id) {
        var course;
        if (course = getFreeCourse(id)) {
            window.location.href = '/courses/' + course.id;
        } else if (course = getEnrolledCourse(id)) {
            window.location.href = '/courses/' + course.id;
        } else if (course = getEnrollableCourse(id)) {
            $scope.buyCourse(course);
        }
    };

    $scope.getCourse = function(id) {
        var course;
        if (course = getFreeCourse(id)) {
            return course;
        } else if (course = getEnrolledCourse(id)) {
            return course;
        } else if (course = getEnrollableCourse(id)) {
            return course;
        }
        return null;
    };

    function getFreeCourse(id) {
        return $scope.userProfile && _.find($scope.userProfile.freeAccessibleCourses, function(course) {
            return course.id == id && course.enrolment == undefined;
        });
    }

    function getEnrolledCourse(id) {
        return $scope.userProfile && _.find($scope.userProfile.freeAccessibleCourses, function(course) {
            return course.id == id && course.enrolment !== undefined;
        });
    }

    function getEnrollableCourse(id) {
        return $scope.userProfile && _.find($scope.userProfile.nonFreeAccessibleCourses, function(course) {
            return course.id == id;
        });
    }

    // open the Stripe Checkout dialog and get a token
    // NB: amount is passed from our course definition
    $scope.buyCourse = function(course) {
        var handler = StripeCheckout.configure({
            key: $scope.userProfile.account.stripeKey,
            name: "Enroll in Course",
            image: "/assets/badge-logo-64.png",
            description: course.code,
            amount: course.price,
            allowRememberMe: false,
            email: $scope.userProfile.user.email,
            token: function(token, args) {
                console.log('token: ', token);
                window.startSpinner();
                $http.post('/charges/buy_course', {
                    course_code: course.code,
                    course_price: course.price,
                    token_id: token.id
                }).then(function(response) {
                        $scope.loadUserProfile(function() {
                            alertify.success('Course purchased');
                        });

                        // reload page to handle stripe bug (?) - links not clickable
                        window.setTimeout(function() {
                            window.location.reload();
                        }, 1000);
                    },
                    function(response) {
                        $scope.loadUserProfile(function() {
                            alertify.error('Course purchase could not be completed');
                            console.log('stripe error: ', response);
                        });
                    });
            }
        });
        handler.open();
    };

    $scope.cancelSubscription = function(subscription) {
        window.startSpinner();
        $http.delete('/charges/unsubscribe?subscription_id=' + subscription.id).then(function(response) {
                $scope.loadUserProfile(function() {
                    alertify.success('Subscription cancelled');
                });
            },
            function() {
                $scope.loadUserProfile(function() {
                    alertify.error('Subscription could not be cancelled');
                });
            });
    };

    // debug/test only
    $scope.clearCustomer = function() {
        window.startSpinner();
        $http.delete('/charges/clear_customer').then(function(response) {
                $scope.loadUserProfile(function() {
                    alertify.success('Customer cleared');
                });
            },
            function() {
                $scope.loadUserProfile(function() {
                    alertify.error('Customer could not be cleared');
                });
            });
    };

    // -------------- points and badges ----------------

    $scope.hasCurrentBadge = function(key, level) {
        return $scope.userProfile && $scope.userProfile.badges.current[key] == level;
    };

    $scope.hasNewBadge = function(key, level) {
        return $scope.userProfile && $scope.userProfile.badges.new[key] == level;
    };

    $scope.hasNewBadges = function() {
        return $scope.userProfile && _.keys($scope.userProfile.badges.new).length > 0;
    };

    $scope.getBadgeDefinition = function(key) {
        return _.findWhere($scope.userProfile.badges.definitions, {
            key: key
        });
    }

    // -------------- tutorial -----------------

    try {
        $scope.tutorialEnabled = function() {
            return window.mapData !== undefined;
        };

        // start tutorial:
        var _tutorial = new SandbankEditor.Tutorial();

        $scope.startTutorial = function() {
            _tutorial.start();
        };
    } catch (e) {}

    // -------------- feedback form -----------------

    $scope.feedback = '';

    $scope.toggleFeedback = function() {
        $('#feedback-dropdown').slideToggle('fast').find('textarea').get(0).focus();
    };

    $scope.submitFeedback = function() {
        if ($scope.feedback === '') {
            return; // empty input...
        }

        $.ajax({
            type: 'POST',
            url: '/users/feedback',
            data: {
                url: window.location.href,
                feedback: $scope.feedback
            },
            success: function() {
                $scope.feedback = '';
                alert('Thank you for your feedback!');
            },
            error: function() {
                console.error('error sending feedback: ', arguments);
            }
        });

        $('#feedback-dropdown').slideToggle('fast');
    };

    // --------- user's user tags -----------

    // NB: this is similar to maps tagging in tagging.js - but simpler, as we do not have to deal with 
    // multiple taggable items, which means tracking existing vs. new tags, etc...

    $scope.newTag = {
        name: ''
    };

    // tag autocomplete
    $scope.getUserTags = function(viewValue) {
        var url = '/user_tags/list.json?q=' + viewValue;
        return $http.get(url).then(function(response) {
            return response.data.tags;
        });
    };

    $scope.updateUserUserTags = function() {
        var tagList = _.pluck($scope.userProfile.userTags, 'name').join(',');
        $http.put('/user_tags/update_user_user_tags', [tagList]).then(function(response) {
                $scope.loadUserProfile();
                $scope.profileEditStatus = 'Tags saved';
            },
            function() {
                $scope.profileEditStatus = 'Could not save tags';
            });
    };

    $scope.deleteTag = function(tag) {
        var i = _.indexOf($scope.userProfile.userTags, tag);
        $scope.userProfile.userTags.splice(i, 1);
        $scope.updateUserUserTags();
    };

    $scope.tagSelected = function(item, model, label) {
        //console.log('tagSelected: ', item, model, label);
        $scope.addTag(item.name);
    };

    $scope.editingTagKeypress = function(e) {
        if (e.which == 13) {
            $scope.addTag($scope.newTag.name);
        }
    };

    $scope.addTag = function(tagName) {
        $scope.userProfile.userTags.push({
            name: tagName
        });
        $scope.newTag.name = '';
        $scope.updateUserUserTags();
    };

    // --------- user's/map's CCS tags -----------

    // this manages CCS tags for either the current user or the current map, 
    // depending which page we're on - mapId gets overridden in editor.js if we're editing a map

    try {
        $scope.ccsTagging = new SandbankCcsTagging($scope);
        $scope.ccsTagging.mapId = null;
    } catch (e) {}

    // --------- user's admin tags -----------

    // key (index): admin tag ID; value: true/false (if user follows the admin tag)
    $scope.selectedUserAdminTags = [];

    function initSelectedAdminTags() {
        $scope.selectedUserAdminTags = [];
        _.each($scope.userProfile.adminTags, function(tag) {
            if (_.findWhere($scope.userProfile.userAdminTags, {
                id: tag.id
            })) {
                $scope.selectedUserAdminTags[tag.id] = true;
            }
        });
    }

    $scope.updateUserAdminTags = function() {
        var selectedTagNames = _.map($scope.userProfile.adminTags, function(tag) {
            return $scope.selectedUserAdminTags[tag.id] ? tag.name : null;
        });
        var tagList = _.without(selectedTagNames, null).join(',');
        $http.put('/admin_tags/update_user_admin_tags', [tagList]).then(function(response) {
                $scope.loadUserProfile();
                $scope.profileEditStatus = 'Interests saved';
            },
            function() {
                $scope.profileEditStatus = 'Could not save interests';
            });
    };

    // --------- user's followed orgs -----------

    // key (index): org ID; value: true/false (if user follows the org)
    $scope.selectedFollowableOrganizations = [];

    $scope.userIsFollowingOrg = function(id) {
        return $scope.selectedFollowableOrganizations[id];
    };

    $scope.toggleUserFollowingOrg = function(id) {
        if (!$scope.selectedFollowableOrganizations[id] || confirm('Stop following this ThinkNation?')) {
            $scope.selectedFollowableOrganizations[id] = !$scope.selectedFollowableOrganizations[id];
            $scope.updateFollowedOrganizations();
        }
    };

    function initSelectedFollowableOrgs() {
        $scope.selectedFollowableOrganizations = [];
        _.each($scope.userProfile.followedOrganizations, function(org) {
            if (_.findWhere($scope.userProfile.followableOrganizations, {
                id: org.id
            })) {
                $scope.selectedFollowableOrganizations[org.id] = true;
            }
        });
    }

    $scope.updateFollowedOrganizations = function() {
        var selectedOrgIds = _.map($scope.userProfile.followableOrganizations, function(org) {
            return $scope.selectedFollowableOrganizations[org.id] ? org.id : null;
        });
        var orgIdList = _.without(selectedOrgIds, null).join(',');
        $http.put('/organization_follows/update_user_organization_follows', [orgIdList]).then(function(response) {
                $scope.loadUserProfile();
                $scope.profileEditStatus = 'ThinkNations saved';
            },
            function() {
                $scope.profileEditStatus = 'Could not save ThinkNations';
            });
    };

    // --------- user's org memberships -----------

    $scope.joinNation = new SandbankJoinNation($scope);

    function getMembershipForOrg(id) {
        return _.findWhere($scope.userProfile.memberships, {
            organizationId: id
        });
    }

    $scope.userIsMemberOfOrg = function(id) {
        if ($scope.userProfile) {
            return (getMembershipForOrg(id) != undefined);
        } else {
            return false;
        }
    };

    $scope.toggleUserMemberOfOrg = function(id, name) {
        if ($scope.userIsMemberOfOrg(id)) {
            if (confirm('Remove your membership in this ThinkNation?')) {
                var membership = getMembershipForOrg(id);
                $http.delete('/memberships/' + membership.id + '.json')
                    .then(function(response) {
                        $scope.loadUserProfile();
                    });
            }
        } else {
            $scope.joinNation.openModal(
                id,
                name
            );
        }
    };


    // ------------ following other users ---------------

    $scope.followUser = function(user) {
        $http.post('/user_follows.json', {
            followee_id: user.id
        }).then(function(response) {
                user.followId = response.data;
                alertify.success('You are now following ' + user.name);
            },
            function() {});
    };

    $scope.unfollowUser = function(user) {
        $http.delete('/user_follows/' + user.followId + '.json').then(function(response) {
                user.followId = null;
                alertify.success('You are no longer following ' + user.name);
            },
            function() {});
    };

    // ------------ following tags ---------------

    function followTag(controller, tag) {
        $http.post('/' + controller + '/' + tag.id + '/follow.json', {
            id: tag.id
        }).then(function(response) {
                tag.following = true;
                alertify.success('You are now following ' + tag.name);
            },
            function() {});
    }

    function unfollowTag(controller, tag) {
        $http.delete('/' + controller + '/' + tag.id + '/unfollow.json').then(function(response) {
                tag.following = false;
                alertify.success('You are no longer following ' + tag.name);
            },
            function() {});
    }

    $scope.followUserTag = function(tag) {
        followTag('user_tags', tag);
    };
    $scope.unfollowUserTag = function(tag) {
        unfollowTag('user_tags', tag);
    };

    $scope.followAdminTag = function(tag) {
        followTag('admin_tags', tag);
    };
    $scope.unfollowAdminTag = function(tag) {
        unfollowTag('admin_tags', tag);
    };

    $scope.followCcsTag = function(tag) {
        followTag('common_core_standards', tag);
    };
    $scope.unfollowCcsTag = function(tag) {
        unfollowTag('common_core_standards', tag);
    };

    // ------------ auto-save user profile ---------------

    // don't let autosave be triggered more than every N milliseconds...
    $scope.autosave = _.debounce(autosaveNow, 2000);

    function autosaveNow() {
        //console.log('autosaving user profile');
        var data = {
            email: $scope.userProfile.user.email,
            alt_email: $scope.userProfile.user.altEmail,
            first_name: $scope.userProfile.user.firstName,
            last_name: $scope.userProfile.user.lastName,
            about_me: $scope.userProfile.user.aboutMe
        };
        if ($scope.passwordsMatch() && $scope.password.length) {
            data.password = $scope.password;
            data.password_confirmation = $scope.password;
        }

        startSpinner();
        $scope.profileEditStatus = 'Saving...';
        $http.put('/users/' + $scope.userId, data).then(
            function(response) {
                stopSpinner();
                if (_.has(data, 'password')) {
                    $scope.profileEditStatus = 'Profile and password saved';
                    console.log($scope.profileEditStatus);
                } else {
                    $scope.profileEditStatus = 'Profile saved';
                    console.log($scope.profileEditStatus);
                }
            },
            function() {
                stopSpinner();
                $scope.profileEditStatus = 'Could not save profile';
            }
        );
    }

    $scope.passwordsMatch = function() {
        return (!$scope.password.length && !$scope.passwordConfirm.length) ||
            $scope.password == $scope.passwordConfirm;
    };

    // ------------ upload avatar ---------------

    // using: https://github.com/danialfarid/angular-file-upload
    $scope.onAvatarFileSelect = function($files) {
        startSpinner();
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $scope.upload = $upload.upload({
                url: 'users/' + userId,
                method: 'PUT',
                withCredentials: true,
                file: file, // or list of files: $files for html5 only
                fileFormDataName: 'user[avatar]'
            }).success(function(data, status, headers, config) {
                $scope.loadUserProfile();
                $scope.profileEditStatus = 'Photo updated';
                stopSpinner();
            })
                .error(function() {
                    stopSpinner();
                    $scope.profileEditStatus = 'Error: Could not upload photo';
                })
            //.then(success, error, progress); 
        }
    };


    // --------------- view helpers -------------------

    // returns e.g. "a day ago"
    // (NB: now is obtained from the DB to ensure that we have both dates in UTC; 
    //    also, SQL vs. ruby dates need to be coerced into a similar format, both in UTC - see feed.json.jbuilder)
    $scope.getEventTime = function(t, now) {
        var time = moment(t, 'YYYY-MM-DD HH:mm:ss.SSS');
        var nowtime = moment(now, 'YYYY-MM-DD HH:mm:ss.SSS');
        // console.log('t:       ' + t);
        // console.log('now:     ' + now);
        // console.log('time:    ' + time.format()); // + ' ' + time.isValid());
        // console.log('nowtime: ' + nowtime.format()); // + ' ' + nowtime.isValid());
        return time.from(nowtime);
    };

    // --------------- notifications -------------------

    $scope.getNotificationFeedUrl = function(notification) {
        if (notification.actions.length) {
            var action = notification.actions[0];
            if (action.action == 'LIKE') {
                return '/social?like_id=' + action.likeId;
            } else if (action.action == 'COMMENT') {
                return '/social?comment_id=' + action.commentId;
            } else if (action.action == 'SHARE_INDIVIDUAL') {
                return '/maps/' + action.mapId;
            } else if (action.action == 'SHARE_PUBLIC') {
                return '/social?share_id=' + action.shareId;
            }
        }
        return '';
    };

    $scope.deleteNotification = function(notification) {
        $http.delete('/notifications/' + notification.id + '.json').then(
            function(response) { // success
                notification.deleted = true;
            },
            function(reason) { // error
                alert('Could not delete notification');
            }
        );
    };

    $scope.notificationVerb = function(action) {
        var verbs = {
            LIKE: 'liked this:',
            COMMENT: 'commented on this:',
            SHARE_INDIVIDUAL: 'shared a MetaMap with you',
            SHARE_PUBLIC: 'shared a MetaMap with everyone',
            MAP_FOLLOW: 'followed a MetaMap:',
            USER_FOLLOW: 'followed you'
        };
        return verbs[action];
    };

    // ------------ utility functions ---------------

    // handy function for use with ng-class on radio buttons
    $scope.classIf = function(klass, b) {
        //console.log('classIf: ' + klass + ', ' + b);
        return (b ? klass : '');
    };

    // avoid '$apply already in progress' error (source: https://coderwall.com/p/ngisma)
    $scope.safeApply = function(fn) {
        //console.log('safeApply on scope: ' + $scope);

        // TODO? restore non-Angular version of this method
        //var phase = this.$root.$$phase;
        //if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        //} else {
        //    this.$apply(fn);
        //}
    };

    // source: http://ctrlq.org/code/19616-detect-touch-screen-javascript
    $scope.isTouchDevice = function() {
        return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    };

    init();
};