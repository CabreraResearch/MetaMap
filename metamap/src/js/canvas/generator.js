// functions for the generator (aka ThinkQuery)

var GeneratorCtrl = function ($scope) {

    var map = $scope.map;
    var diagram = $scope.map.getDiagram();

    $scope.concept1 = '';
    $scope.concept2 = '';

    $scope.echoConcept1 = function() {
        return $scope.concept1 || '...';
    };

    $scope.echoConcept2 = function() {
        return $scope.concept2 || '...';
    };

    $scope.swapConcepts = function() {
        var tmp = $scope.concept1;
        $scope.concept1 = $scope.concept2;
        $scope.concept2 = tmp;
        $scope.safeApply();
    };

    $scope.mapIt = function(question) {
        startSpinner();
        diagram = map.getDiagram();
        map.getAutosave().saveOnModelChanged = false;

        if ($scope.sandbox) {
            diagram.clear();
        }

        // figure out location for inserted stuff
        var db = map.computeMapBounds();
        var x = db.x + db.width + 200;
        var y = db.y;
        if (isNaN(x) || isNaN(y)) {
            x = y = 0;
        }
        //console.log('x, y: ' + x + ', ' + y);

        // insert the stuff and deselect it
        question(x,y);
        diagram.clearSelection(); 

        diagram.updateAllTargetBindings();
        diagram.layoutDiagram(true);
        
        map.getUi().resetZoom();

        map.getAutosave().saveOnModelChanged = true;
        map.getAutosave().save('edit_generator');
        stopSpinner();
    };

    $scope.selectedQuestion = null;

    $scope.selectQuestion = function(question) {
        $scope.selectedQuestion = question;
        if ($scope.sandbox) {
            $scope.mapIt(question);
        }
    };    

    $scope.surpriseMe = function() {
        var keys = _.keys($scope.queries);
        var i = _.random(0, keys.length - 1);
        var question = $scope.queries[keys[i]];
        $scope.selectedQuestion = question;
        $scope.mapIt(question);

        $('#questions').animate({ scrollTop: i * 30 }, 1000);
    };

    // ---------- functions for creating each of the structures - see views/maps/generator_tab -----------

    $scope.queries = {

        WHAT_IS: function(x, y) {  // 1
            var thing1 = map.createThing(x, y, $scope.echoConcept1());
            diagram.model.setDataProperty(thing1.data, 'dflag', true);
            map.createChild(thing1, 'is?');
            map.createChild(thing1, 'is?');
            map.createChild(thing1, 'is?');
        },

        WHAT_IS_NOT: function(x, y) { // 2
            var thing1 = map.createThing(x, y, $scope.echoConcept1());
            diagram.model.setDataProperty(thing1.data, 'dflag', true);
            map.createChild(thing1, 'is not?');
            map.createChild(thing1, 'is not?');
            map.createChild(thing1, 'is not?');
        },

        DISTINGUISH_BETWEEN: function(x, y) { // 3
            var thing1 = map.createThing(x, y, $scope.echoConcept1());
            diagram.model.setDataProperty(thing1.data, 'dflag', true);
            map.createChild(thing1, 'is?');
            map.createChild(thing1, 'is?');
            map.createChild(thing1, 'is?');

            var thing2 = map.createThing(x + 250, y, $scope.echoConcept2());
            diagram.model.setDataProperty(thing2.data, 'dflag', true);
            map.createChild(thing2, 'is?');
            map.createChild(thing2, 'is?');
            map.createChild(thing2, 'is?');
        },

        COMPARE_CONTRAST: function(x, y) { // 4
            var thing1 = map.createThing(x - 150, y, $scope.echoConcept1());
            var thing2 = map.createThing(x + 150, y, $scope.echoConcept2());
            diagram.model.setDataProperty(thing1.data, 'dflag', true);
            diagram.model.setDataProperty(thing2.data, 'dflag', true);
            var rthing1 = map.createRLinkWithRThing(thing1, thing2, 'contrast');
            var rthing2 = map.createRLinkWithRThing(thing1, thing2, 'compare');
            diagram.model.setDataProperty(rthing1.labeledLink.data, 'type', 'toFrom');
            diagram.model.setDataProperty(rthing2.labeledLink.data, 'type', 'toFrom');
        },

        PARTS_OF: function(x, y) { // 5
            var thing1 = map.createThing(x, y, $scope.echoConcept1());
            map.createChild(thing1, 'part?');
            map.createChild(thing1, 'part?');
            map.createChild(thing1, 'part?');
        },

        PART_OF: function(x, y) { // 6
            var thing1 = map.createThing(x, y, 'part of?');
            map.createChild(thing1, $scope.echoConcept1());
        },

        PARTS_HAVE_PARTS: function(x, y) { // 7
            var thing1 = map.createThing(x, y, $scope.echoConcept1());
            var child1 = map.createChild(thing1, 'part?');
            map.createChild(child1, 'part?');
            map.createChild(child1, 'part?');
            var child2 = map.createChild(thing1, 'part?');
            map.createChild(child2, 'part?');
            map.createChild(child2, 'part?');
        },

        R_PARTS: function(x, y) { // 8
            var thing1 = map.createThing(x, y, $scope.echoConcept1());
            var thing2 = map.createThing(x + 250, y, $scope.echoConcept2());
            var rthing = map.createRLinkWithRThing(thing1, thing2, 'relationship?');
            map.createChild(rthing, 'part?');
            map.createChild(rthing, 'part?');
        },

        P_PARTS: function(x, y) { // 9
            var thing1 = map.createThing(x + 300, y, $scope.echoConcept1());
            var child1 = map.createChild(thing1, 'part seen from viewpoint of ' + $scope.echoConcept2() + '?');
            var child2 = map.createChild(thing1, 'part seen from viewpoint of ' + $scope.echoConcept2() + '?');
            var child3 = map.createChild(thing1, 'part seen from viewpoint of ' + $scope.echoConcept2() + '?');
            var thing2 = map.createThing(x, y, $scope.echoConcept2());
            map.createPLink(thing2, thing1);
            map.createPLink(thing2, child1);
            map.createPLink(thing2, child2);
            map.createPLink(thing2, child3);
        },

        RS_TO_AND_BY: function(x, y) { // 10
            var related1 = map.createThing(x, y, 'related idea?');
            var related2 = map.createThing(x + 300, y + 50, 'related idea?');
            var related3 = map.createThing(x + 50, y + 300, 'related idea?');
            var thing = map.createThing(x + 130, y + 130, $scope.echoConcept1());
            map.createRLink(related1, thing);
            map.createRLink(related2, thing);
            map.createRLink(related3, thing);

            var thing1 = map.createThing(x + 500, y + 150, 'idea?');
            var thing2 = map.createThing(x + 750, y + 150, 'idea?');
            map.createRLinkWithRThing(thing1, thing2, $scope.echoConcept1());
        },

        WHAT_IS_R: function(x, y) { // 11
            var thing1 = map.createThing(x, y, $scope.echoConcept1());
            var thing2 = map.createThing(x + 250, y, $scope.echoConcept2());
            map.createRLinkWithRThing(thing1, thing2, 'idea?');
        },

        PART_RS_ARE: function(x, y) { // 12
            var thing1 = map.createThing(x + 30, y, $scope.echoConcept1(), 'freehand');
            var child1 = map.createChild(thing1, 'part?');
            var child2 = map.createChild(thing1, 'part?');
            var child3 = map.createChild(thing1, 'part?');
            diagram.model.setDataProperty(child1.data, 'loc', '-20 110');
            diagram.model.setDataProperty(child2.data, 'loc', '80 110');
            diagram.model.setDataProperty(child3.data, 'loc', '30 190');
            map.createRLinkWithRThing(child1, child2, 'relationship?');
            map.createRLinkWithRThing(child2, child3, 'relationship?');
            map.createRLinkWithRThing(child3, child1, 'relationship?');
        },

        PART_RS_EXIST: function(x, y) { // 13
            var thing1 = map.createThing(x, y, $scope.echoConcept1(), 'right');
            var child11 = map.createChild(thing1, 'part?');
            var child12 = map.createChild(thing1, 'part?');
            var child13 = map.createChild(thing1, 'part?');
            var thing2 = map.createThing(x + 250, y, $scope.echoConcept2());
            var child21 = map.createChild(thing2, 'part?');
            var child22 = map.createChild(thing2, 'part?');
            var child23 = map.createChild(thing2, 'part?');
            map.createRLink(thing1, thing2);
            map.createRLinkWithRThing(child11, child21, 'relationship?');
            map.createRLinkWithRThing(child12, child22, 'relationship?');
            map.createRLinkWithRThing(child13, child23, 'relationship?');
        },

        RS_WITH_OTHERS: function(x, y) { // 14
            var thing1 = map.createThing(x - 200, y, $scope.echoConcept1());
            var thing2 = map.createThing(x + 200, y, $scope.echoConcept2());
            var thing3 = map.createThing(x - 200, y + 200, 'another thing');
            var thing4 = map.createThing(x + 200, y + 200, 'another thing');
            map.createRLinkWithRThing(thing1, thing2, 'relationship?');
            map.createRLinkWithRThing(thing1, thing3, 'relationship?');
            map.createRLinkWithRThing(thing1, thing4, 'relationship?');
            map.createRLinkWithRThing(thing2, thing4, 'relationship?');
            map.createRLinkWithRThing(thing3, thing4, 'relationship?');
        },

        PARTS_OF_P: function(x, y) { // 15
            var thing1 = map.createThing(x - 100, y, $scope.echoConcept1());
            var child1 = map.createChild(thing1, 'part?');
            var child2 = map.createChild(thing1, 'part?');
            var child3 = map.createChild(thing1, 'part?');
            var thing2 = map.createThing(x + 100, y, $scope.echoConcept2());
            map.createPLink(thing1, thing2);
        },

        POINT_FOR: function(x, y) { // 16
            var thing = map.createThing(x, y, 'new perspective');
            var thing1 = map.createThing(x - 150, y + 150, $scope.echoConcept1());
            var thing2 = map.createThing(x + 150, y + 150, $scope.echoConcept2());
            var rthing = map.createRLinkWithRThing(thing1, thing2, 'relationship?');
            map.createPLink(thing, rthing);
        },

        HAS_MULTIPLE_PS: function(x, y) { // 17
            var point1 = map.createThing(x, y + 50, 'viewpoint?');
            var point2 = map.createThing(x + 250, y, 'viewpoint?');
            var point3 = map.createThing(x + 500, y + 50, 'viewpoint?');
            var view = map.createThing(x + 250, y + 250, $scope.echoConcept1());
            map.createPLink(point1, view);
            map.createPLink(point2, view);
            map.createPLink(point3, view);
        },

        PARTS_FROM_MULTIPLE_PS: function(x, y) { // 18
            var point1 = map.createThing(x - 100, y, 'viewpoint?');
            var point2 = map.createThing(x - 100, y + 125, 'viewpoint?');
            var point3 = map.createThing(x - 100, y + 250, 'viewpoint?');
            var thing = map.createThing(x + 150, y + 25, $scope.echoConcept1());
            var child1 = map.createChild(thing, 'part seen from viewpoint?');
            var child2 = map.createChild(thing, 'part seen from viewpoint?');
            var child3 = map.createChild(thing, 'part seen from viewpoint?');
            map.createPLink(point1, child1);
            map.createPLink(point1, child2);
            map.createPLink(point2, child2);
            map.createPLink(point3, child3);
        },

        WHAT_ABOUT: function(x, y) { // 19
            $scope.queries.WHAT_IS(x, y);
            $scope.queries.PARTS_OF(x + 300, y);
            $scope.queries.PARTS_FROM_MULTIPLE_PS(x + 700, y);
            $scope.queries.RS_TO_AND_BY(x, y + 400);
        }
    }; // queries

};

GeneratorCtrl.$inject = ['$scope'];


SandbankEditor.Generator = function ($scope, map) {

    this.init = function () {
        // NB: generator is opened on load of empty map; see map.js:load()
    };

    // called when a tab is opened or closed
    this.currentTabChanged = function(newValue, oldValue) {
        if (oldValue == map.getUi().TAB_ID_GENERATOR) { // closing tab
            map.setEditingBlocked(false);
        }
        else if (newValue == map.getUi().TAB_ID_GENERATOR) { // opening tab
            map.setEditingBlocked(true);
        }
    };

    // these get filtered out in LessonBook
    this.getPlaceholderIdeaNames = function() {
        return ['is?', 'is not?', 'part?', 'viewpoint?', 'related idea?', 'idea?',
                'part seen from viewpoint?', 'contrast?', 'comparison?', 'relationship?'];
    };
};
