
SandbankEditor.Tests = function ($scope, map) {

    var self = this;

    this.TEST_STATUS_NOT_RUN = 'not-run';
    this.TEST_STATUS_PASSED = 'passed';
    this.TEST_STATUS_EXAMINE = 'examine';
    this.TEST_STATUS_FAILED = 'failed';

    this.currentTest = null;

    this.init = function () {
    };

    this.runTest = function(name) {
        $scope.safeApply(function() {
            var diagram = map.getDiagram();
            var test = _.findWhere(self.tests, { name: name });
            test.status = self.TEST_STATUS_NOT_RUN;
            self.currentTest = test;
            diagram.clear();
            test.run(diagram);
            if (test.check === undefined) {
                test.status = self.TEST_STATUS_EXAMINE;
            }
            else {
                test.failReason = test.check(diagram);
                if (_.isString(test.failReason)) {
                    test.status = self.TEST_STATUS_FAILED;       
                }
                else {
                    test.status = self.TEST_STATUS_PASSED;       
                }
            }
        });        
    };

    this.createGeneratorTest = function(name, mapItFn) {
        return {
            name: 'ThinkQ: ' + name,
            run: function(diagram) { self.runGeneratorTest(mapItFn); }
        };
    };

    this.runGeneratorTest = function(mapItFn) {
        var diagram = map.getDiagram();
        var generator = map.getGenerator();
        generator.concept1 = 'CONCEPT 1';
        generator.concept2 = 'CONCEPT 2';
        generator.mapIt(mapItFn);
    };

    this.tests = [
        // {
        //     name: '[Failed test]',
        //     run: function(diagram) {
        //     },
        //     check: function(diagram) {
        //         return 'This test failed - this is only a test.';
        //     }
        // },
        {
            name: 'Reset map',
            run: function(diagram) {
                diagram.toolManager.clickCreatingTool.insertPart(new go.Point(0,0));
                map.refresh();
            },
            check: function(diagram) {
                return diagram.findTopLevelGroups().count == 1;
            }
        },
        {
            name: 'Create Sister',
            run: function(diagram) {
                diagram.toolManager.clickCreatingTool.insertPart(new go.Point(0,0));
                var group = diagram.findTopLevelGroups().first();
                map.createSister(group);
            },
            check: function(diagram) {
                return diagram.findTopLevelGroups().count == 2;
            }
        },
        {
            name: 'Create R to Sister',
            run: function(diagram) {
                diagram.toolManager.clickCreatingTool.insertPart(new go.Point(0,0));
                var group = diagram.findTopLevelGroups().first();
                map.createRToSister(group);
            }
        },
        {
            name: 'Create Child',
            run: function(diagram) {
                diagram.toolManager.clickCreatingTool.insertPart(new go.Point(0,0));
                var group = diagram.findTopLevelGroups().first();
                map.createChild(group);
            }
        },
        {
            name: 'Create 3 children and switch to freehand',
            run: function(diagram) {
                diagram.toolManager.clickCreatingTool.insertPart(new go.Point(0,0));
                var group = diagram.findTopLevelGroups().first();
                map.createChild(group);
                map.createChild(group);
                map.createChild(group);
                // diagram.model.setDataProperty(group.data, 'layout', 'freehand');
                group.isSelected = true;
                map.getUi().setSelectedThingsLayout('freehand');
            },
            check: function(diagram) {
                if (diagram.findTopLevelGroups().count != 1) {
                    return 'Top level group count is not 1';
                }
                var group = diagram.findTopLevelGroups().first();
                if (group.memberParts.count != 3) {
                    return 'Parent data children is not 3';
                }
                return true;
            }
        },
        {
            name: 'Drag RTBB into outline S',
            instructions: 'Drag the preselected RTBB into Whole (S), then do an Undo',
            run: function(diagram) {
                var whole = map.createThing(0, 0, 'Whole', 'left');
                var part1 = map.createThing(250, 0, 'Part 1');
                var subpart11 = map.createChild(part1, 'Subpart 1.1');
                var part2 = map.createThing(500, 0, 'Part 2');
                var rThing = map.createRLinkWithRThing(part1, part2, 'Rthing');
                map.refresh();
                diagram.clearSelection();
                part1.isSelected = true;
                part2.isSelected = true;
            }
        },
        {
            name: 'Drag RTBB into freehand S',
            instructions: 'Drag the preselected RTBB into Whole (S) and examine layout',
            run: function(diagram) {
                var whole = map.createThing(0, 0, 'Whole', 'freehand');
                var oldPart1 = map.createChild(whole, 'Old Part 1');
                var part1 = map.createThing(250, 30, 'Part 1');
                var subpart11 = map.createChild(part1, 'Subpart 1.1');
                var part2 = map.createThing(500, 70, 'Part 2');
                var rThing = map.createRLinkWithRThing(part1, part2, 'Rthing');
                map.refresh();
                diagram.clearSelection();
                part1.isSelected = true;
                part2.isSelected = true;
            }
        },
        {
            name: 'Create RTBB in outline and switch to freehand',
            instructions: 'Check auto-generated freehand layout of parts',
            run: function(diagram) {
                var whole = map.createThing(0, 0, 'Whole', 'left');
                var part1 = map.createChild(whole, 'Part 1');
                var subpart11 = map.createChild(part1, 'Subpart 1.1');
                var part2 = map.createChild(whole, 'Part 2');
                var rThing = map.createRLinkWithRThing(part1, part2, 'Rthing');
                whole.isSelected = true;
                map.getUi().setSelectedThingsLayout('freehand');
                //diagram.model.setDataProperty(whole.data, 'layout', 'freehand');
                //map.refresh();
                diagram.clearSelection();
            }
        },

        // create RTBB in freehand, add part in outline, switch back to freehand
        // create RTBB in freehand, drag in part in outline, switch back to freehand

        {
            name: 'Drag RTBB out of S',
            instructions: 'Drag the preselected RTBB onto Whole (D)',
            run: function(diagram) {
                var whole = map.createThing(0, 0, 'Whole', 'left');
                var part1 = map.createChild(whole, 'Part 1');
                var subpart11 = map.createChild(part1, 'Subpart 1.1');
                var part2 = map.createChild(whole, 'Part 2');
                var rThing = map.createRLinkWithRThing(part1, part2, 'Rthing');
                map.refresh();
                diagram.clearSelection();
                part1.isSelected = true;
                part2.isSelected = true;
            }
        },
        {
            name: 'Drag RTBB out of freehand S',
            instructions: 'Drag the preselected RTBB onto Whole (D)',
            run: function(diagram) {
                var whole = map.createThing(0, 0, 'Whole', 'freehand');
                var part1 = map.createChild(whole, 'Part 1', 10, 120);
                var subpart11 = map.createChild(part1, 'Subpart 1.1');
                var part2 = map.createChild(whole, 'Part 2', 110, 150);
                var rThing = map.createRLinkWithRThing(part1, part2, 'Rthing');
                map.refresh();
                diagram.clearSelection();
                part1.isSelected = true;
                part2.isSelected = true;
            }
        },
        {
            name: 'Drag RTBB out of 2nd level S',
            instructions: 'Drag the preselected RTBB onto Whole (D) of Part 1',
            run: function(diagram) {
                var whole = map.createThing(0, 0, 'Whole', 'left');
                var part1 = map.createChild(whole, 'Part 1');
                var subpart11 = map.createChild(part1, 'Subpart 1.1');
                var subpart12 = map.createChild(part1, 'Subpart 1.2');
                var rThing = map.createRLinkWithRThing(subpart11, subpart12, 'Rthing');
                var part2 = map.createChild(whole, 'Part 2');
                map.refresh();
                diagram.clearSelection();
                subpart11.isSelected = true;
                subpart12.isSelected = true;
            }
        },
        {
            name: 'Drag RTBB out of 2nd level freehand S',
            instructions: 'Drag the preselected RTBB onto Whole (D) of Part 1',
            run: function(diagram) {
                var whole = map.createThing(0, 0, 'Whole', 'freehand');
                var part1 = map.createChild(whole, 'Part 1', 0, 120);
                var subpart11 = map.createChild(part1, 'Subpart 1.1', 10, 180);
                var subpart12 = map.createChild(part1, 'Subpart 1.2', 20, 220);
                var rThing = map.createRLinkWithRThing(subpart11, subpart12, 'Rthing');
                var part2 = map.createChild(whole, 'Part 2', 0, 300);
                map.refresh();
                diagram.clearSelection();
                subpart11.isSelected = true;
                subpart12.isSelected = true;
            }
        },
        {
            name: 'Rchannel',
            instructions: 'Note that R-things are in part-whole relation',
            run: function(diagram) {
                var thing1 = map.createThing(0, 0, 'Whole 1', 'right');
                var child11 = map.createChild(thing1, 'Part 1.1');
                var thing2 = map.createThing(250, 0, 'Whole 2');
                var child21 = map.createChild(thing2, 'Part 2.1');
                
                var rThing1 = map.createRLinkWithRThing(thing1, thing2, 'Rthing 1-2');
                var rThing11 = map.createRLinkWithRThing(child11, child21, 'Rthing 1.1 - 2.1');
                //console.log('Rchannel, rThing11: ' + rThing11);

                diagram.clearSelection();
                rThing11.isSelected = true;
                map.addSelectedThingsAsChildrenOf(rThing1);
            }
        },
        {
            name: 'Disappearing parts on new idea creation',
            instructions: 'Create a new top-level idea - Part 1.1 should not disappear temporarily',
            run: function(diagram) {
                var thing1 = map.createThing(0, 0, 'Whole 1', 'right');
                var child11 = map.createChild(thing1, 'Part 1.1');
            }
        },
        {
            name: 'Drag top-level thing into freehand system',
            instructions: 'Drag New Part into Whole; examine resulting part layout',
            run: function(diagram) {
                var thing1 = map.createThing(0, 0, 'Whole', 'freehand');
                var child11 = map.createChild(thing1, 'Part');
                var newPart = map.createThing(250, 0, 'New Part', 'left');
            }
        },
        {
            name: 'Drag top-level RTBB into freehand system',
            instructions: 'Drag preselected RTBB into Whole; examine resulting part layout',
            run: function(diagram) {
                var thing1 = map.createThing(0, 0, 'Whole', 'freehand');
                var child11 = map.createChild(thing1, 'Part');
                var bar = map.createThing(250, 0, 'Bar', 'left');
                var bell = map.createThing(500, 0, 'Bell', 'left');
                var rThing = map.createRLinkWithRThing(bar, bell, 'Rthing');
                map.refresh();
                diagram.clearSelection();
                bar.isSelected = true;
                bell.isSelected = true;
            }
        },
        {
            name: 'Drag R-thing square into freehand system',
            instructions: 'Drag preselected square into Whole; examine resulting part layout',
            run: function(diagram) {
                var whole = map.createThing(-100, 50, 'Whole', 'freehand');
                var child11 = map.createChild(whole, 'Part');
                var part11 = map.createThing(250, 0, 'Part11', 'left');
                var part12 = map.createThing(500, 0, 'Part12', 'left');
                var part21 = map.createThing(250, 250, 'Part21', 'left');
                var part22 = map.createThing(500, 250, 'Part22', 'left');

                var rThing11_12 = map.createRLinkWithRThing(part11, part12, 'Rthing 11-12');
                var rThing11_21 = map.createRLinkWithRThing(part11, part21, 'Rthing 11-21');
                var rThing12_22 = map.createRLinkWithRThing(part12, part22, 'Rthing 12-22');
                var rThing21_22 = map.createRLinkWithRThing(part21, part22, 'Rthing 21-22');
                map.refresh();
                diagram.clearSelection();
                part11.isSelected = true;
                part12.isSelected = true;
                part21.isSelected = true;
                part22.isSelected = true;
            }
        },
        {
            name: 'Drag R-thing square out of freehand system',
            instructions: 'Drag preselected square onto D of Whole; examine resulting layout',
            run: function(diagram) {
                var whole = map.createThing(-100, 50, 'Whole', 'freehand');
                var child11 = map.createChild(whole, 'Part');
                var part11 = map.createChild(whole, 'Part11', 10, 190);
                var part12 = map.createChild(whole, 'Part12', 120, 190);
                var part21 = map.createChild(whole, 'Part21', 10, 300);
                var part22 = map.createChild(whole, 'Part22', 120, 300);

                var rThing11_12 = map.createRLinkWithRThing(part11, part12, 'Rthing 11-12');
                var rThing11_21 = map.createRLinkWithRThing(part11, part21, 'Rthing 11-21');
                var rThing12_22 = map.createRLinkWithRThing(part12, part22, 'Rthing 12-22');
                var rThing21_22 = map.createRLinkWithRThing(part21, part22, 'Rthing 21-22');
                map.refresh();
                diagram.clearSelection();
                part11.isSelected = true;
                part12.isSelected = true;
                part21.isSelected = true;
                part22.isSelected = true;
            }
        },
        {
            name: 'Drag 2nd level part to D of parent',
            instructions: 'Drag Subpart 1.1 onto D of Part 1; it should appear below Part 1',
            run: function(diagram) {
                var whole = map.createThing(0, 0, 'Whole', 'left');
                var part1 = map.createChild(whole, 'Part 1');
                var subpart11 = map.createChild(part1, 'Subpart 1.1');
                var part2 = map.createChild(whole, 'Part 2');
                map.refresh();
                diagram.clearSelection();
            }
        },
        {
            name: 'Invisible R-thing in 2nd level of outline',
            instructions: 'R-thing between Subparts 1.1 and 1.2 should be visible',
            run: function(diagram) {
                var whole = map.createThing(0, 0, 'Whole', 'left');
                var part1 = map.createChild(whole, 'Part 1');
                var subpart11 = map.createChild(part1, 'Subpart 1.1');
                var subpart12 = map.createChild(part1, 'Subpart 1.2');
                var rThing = map.createRLinkWithRThing(subpart11, subpart12, 'Rthing');
                rThing.desiredSize = new go.Size(30,30);
                map.refresh();
                //console.log('rThing actualBounds: ' + rThing.actualBounds + ', scale: ' + rThing.scale + ', desiredSize: ' + rThing.desiredSize);
                //console.log('Whole desiredSize: ' + whole.desiredSize);
                diagram.clearSelection();
            }
        },
        {
            name: 'R-thing between ideas in same location (error)',
            instructions: 'This should trigger an error',
            run: function(diagram) {
                // try {
                    var part1 = map.createThing(0, 0, 'Part 1', 'left');
                    var part2 = map.createThing(0, 0, 'Part 2', 'left');
                    var rThing = map.createRLinkWithRThing(part1, part2, 'Rthing');
                    map.refresh();
                // } catch(e) {
                //     alert(e.message);
                // }
            }
        },
        // {
        //     name: 'Fix bad R-thing leading to infinite loop',
        //     instructions: 'Map should display and not trigger infinite loop; model should be fixed so that r-thing is not Part 1.1 or Part 1.2',
        //     run: function(diagram) {
        //         var thing1 = map.createThing(-100, 0, 'Thing1', 'freehand');
        //         var child11 = map.createChild(thing1, 'Part 1.1');
        //         var child12 = map.createChild(thing1, 'Part 1.2');
        //         var rThing = map.createRLinkWithRThing(child11, child12, 'Rthing');
        //         var rLink = rThing.labeledLink;
        //         rLink.data.labelKeys = [child11.data.key];
        //         map.checkModel();
        //         map.refresh();
        //     }
        // },
        {
            name: 'Drag to create R-line',
            instructions: 'Drag from the R-corner of Thing1 to Thing2; temporary drag line and square should be R-color; created line should be an R-line',
            run: function(diagram) {
                var thing1 = map.createThing(-100, 0, 'Thing1', 'freehand');
                var thing2 = map.createThing(100, 0, 'Thing2', 'freehand');
            }
        },
        {
            name: 'Drag to create P-line',
            instructions: 'Drag from the P-corner of Thing1 to Thing2; temporary drag line and square should be P-color; created line should be a P-line',
            run: function(diagram) {
                var thing1 = map.createThing(-100, 0, 'Thing1', 'freehand');
                var thing2 = map.createThing(100, 0, 'Thing2', 'freehand');
            }
        },
        {
            name: 'Relink from-port of R-line',
            instructions: 'Move the start of the R-link from Thing 1 to Thing 3; make sure it does not turn into a P-link',
            run: function(diagram) {
                var thing1 = map.createThing(-100, 0, 'Thing1', 'freehand');
                var thing2 = map.createThing(300, 0, 'Thing2', 'freehand');
                var thing3 = map.createThing(100, 200, 'Thing3', 'freehand');
                var rlink = map.createRLink(thing1, thing2);
            }
        },
        {
            name: 'Relink to-port of R-line',
            instructions: 'Move the end of the R-link from Thing 2 to Thing 3; make sure it does not turn into a P-link',
            run: function(diagram) {
                var thing1 = map.createThing(-100, 0, 'Thing1', 'freehand');
                var thing2 = map.createThing(300, 0, 'Thing2', 'freehand');
                var thing3 = map.createThing(100, 200, 'Thing3', 'freehand');
                var rlink = map.createRLink(thing1, thing2);
            }
        },
        {
            name: 'Showing parts of parts of a freehand whole',
            instructions: 'Whole, Part 1 and Subpart 1.1 should all be visible',
            run: function(diagram) {
                var whole = map.createThing(0, 0, 'Whole', 'freehand');
                var part1 = map.createChild(whole, 'Part 1');
                var subpart11 = map.createChild(part1, 'Subpart 1.1');
                map.refresh();
                diagram.clearSelection();
            }
        }


        // self.createGeneratorTest('WHAT_IS', map.getGenerator().WHAT_IS),
        // self.createGeneratorTest('PARTS_OF', map.getGenerator().PARTS_OF),
        // self.createGeneratorTest('PART_OF', map.getGenerator().PART_OF),
        // self.createGeneratorTest('PARTS_HAVE_PARTS', map.getGenerator().PARTS_HAVE_PARTS),
        // self.createGeneratorTest('POINT_FOR', map.getGenerator().POINT_FOR),
        // self.createGeneratorTest('HAS_MULTIPLE_PS', map.getGenerator().HAS_MULTIPLE_PS),
        // self.createGeneratorTest('R_TO', map.getGenerator().R_TO),
        // self.createGeneratorTest('R_EXISTS', map.getGenerator().R_EXISTS),
        // self.createGeneratorTest('WHAT_IS_R', map.getGenerator().WHAT_IS_R),
        // self.createGeneratorTest('DISTINGUISH_BETWEEN', map.getGenerator().DISTINGUISH_BETWEEN),
        // self.createGeneratorTest('IS_R_BETWEEN', map.getGenerator().IS_R_BETWEEN),
        // self.createGeneratorTest('CAN_BE_P', map.getGenerator().CAN_BE_P),
        // self.createGeneratorTest('MULTIPLE_PS_ARE', map.getGenerator().MULTIPLE_PS_ARE),
        // self.createGeneratorTest('P_PARTS', map.getGenerator().P_PARTS),
        // self.createGeneratorTest('COMPARE_CONTRAST', map.getGenerator().COMPARE_CONTRAST),
        // self.createGeneratorTest('R_PARTS', map.getGenerator().R_PARTS),
        // self.createGeneratorTest('PARTS_HAVE_RS', map.getGenerator().PARTS_HAVE_RS),
        // self.createGeneratorTest('PART_RS_EXIST', map.getGenerator().PART_RS_EXIST),
        // self.createGeneratorTest('PART_RS_ARE', map.getGenerator().PART_RS_ARE),
        // self.createGeneratorTest('WHAT_ABOUT', map.getGenerator().WHAT_ABOUT)


// computePartsBounds

// createRThing
// addSelectedThingsAsChildrenOf
// addSelectedThingAsOrderedSisterOf
// addSelectedThingsAsSistersOf
// addThingAsRThing
// toggleDFlag
// toggleSExpansion
// togglePExpansion

// presenter: select first slide and hit play; make sure first slide notes appear



    ];
    
};


