// functions for the generator (aka ThinkQuery)
class Generator {
    constructor(editor, map) {
        this._map = map;
        this._diagram = map.getDiagram();
        this.concept1 = '';
        this.concept2 = '';
        this.selectedQuestion = null;

        // ---------- functions for creating each of the structures - see views/maps/generator_tab -----------
        this.queries = {

            WHAT_IS: (x, y) => {  // 1
                let thing1 = this._map.createThing(x, y, this.echoConcept1());
                this._diagram.model.setDataProperty(thing1.data, 'dflag', true);
                this._map.createChild(thing1, 'is?');
                this._map.createChild(thing1, 'is?');
                this._map.createChild(thing1, 'is?');
            },

            WHAT_IS_NOT: (x, y) => { // 2
                let thing1 = this._map.createThing(x, y, this.echoConcept1());
                this._diagram.model.setDataProperty(thing1.data, 'dflag', true);
                this._map.createChild(thing1, 'is not?');
                this._map.createChild(thing1, 'is not?');
                this._map.createChild(thing1, 'is not?');
            },

            DISTINGUISH_BETWEEN: (x, y) => { // 3
                let thing1 = this._map.createThing(x, y, this.echoConcept1());
                this._diagram.model.setDataProperty(thing1.data, 'dflag', true);
                this._map.createChild(thing1, 'is?');
                this._map.createChild(thing1, 'is?');
                this._map.createChild(thing1, 'is?');

                let thing2 = this._map.createThing(x + 250, y, this.echoConcept2());
                this._diagram.model.setDataProperty(thing2.data, 'dflag', true);
                this._map.createChild(thing2, 'is?');
                this._map.createChild(thing2, 'is?');
                this._map.createChild(thing2, 'is?');
            },

            COMPARE_CONTRAST: (x, y) => { // 4
                let thing1 = this._map.createThing(x - 150, y, this.echoConcept1());
                let thing2 = this._map.createThing(x + 150, y, this.echoConcept2());
                this._diagram.model.setDataProperty(thing1.data, 'dflag', true);
                this._diagram.model.setDataProperty(thing2.data, 'dflag', true);
                let rthing1 = this._map.createRLinkWithRThing(thing1, thing2, 'contrast');
                let rthing2 = this._map.createRLinkWithRThing(thing1, thing2, 'compare');
                this._diagram.model.setDataProperty(rthing1.labeledLink.data, 'type', 'toFrom');
                this._diagram.model.setDataProperty(rthing2.labeledLink.data, 'type', 'toFrom');
            },

            PARTS_OF: (x, y) => { // 5
                let thing1 = this._map.createThing(x, y, this.echoConcept1());
                this._map.createChild(thing1, 'part?');
                this._map.createChild(thing1, 'part?');
                this._map.createChild(thing1, 'part?');
            },

            PART_OF: (x, y) => { // 6
                let thing1 = this._map.createThing(x, y, 'part of?');
                this._map.createChild(thing1, this.echoConcept1());
            },

            PARTS_HAVE_PARTS: (x, y) => { // 7
                let thing1 = this._map.createThing(x, y, this.echoConcept1());
                let child1 = this._map.createChild(thing1, 'part?');
                this._map.createChild(child1, 'part?');
                this._map.createChild(child1, 'part?');
                let child2 = this._map.createChild(thing1, 'part?');
                this._map.createChild(child2, 'part?');
                this._map.createChild(child2, 'part?');
            },

            R_PARTS: (x, y) => { // 8
                let thing1 = this._map.createThing(x, y, this.echoConcept1());
                let thing2 = this._map.createThing(x + 250, y, this.echoConcept2());
                let rthing = this._map.createRLinkWithRThing(thing1, thing2, 'relationship?');
                this._map.createChild(rthing, 'part?');
                this._map.createChild(rthing, 'part?');
            },

            P_PARTS: (x, y) => { // 9
                let thing1 = this._map.createThing(x + 300, y, this.echoConcept1());
                let child1 = this._map.createChild(thing1, 'part seen from viewpoint of ' + this.echoConcept2() + '?');
                let child2 = this._map.createChild(thing1, 'part seen from viewpoint of ' + this.echoConcept2() + '?');
                let child3 = this._map.createChild(thing1, 'part seen from viewpoint of ' + this.echoConcept2() + '?');
                let thing2 = this._map.createThing(x, y, this.echoConcept2());
                this._map.createPLink(thing2, thing1);
                this._map.createPLink(thing2, child1);
                this._map.createPLink(thing2, child2);
                this._map.createPLink(thing2, child3);
            },

            RS_TO_AND_BY: (x, y) => { // 10
                let related1 = this._map.createThing(x, y, 'related idea?');
                let related2 = this._map.createThing(x + 300, y + 50, 'related idea?');
                let related3 = this._map.createThing(x + 50, y + 300, 'related idea?');
                let thing = this._map.createThing(x + 130, y + 130, this.echoConcept1());
                this._map.createRLink(related1, thing);
                this._map.createRLink(related2, thing);
                this._map.createRLink(related3, thing);

                let thing1 = this._map.createThing(x + 500, y + 150, 'idea?');
                let thing2 = this._map.createThing(x + 750, y + 150, 'idea?');
                this._map.createRLinkWithRThing(thing1, thing2, this.echoConcept1());
            },

            WHAT_IS_R: (x, y) => { // 11
                let thing1 = this._map.createThing(x, y, this.echoConcept1());
                let thing2 = this._map.createThing(x + 250, y, this.echoConcept2());
                this._map.createRLinkWithRThing(thing1, thing2, 'idea?');
            },

            PART_RS_ARE: (x, y) => { // 12
                let thing1 = this._map.createThing(x + 30, y, this.echoConcept1(), 'freehand');
                let child1 = this._map.createChild(thing1, 'part?');
                let child2 = this._map.createChild(thing1, 'part?');
                let child3 = this._map.createChild(thing1, 'part?');
                this._diagram.model.setDataProperty(child1.data, 'loc', '-20 110');
                this._diagram.model.setDataProperty(child2.data, 'loc', '80 110');
                this._diagram.model.setDataProperty(child3.data, 'loc', '30 190');
                this._map.createRLinkWithRThing(child1, child2, 'relationship?');
                this._map.createRLinkWithRThing(child2, child3, 'relationship?');
                this._map.createRLinkWithRThing(child3, child1, 'relationship?');
            },

            PART_RS_EXIST: (x, y) => { // 13
                let thing1 = this._map.createThing(x, y, this.echoConcept1(), 'right');
                let child11 = this._map.createChild(thing1, 'part?');
                let child12 = this._map.createChild(thing1, 'part?');
                let child13 = this._map.createChild(thing1, 'part?');
                let thing2 = this._map.createThing(x + 250, y, this.echoConcept2());
                let child21 = this._map.createChild(thing2, 'part?');
                let child22 = this._map.createChild(thing2, 'part?');
                let child23 = this._map.createChild(thing2, 'part?');
                this._map.createRLink(thing1, thing2);
                this._map.createRLinkWithRThing(child11, child21, 'relationship?');
                this._map.createRLinkWithRThing(child12, child22, 'relationship?');
                this._map.createRLinkWithRThing(child13, child23, 'relationship?');
            },

            RS_WITH_OTHERS: (x, y) => { // 14
                let thing1 = this._map.createThing(x - 200, y, this.echoConcept1());
                let thing2 = this._map.createThing(x + 200, y, this.echoConcept2());
                let thing3 = this._map.createThing(x - 200, y + 200, 'another thing');
                let thing4 = this._map.createThing(x + 200, y + 200, 'another thing');
                this._map.createRLinkWithRThing(thing1, thing2, 'relationship?');
                this._map.createRLinkWithRThing(thing1, thing3, 'relationship?');
                this._map.createRLinkWithRThing(thing1, thing4, 'relationship?');
                this._map.createRLinkWithRThing(thing2, thing4, 'relationship?');
                this._map.createRLinkWithRThing(thing3, thing4, 'relationship?');
            },

            PARTS_OF_P: (x, y) => { // 15
                let thing1 = this._map.createThing(x - 100, y, this.echoConcept1());
                let child1 = this._map.createChild(thing1, 'part?');
                let child2 = this._map.createChild(thing1, 'part?');
                let child3 = this._map.createChild(thing1, 'part?');
                let thing2 = this._map.createThing(x + 100, y, this.echoConcept2());
                this._map.createPLink(thing1, thing2);
            },

            POINT_FOR: (x, y) => { // 16
                let thing = this._map.createThing(x, y, 'new perspective');
                let thing1 = this._map.createThing(x - 150, y + 150, this.echoConcept1());
                let thing2 = this._map.createThing(x + 150, y + 150, this.echoConcept2());
                let rthing = this._map.createRLinkWithRThing(thing1, thing2, 'relationship?');
                this._map.createPLink(thing, rthing);
            },

            HAS_MULTIPLE_PS:  (x, y) => { // 17
                let point1 = this._map.createThing(x, y + 50, 'viewpoint?');
                let point2 = this._map.createThing(x + 250, y, 'viewpoint?');
                let point3 = this._map.createThing(x + 500, y + 50, 'viewpoint?');
                let view = this._map.createThing(x + 250, y + 250, this.echoConcept1());
                this._map.createPLink(point1, view);
                this._map.createPLink(point2, view);
                this._map.createPLink(point3, view);
            },

            PARTS_FROM_MULTIPLE_PS: (x, y) => { // 18
                let point1 = this._map.createThing(x - 100, y, 'viewpoint?');
                let point2 = this._map.createThing(x - 100, y + 125, 'viewpoint?');
                let point3 = this._map.createThing(x - 100, y + 250, 'viewpoint?');
                let thing = this._map.createThing(x + 150, y + 25, this.echoConcept1());
                let child1 = this._map.createChild(thing, 'part seen from viewpoint?');
                let child2 = this._map.createChild(thing, 'part seen from viewpoint?');
                let child3 = this._map.createChild(thing, 'part seen from viewpoint?');
                this._map.createPLink(point1, child1);
                this._map.createPLink(point1, child2);
                this._map.createPLink(point2, child2);
                this._map.createPLink(point3, child3);
            },

            WHAT_ABOUT: (x, y) => { // 19
                this.queries.WHAT_IS(x, y);
                this.queries.PARTS_OF(x + 300, y);
                this.queries.PARTS_FROM_MULTIPLE_PS(x + 700, y);
                this.queries.RS_TO_AND_BY(x, y + 400);
            }
        }; // queries
    }

    echoConcept1() {
        return this.concept1 || '...';
    }

    echoConcept2() {
        return this.concept2 || '...';
    }

    swapConcepts() {
        let tmp = this.concept1;
        this.concept1 = this.concept2;
        this.concept2 = tmp;
    }

    mapIt(question) {
        
        this._map.autosave.saveOnModelChanged = false;

        if ($scope.sandbox) {
            this._diagram.clear();
        }

        // figure out location for inserted stuff
        let db = this._map.computeMapBounds();
        let x = db.x + db.width + 200;
        let y = db.y;
        if (isNaN(x) || isNaN(y)) {
            x = y = 0;
        }
        //console.log('x, y: ' + x + ', ' + y);

        // insert the stuff and deselect it
        question(x, y);
        this._diagram.clearSelection();

        this._diagram.updateAllTargetBindings();
        this._diagram.layoutDiagram(true);

        this._map.ui.resetZoom();

        this._map.autosave.saveOnModelChanged = true;
        this._map.autosave.save('edit_generator');
    }

    selectQuestion(question) {
        this.selectedQuestion = question;
        if ($scope.sandbox) {
            this.mapIt(question);
        }
    }

    surpriseMe() {
        let keys = _.keys(this.queries);
        let i = _.random(0, keys.length - 1);
        let question = this.queries[keys[i]];
        this.selectedQuestion = question;
        this.mapIt(question);

        $('#questions').animate({ scrollTop: i * 30 }, 1000);
    }

    // called when a tab is opened or closed
    currentTabChanged(newValue, oldValue) {
        if (oldValue === this._map.ui.TAB_ID_GENERATOR) { // closing tab
            this._map.setEditingBlocked(false);
        }
        else if (newValue === this._map.ui.TAB_ID_GENERATOR) { // opening tab
            this._map.setEditingBlocked(true);
        }
    }

    // these get filtered out in LessonBook
    getPlaceholderIdeaNames() {
        return ['is?', 'is not?', 'part?', 'viewpoint?', 'related idea?', 'idea?',
                'part seen from viewpoint?', 'contrast?', 'comparison?', 'relationship?'];
    }
}

module.exports = Generator;