// functions for the presenter/slides

SandbankEditor.Presenter = function ($scope, map) {

    var self = this;

    // constants
    this.SLIDE_BLOCKER_WIDTH = 1000;
    this.SLIDE_BLOCKER_COLOR = "#fff";
    this.SLIDE_BLOCKER_OPACITY = 0.9;

    // state vars
    this.currentSlideIndex = null;
    this.isPresenting = false;
    this.showTOC = false;
    this.isCreatingThumbnail = false;

    // mask applied around slide region when presenting
    this.slideBlocker = null;

    this.diagramAspectRatio = null;

    this.init = function () {
    };

    this.autosave = function() {
        map.getAutosave().save('edit_presenter'); 
    };

    // ---------- editing functions for different slide types -------------

    // NB: hasLinks can have values false, 1, or true (1 means only a single link)
    this.slideTypes = [
        {
            name: 'TITLE_BODY', label: 'Title and Body',
            hasTitle: true,  hasNotes: true,  hasChecks: false, hasMapRegion: false, hasMapSummary: false, hasLinks: false
        },
        { 
            name: 'TITLE_BODY_MAP', label: 'Title, Body and MetaMap',
            hasTitle: true,  hasNotes: true,  hasChecks: false, hasMapRegion: true,  hasMapSummary: false, hasLinks: false
        },
        { 
            name: 'ACTIVITY_MAP', label: 'Lesson Activity and MetaMap',
            hasTitle: true,  hasNotes: true,  hasChecks: true,  hasMapRegion: true,  hasMapSummary: false, hasLinks: true
        },
        { 
            name: 'MAP_ONLY', label: 'MetaMap only',
            hasTitle: true,  hasNotes: false, hasChecks: false, hasMapRegion: true,  hasMapSummary: false, hasLinks: false
        },
        { 
            name: 'MAP_SUMMARY', label: 'MetaMap Summary',
            hasTitle: false, hasNotes: false, hasChecks: false, hasMapRegion: true, hasMapSummary: true, hasLinks: false
        }
    ];

    // ------------------ link/attachment types -----------------------

    this.linkTypes = [
        { name: '', label: '-- Select attachment type --' },
        { name: 'WEB', label: 'Web Page' },
        { name: 'PDF', label: 'PDF' },
        { name: 'DOC', label: 'Document' },
        { name: 'SPREADSHEET', label: 'Spreadsheet' },
        { name: 'PRESENTATION', label: 'Presentation' },
        { name: 'METAMAP', label: 'MetaMap' },
        { name: 'IMAGE', label: 'Image' },
        { name: 'AUDIO', label: 'Audio' },
        { name: 'VIDEO', label: 'Video' },
        { name: 'SURVEY', label: 'Survey' },
        { name: 'WORKSHEET', label: 'Worksheet' }
    ];

    // ------------ list of all things in the map, for map summary slides ---------------------

    this.ideaList = '';

    // only call this occasionally, as they won't be editing the map while presenter is open
    function updateIdeaList() {
        var nodes = map.getDiagram().nodes;
        var list = [];
        while (nodes.next()) {
            if ((nodes.value instanceof go.Group)) {
                list.push(nodes.value.data.text);
            }
        }
        list.sort();

        // filter out placeholder names - see map.js:getNewThingData, createSister, etc.
        list = _.difference(_.uniq(list, true), 
            map.getGenerator().getPlaceholderIdeaNames(), 
            ['New Idea', 'New Distinguished Idea', 'New Related Idea', 'New Relationship Idea', 'New Part Idea',
             'Idea', 'Part', 'Relationship Idea'] // newer simplified names
        );

        self.ideaList = list.join(', ');
    }

    this.summaryAnalytics = [
        { name: 'COUNT_THINGS', singularLabel: 'Distinction', pluralLabel: 'Distinctions' },
        { name: 'COUNT_SYSTEMS', singularLabel: 'System', pluralLabel: 'Systems' },
        { name: 'COUNT_RELATIONSHIPS', singularLabel: 'Relationship', pluralLabel: 'Relationships' },
        { name: 'COUNT_PERSPECTIVES', singularLabel: 'Perspective', pluralLabel: 'Perspectives' },
        { name: 'COUNT_RTHINGS', singularLabel: 'Relationship Idea', pluralLabel: 'Relationship Ideas' },
        { name: 'COUNT_SYSTEM_RTHINGS', singularLabel: 'Relationship System', pluralLabel: 'Relationship Systems' },
        { name: 'COUNT_SYSTEM_PERSPECTIVES', singularLabel: 'Perspective System', pluralLabel: 'Perspective Systems' },
        { name: 'COUNT_DISTINCTIONS', singularLabel: 'Advanced Distinction', pluralLabel: 'Advanced Distinctions' },
    ];

    this.addCheck = function(nodeData) {
         nodeData.checks.push({ text: '' });
         self.autosave();
    };

    this.deleteCheck = function (check, nodeData) {
        var i = _.indexOf(nodeData.checks, check);
        nodeData.checks.splice(i, 1);
        self.autosave();
    };

    this.addLink = function(nodeData) {
        nodeData.links.push({ title: '', url: '', type: '' });
        self.autosave();
    };

    this.deleteLink = function (link, nodeData) {
        var i = _.indexOf(nodeData.links, link);
        nodeData.links.splice(i, 1);
        self.autosave();
    };

    this.toggleTOC = function() {
        $scope.safeApply(function() {
            if (self.isPresenting) {
                self.showTOC = !self.showTOC;
            }
        });
    };

    // NB: can't create this in init as the diagram doesn't exist yet...
    function maybeInitSlideBlocker() {
        if (!self.slideBlocker) {
            var mk = go.GraphObject.make;
            self.slideBlocker = mk(go.Node, go.Panel.Auto,
                { 
                    layerName: 'Tool',
                    opacity: self.SLIDE_BLOCKER_OPACITY
                },
                mk(go.Shape, "Rectangle",
                    {
                        fill: null,
                        stroke: self.SLIDE_BLOCKER_COLOR,
                        strokeWidth:1000
                    }
                )
            );
            map.getDiagram().add(self.slideBlocker);
        }
    }

    // called when a tab is opened or closed
    this.currentTabChanged = function(newValue, oldValue) {
        if (oldValue == map.getUi().TAB_ID_PRESENTER) { // closing tab
            self.stopPresenting();
        }
        else if (newValue == map.getUi().TAB_ID_PRESENTER) { // opening tab
            // show slides (see layouts.slideTemplate, binding of visible attr)
            self.diagramAspectRatio = $('#diagram').width() / $('#diagram').height();        
            console.log('diagramAspectRatio: ' + self.diagramAspectRatio);

            $scope.map.getDiagram().updateAllTargetBindings();
            updateIdeaList();
            if (!self.currentSlideIndex && self.getSlideNodeDatas().length > 0) {
                self.currentSlideIndex = 1;
            }
            self.slideThumbnailSelected(1);
        }
    };

    this.handleDiagramEvent = function (eventName, e) {
        if (!map.getUi().currentTabIs(map.getUi().TAB_ID_PRESENTER)) {
            return;
        }

        if (eventName == 'SelectionDeleting') {
            var selection = e.subject;
            if (selection.count == 1) {
                var thing = selection.first();
                if (thing instanceof go.Node && thing.data.category == 'slide') {
                    if (!confirm("Delete this slide from the presentation?")) {
                        e.cancel = true;
                    }
                }
            }
        }
        else if (eventName == 'SelectionDeleted') {
            // if slide is deleted from canvas rather than by thumbnail x button, need to update indexes
            compactSlideIndexes();
        }
        else if (eventName == 'SelectionMoved' || eventName == 'PartResized') {
            // clear thumbnail cache
            thumbnailCache = [];
        }
        else if (eventName == 'ViewportBoundsChanged') {
            // adjust zooming of map region
            //self.windowResized();
        }
    };

    this.windowResized = _.debounce(function() {
        self.slideThumbnailSelected(self.currentSlideIndex);
    }, 1000);

    this.showSidebar = function() {
        return map.getUi().currentTabIs(map.getUi().TAB_ID_PRESENTER) && (!self.isPresenting || self.showTOC);
    };

    this.disableMapToolbarButtons = function() {
        return !map.getUi().currentTabIs(map.getUi().TAB_ID_PRESENTER) 
            || self.isPresenting 
            || !self.getCurrentSlideType().hasMapRegion;
    }

    // returns an array of node data objects (not the slide nodes themselves)
    this.getSlideNodeDatas = function () {
        var diagram = map.getDiagram();
        var nodes = diagram.model.nodeDataArray;
        var nodeDatas = _.filter(nodes, function (node) {
            return node.category == 'slide';
        });
        nodeDatas = _.sortBy(nodeDatas, function (nodeData) {
            return nodeData.index;
        });
        //console.log('getSlideNodeDatas, indexes: ' + _.pluck(slidesData, 'index'));
        return nodeDatas;
    };

    this.getSlideCount = function() {
        return self.getSlideNodeDatas().length;
    };  

    this.getActivitySlideCount = function() {
        return _.where(self.getSlideNodeDatas(), { type: 'ACTIVITY_MAP' }).length;
    };  

    this.getSlideType = function(typeName) {
        return _.findWhere(self.slideTypes, { name: typeName });
    };

    this.getCurrentSlideType = function() {
        var slide = findSlideByIndex(self.currentSlideIndex);
        if (slide) {
            return _.findWhere(self.slideTypes, { name: slide.data.type });
        }
        else {
            return {};
        }
    };

    function findSlideByIndex(index) {
        var diagram = map.getDiagram();
        var slideData = _.find(self.getSlideNodeDatas(), function (slideData) {
            return slideData.index == index;
        });
        if (slideData !== undefined) {
            return diagram.findNodeForKey(slideData.key);
        }
        else {
            return undefined;
        }
    }

    // increment is -1 or +1
    this.moveSlide = function (index, increment) {
        $scope.safeApply(function() {
            var diagram = map.getDiagram();
            var slide = findSlideByIndex(index);
            var neighbor = findSlideByIndex(index + increment);
            if (slide && neighbor) {
                //console.log('moveSlide: swapping ' + slide.data.key + ' with ' + neighbor.data.key);
                diagram.startTransaction("move slide");
                diagram.model.setDataProperty(slide.data, 'index', slide.data.index + increment);
                diagram.model.setDataProperty(neighbor.data, 'index', neighbor.data.index - increment);
                diagram.commitTransaction("move slide");
                thumbnailCache = [];
            }
        });
    };

    function compactSlideIndexes() {
        $scope.safeApply(function() {
            //console.log('compactSlideIndexes');
            var slidesData = self.getSlideNodeDatas();
            var diagram = map.getDiagram();
            var newIndex = 1;
            diagram.startTransaction("compact slide indexes");
            _.each(slidesData, function (slideData) {
                diagram.model.setDataProperty(slideData, 'index', newIndex);
                //console.log('compactSlideIndexes: set index for ' + slideData.key + ' to ' + newIndex);
                newIndex++;
            });
            diagram.commitTransaction("compact slide indexes");
        });
    }

    function getNewSlideKey() {
        var diagram = map.getDiagram();
        var i = 1;
        while (diagram.model.findNodeDataForKey('slide-' + i)) {
            i++;
        }
        return 'slide-' + i;
    }

    // NB: indexes (and keys?) must be 1-based, otherwise first slide gets screwed up
    // (somewhere the index shows up as '' instead of 0)
    function getNewSlideIndex() {
        var slides = self.getSlideNodeDatas();
        return slides.length + 1; 
    }

    this.addSlide = function (typeName) {
        $scope.safeApply(function() {
            console.log('addSlide: ' + typeName);
            var diagram = map.getDiagram();

            var db = map.computeMapBounds();
            db.inflate(db.width / 20, db.height / 10);
            var newLoc = db.x + ' ' + db.y;
            var newIndex = getNewSlideIndex();

            var slideType = _.findWhere(self.slideTypes, { name: typeName });

            diagram.startTransaction("add slide");
            diagram.model.addNodeData({
                key: getNewSlideKey(),
                category: 'slide',
                index: newIndex,
                isGroup: false,
                width: db.width,
                height: db.height,
                loc: newLoc,
                level: 0,
                children: 0,
                type: typeName,
                title: '',
                notes: '',
                checks: [],
                hasRegion: slideType.hasMapRegion,
                isSummary: slideType.hasMapSummary,
                links: []
            });
            diagram.commitTransaction("add slide");
            thumbnailCache = [];

            self.slideThumbnailSelected(newIndex); // trigger display of edit form, zoom to map region if applicable
        });
    };

    this.duplicateSlide = function (index) {
        $scope.safeApply(function() {
            var diagram = map.getDiagram();
            var newIndex = getNewSlideIndex();
            var slide = findSlideByIndex(index); 
            if (slide) {
                diagram.startTransaction("duplicate slide");

                // bump up indexes on subsequent slides to make room for new slide after current one
                _.each(self.getSlideNodeDatas(), function (slideData) {
                    if (slideData.index > index) {
                        diagram.model.setDataProperty(slideData, 'index', slideData.index + 1);
                    }
                });

                // NB: creating a new nodeData object here rather than copying and modifying, to avoid copying $$hashKey (??)
                diagram.model.addNodeData({
                    key: getNewSlideKey(),
                    category: 'slide',
                    index: index + 1,
                    isGroup: false,
                    width: slide.data.width,
                    height: slide.data.height,
                    loc: slide.data.loc,
                    level: 0,
                    children: 0,
                    type: slide.data.type,
                    title: slide.data.title + ' (Copy)',
                    notes: slide.data.notes,
                    checks: slide.data.checks, // clone?
                    hasRegion: slide.data.hasRegion,
                    isSummary: slide.data.isSummary,
                    links: slide.data.links // clone?
                });
                diagram.commitTransaction("duplicate slide");
                thumbnailCache = [];
            }
        });
    };

    this.removeSlide = function (index) {
        $scope.safeApply(function() {
            //console.log('removeSlide: ' + index);
            var diagram = map.getDiagram();
            var slide = findSlideByIndex(index); 
            if (slide) {
                diagram.startTransaction("remove slide");
                diagram.model.removeNodeData(slide.data);
                diagram.commitTransaction("remove slide");
            }
            self.currentSlideIndex = null;
            thumbnailCache = [];
            compactSlideIndexes();
        });
    };

    var thumbnailCache = [];

    this.getSlideThumbnail = function (index) {
        return thumbnailCache[index];
    };

    this.createSlideThumbnails = function() {
        _.each(self.getSlideNodeDatas(), function(nd) { 
            self.createSlideThumbnail(nd.index); 
        });
    };

    this.createSlideThumbnail = function (index) {
        //console.log('createSlideThumbnail');

        var thumbWidth = 1000;
        var thumbHeight = 600;
        var diagram = map.getDiagram();

        var slide = findSlideByIndex(index);
        if (!slide) {
            return '';
        }
        else if (!slide.data.hasRegion && !slide.data.isSummary) {
            return '';
        }
        else {
            var db = diagram.documentBounds;
            var sb;
            if (slide.data.isSummary) { // for a summary slide we shoot the whole map
                sb = map.safeRect(map.computeMapBounds());
            }
            else { // otherwise just shoot the slide region
                sb = slide.part.actualBounds;
            }

            var imagePosition = new go.Point(sb.x, sb.y);
            //console.log('getSlideThumbnail, slide bounds: ' + sb + ', document bounds: ' + db + ', imagePosition: ' + imagePosition);

            var wScale = thumbWidth / sb.width;
            var hScale = thumbHeight / sb.height;
            var thumbScale = Math.min(wScale, hScale);
            console.log('scale: ' + wScale + ',' + hScale);

            var w = thumbScale * sb.width;
            var h = thumbScale * sb.height;
            //console.log('thumbnail w/h: ' + w + ',' + h);

            // hide slides temporarily while creating thumbnail
            self.isCreatingThumbnail = true;
            diagram.updateAllTargetBindings();

            diagram.scale = thumbScale;

            var imgData = diagram.makeImageData({
                size: new go.Size(w, h),
                position: imagePosition,
                scale: thumbScale
            });

            self.isCreatingThumbnail = false;
            diagram.updateAllTargetBindings();

            thumbnailCache[index] = imgData;

            return imgData;
        }
    };

    // gets a thumbnail of the whole map, for saving (see autosave.js)
    this.getMapThumbnail = function () {

        var diagram = map.getDiagram();
        var sb = map.safeRect(map.computeMapBounds());
        sb.grow(10,10,10,10);
        var w = 150;
        var h = 100;

        // hide slides temporarily while creating thumbnail
        self.isCreatingThumbnail = true;
        diagram.updateAllTargetBindings();

        var imgData = diagram.makeImageData({
            scale: Math.min(h / sb.height, w / sb.width),
            position: new go.Point(sb.x, sb.y),
            size:new go.Size(w, h)
        });

        self.isCreatingThumbnail = false;
        diagram.updateAllTargetBindings();

        return imgData;
    };


    // called via ng-click on thumbnail
    this.slideThumbnailSelected = function (index) {
        //console.log('slideThumbnailSelected: ' + index);
        var diagram = map.getDiagram();
        var slide = findSlideByIndex(index);

        $scope.safeApply(function() {
            // NB: order of statements is important here, as selectSlide can trigger changedSelection with an empty selection sometimes... ??
            selectSlide(index);
            self.currentSlideIndex = index;
            diagram.updateAllTargetBindings(); // show/hide slide nodes - see templates.js: slideTemplate
            
            if (slide) {
                zoomToSlideInCenter(slide);
                
                if (self.isPresenting) {
                    self.showTOC = false;
                }
            }
        });
    };

    this.needsNarrowCanvas = function() {
        var slide = findSlideByIndex(self.currentSlideIndex);
        return map.getUi().currentTabIs(map.getUi().TAB_ID_PRESENTER) && 
           slide != null && 
           (slide.data.type == 'TITLE_BODY_MAP' || slide.data.type == 'ACTIVITY_MAP' || slide.data.type == 'MAP_SUMMARY');
    };

    // sets the slide node as selected in the diagram.
    function selectSlide(index) {
        $scope.safeApply(function() {
            //console.log('select slide: ' + index);
            var diagram = map.getDiagram();
            diagram.clearSelection();
            if (index) {
                var slide = findSlideByIndex(index);
                if (slide) {
                    slide.isSelected = true;
                }
            }
            // TODO: scroll to slide?
        });
    }

    this.playSlide = function (index) {
        var diagram = map.getDiagram();
        map.getUi().openTab(map.getUi().TAB_ID_PRESENTER); 

        var slides = self.getSlideNodeDatas();
        if (slides.length) {
            self.showTOC = false;
            presentSlide(index);
        }
    };

    // increment is -1 or +1
    this.advanceSlide = function (increment) {
        //console.log('advanceSlide, currentSlideIndex: ' + self.currentSlideIndex);
        $scope.safeApply(function() {
            var slide = findSlideByIndex(self.currentSlideIndex);
            if (slide) {
                self.currentSlideIndex += (increment);
                if (self.isPresenting) {
                    presentSlide(self.currentSlideIndex);
                }
            }
        });
    };

    function presentSlide(index) {
        //console.log('presentSlide');
        $scope.safeApply(function() {
            var diagram = map.getDiagram();
            var slide = findSlideByIndex(index);
            if (!slide) {
                return;
            }

            diagram.clearSelection();
            // NB: need to set this after clearSelection, as that will set it to null! (see changedSelection)
            self.currentSlideIndex = index;
            map.setEditingBlocked(true);
            //console.log('presentSlide, index: ' + index + ', slide: ' + slide + ', currentSlideIndex: ' + self.currentSlideIndex);

            maybeInitSlideBlocker();
            var blockerW = self.SLIDE_BLOCKER_WIDTH;

            if (slide.data.hasRegion) {
                zoomToSlideInCenter(slide);

                // show slide blocker
                self.slideBlocker.desiredSize = new go.Size(
                    slide.actualBounds.width + 2 * blockerW, 
                    slide.actualBounds.height + 2 * blockerW);
                self.slideBlocker.location = new go.Point(
                    slide.actualBounds.x - blockerW, 
                    slide.actualBounds.y - blockerW);
                self.slideBlocker.visible = true;
                //console.log('slideBlocker: ' + self.slideBlocker.actualBounds);
            }
            else if (slide.data.isSummary) {
                zoomToSlideInCenter(slide);
                self.slideBlocker.visible = false;
            }
            else {
                map.getUi().resetZoom();
                self.slideBlocker.visible = false;
            }

            self.isPresenting = true;
            $('body').addClass('presenter-playing');

            map.getDiagram().updateAllTargetBindings(); // hide slide nodes - see templates.js: slideTemplate
        });        
    }

    // zoom the diagram to show the given slide in the center of the canvas
    function zoomToSlideInCenter(slide)
    {
        var diagram = map.getDiagram();

        window.setTimeout(function () {

        var halfWidth = (slide.data.type != 'MAP_ONLY');
        var zoomRect = self.getLetterboxedRect(slide.actualBounds, halfWidth);
        zoomRect.inflate(zoomRect.width / 10, zoomRect.height / 10);
        diagram.zoomToRect(zoomRect, go.Diagram.Uniform);
        }, 100);
    }

    // Returns a rectangle containing the given rect, but with appropriate width or height added
    // to give it same aspect ratio as the diagram.
    this.getLetterboxedRect = function (rect, halfWidth) {

        // NB: we calculate the aspect ratio when the tab is opened, 
        // rather than each time as the diagram size might be changing...
        var dar = (halfWidth ? self.diagramAspectRatio / 2 : self.diagramAspectRatio);
        console.log('rect: ' + rect + ', dar: ' + dar);

        var rectAspectRatio = rect.width / rect.height;

        if (dar > rectAspectRatio) {
            // tall skinny rect, short wide target AR, so add side padding to the rect
            var lbw = rect.height * dar; // because lbw / lbh == dar == lbw / rect.height (lbh == rect.height)
            return rect.copy().inflate((lbw - rect.width) / 2, 0); // add half the width difference to each side of the rect
        }
        else {
            // short wide rect, tall skinny target AR, so add top/bottom padding to the rect
            var lbh = rect.width / dar; // because lbw / lbh == dar == lbh / rect.width (lbw == rect.width)
            return rect.copy().inflate(0, (lbh - rect.height) / 2);  // add half the height difference to top/bottom of the rect
        }
    };

    this.stopPresenting = function () {
        $scope.safeApply(function() {
            //console.log('stopPresenting, currentSlideIndex: ' + self.currentSlideIndex);
            var diagram = map.getDiagram();

            if (self.slideBlocker) {
                self.slideBlocker.visible = false;
            }

            //self.currentSlideIndex = null;
            self.isPresenting = false;
            $('body').removeClass('presenter-playing');

            map.getDiagram().updateAllTargetBindings(); // show slide nodes

            diagram.clearSelection();
            map.setEditingBlocked(false);
            //map.getUi().resetZoom();
        });
    };

};
