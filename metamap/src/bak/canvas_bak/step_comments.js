// controller for course lesson steps

window.StepCommentsCtrl = function($scope) {

    $scope.stepID = window.stepID; // set in views/steps/show

    $scope.comments = [];
    $scope.showComments = false;
    $scope.newComment = '';

    $scope.toggleComments = function() {
        $scope.showComments = !$scope.showComments;
        if ($scope.showComments) {
            $scope.loadComments();
        }
    };

    // ---------------- comment data -----------------

    $scope.loadComments = function(increment) {

        $scope.loadingComments = true;
        startSpinner();
        $http.get('/steps/' + $scope.stepID + '/comments.json?').then(function(response) {
                $scope.comments = response.data.step_comments;
                stopSpinner();
                $scope.loadingComments = false;
            },
            function() {
                stopSpinner();
                $scope.loadingComments = false;
                alert('Could not load Comments');
            });
    };

    // ------------- comment on a step -----------------

    $scope.commentKeypress = function(e) {
        if (!$scope.showComments) {
            $scope.toggleComments();
        }
        if (e.which == 13) {
            $scope.addComment();
        }
    };

    $scope.addComment = function() {
        $http.post('/steps/' + $scope.stepID + '/add_comment', {
            text: $scope.newComment
        }).then(function(response) {
                $scope.newComment = '';
                $scope.loadComments();
            },
            function() {
                alert("Could not post your comment");
            });
    };

    $scope.deleteComment = function(commentId) {
        $http.delete('/steps/' + $scope.stepID + '/delete_comment?comment_id=' + commentId).then(function(response) {
                $scope.loadComments();
            },
            function() {
                alert("Could not delete your comment");
            });
    };
};