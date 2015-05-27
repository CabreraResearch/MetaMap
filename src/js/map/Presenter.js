const go = window.go;
const SLIDE_BLOCKER_WIDTH = 1000;
const SLIDE_BLOCKER_COLOR = "#fff";
const SLIDE_BLOCKER_OPACITY = 0.9;

// functions for the presenter/slides
class Presenter {
    constructor(editor, map) {
        this._editor = editor;
        this._map = map;

        this.currentSlideIndex = null;
        this.isPresenting = false;
        this.showTOC = false;
        this.isCreatingThumbnail = false;

        // mask applied around slide region when presenting
        this.slideBlocker = null;

        this.diagramAspectRatio = null;

        // NB: hasLinks can have values false, 1, or true (1 means only a single link)
        this.slideTypes = [
            {
                name: 'TITLE_BODY', label: 'Title and Body',
                hasTitle: true, hasNotes: true, hasChecks: false, hasMapRegion: false, hasMapSummary: false, hasLinks: false
            },
            {
                name: 'TITLE_BODY_MAP', label: 'Title, Body and MetaMap',
                hasTitle: true, hasNotes: true, hasChecks: false, hasMapRegion: true, hasMapSummary: false, hasLinks: false
            },
            {
                name: 'ACTIVITY_MAP', label: 'Lesson Activity and MetaMap',
                hasTitle: true, hasNotes: true, hasChecks: true, hasMapRegion: true, hasMapSummary: false, hasLinks: true
            },
            {
                name: 'MAP_ONLY', label: 'MetaMap only',
                hasTitle: true, hasNotes: false, hasChecks: false, hasMapRegion: true, hasMapSummary: false, hasLinks: false
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

        this.summaryAnalytics = [
        { name: 'COUNT_THINGS', singularLabel: 'Distinction', pluralLabel: 'Distinctions' },
        { name: 'COUNT_SYSTEMS', singularLabel: 'System', pluralLabel: 'Systems' },
        { name: 'COUNT_RELATIONSHIPS', singularLabel: 'Relationship', pluralLabel: 'Relationships' },
        { name: 'COUNT_PERSPECTIVES', singularLabel: 'Perspective', pluralLabel: 'Perspectives' },
        { name: 'COUNT_RTHINGS', singularLabel: 'Relationship Idea', pluralLabel: 'Relationship Ideas' },
        { name: 'COUNT_SYSTEM_RTHINGS', singularLabel: 'Relationship System', pluralLabel: 'Relationship Systems' },
        { name: 'COUNT_SYSTEM_PERSPECTIVES', singularLabel: 'Perspective System', pluralLabel: 'Perspective Systems' },
        { name: 'COUNT_DISTINCTIONS', singularLabel: 'Advanced Distinction', pluralLabel: 'Advanced Distinctions' }
        ];

        this.thumbnailCache = [];
    }

    autosave() {
        this._map.getAutosave().save('edit_presenter');
    }

    // ---------- editing functions for different slide types -------------



    // only call this occasionally, as they won't be editing the map while presenter is open
    updateIdeaList() {
        let nodes = this._map.getDiagram().nodes;
        let list = [];
        while (nodes.next()) {
            if ((nodes.value instanceof go.Group)) {
                list.push(nodes.value.data.text);
            }
        }
        list.sort();

        // filter out placeholder names - see this._map.js:getNewThingData, createSister, etc.
        list = _.difference(_.uniq(list, true),
            this._map.getGenerator().getPlaceholderIdeaNames(),
            ['New Idea', 'New Distinguished Idea', 'New Related Idea', 'New Relationship Idea', 'New Part Idea',
             'Idea', 'Part', 'Relationship Idea'] // newer simplified names
        );

        this.ideaList = list.join(', ');
    }



    addCheck(nodeData) {
        nodeData.checks.push({ text: '' });
        this.autosave();
    }

    deleteCheck(check, nodeData) {
        let i = _.indexOf(nodeData.checks, check);
        nodeData.checks.splice(i, 1);
        this.autosave();
    }

    addLink(nodeData) {
        nodeData.links.push({ title: '', url: '', type: '' });
        this.autosave();
    }

    deleteLink(link, nodeData) {
        let i = _.indexOf(nodeData.links, link);
        nodeData.links.splice(i, 1);
        this.autosave();
    }

    toggleTOC() {
        if (this.isPresenting) {
            this.showTOC = !this.showTOC;
        }
    }

    // NB: can't create this in init as the diagram doesn't exist yet...
    maybeInitSlideBlocker() {
        if (!this.slideBlocker) {
            let mk = go.GraphObject.make;
            this.slideBlocker = mk(go.Node, go.Panel.Auto,
                {
                    layerName: 'Tool',
                    opacity: SLIDE_BLOCKER_OPACITY
                },
                mk(go.Shape, "Rectangle",
                    {
                        fill: null,
                        stroke: SLIDE_BLOCKER_COLOR,
                        strokeWidth: 1000
                    }
                )
            );
            this._map.getDiagram().add(this.slideBlocker);
        }
    }

    // called when a tab is opened or closed
    currentTabChanged(newValue, oldValue) {
        if (oldValue === this._map.getUi().TAB_ID_PRESENTER) { // closing tab
            this.stopPresenting();
        }
        else if (newValue === this._map.getUi().TAB_ID_PRESENTER) { // opening tab
            // show slides (see layouts.slideTemplate, binding of visible attr)
            this.diagramAspectRatio = $('#diagram').width() / $('#diagram').height();
            console.log('diagramAspectRatio: ' + this.diagramAspectRatio);

            this._map.getDiagram().updateAllTargetBindings();
            this.updateIdeaList();
            if (!this.currentSlideIndex && this.getSlideNodeDatas().length > 0) {
                this.currentSlideIndex = 1;
            }
            this.slideThumbnailSelected(1);
        }
    }

    handleDiagramEvent(eventName, e) {
        if (!this._map.getUi().currentTabIs(this._map.getUi().TAB_ID_PRESENTER)) {
            return;
        }

        if (eventName === 'SelectionDeleting') {
            let selection = e.subject;
            if (selection.count === 1) {
                let thing = selection.first();
                if (thing instanceof go.Node && thing.data.category === 'slide') {
                    if (!confirm("Delete this slide from the presentation?")) {
                        e.cancel = true;
                    }
                }
            }
        }
        else if (eventName === 'SelectionDeleted') {
            // if slide is deleted from canvas rather than by thumbnail x button, need to update indexes
            this.compactSlideIndexes();
        }
        else if (eventName === 'SelectionMoved' || eventName === 'PartResized') {
            // clear thumbnail cache
            this.thumbnailCache = [];
        }
        else if (eventName === 'ViewportBoundsChanged') {
            // adjust zooming of map region
            //this.windowResized();
        }
    }
    get windowResized() {
        if (!this._windowResized) {
            this._windowResized = _.debounce(() => {
                this.slideThumbnailSelected(this.currentSlideIndex);
            }, 1000);
        }
        return this._windowResized;
    }
    showSidebar() {
        return this._map.getUi().currentTabIs(this._map.getUi().TAB_ID_PRESENTER) && (!this.isPresenting || this.showTOC);
    }

    disableMapToolbarButtons() {
        return !this._map.getUi().currentTabIs(this._map.getUi().TAB_ID_PRESENTER)
            || this.isPresenting
            || !this.getCurrentSlideType().hasMapRegion;
    }

    // returns an array of node data objects (not the slide nodes themselves)
    getSlideNodeDatas() {
        let diagram = this._map.getDiagram();
        let nodes = diagram.model.nodeDataArray;
        let nodeDatas = _.filter(nodes, (node) => {
            return node.category === 'slide';
        });
        nodeDatas = _.sortBy(nodeDatas, (nodeData) => {
            return nodeData.index;
        });
        //console.log('getSlideNodeDatas, indexes: ' + _.pluck(slidesData, 'index'));
        return nodeDatas;
    }

    getSlideCount() {
        return this.getSlideNodeDatas().length;
    }

    getActivitySlideCount() {
        return _.where(this.getSlideNodeDatas(), { type: 'ACTIVITY_MAP' }).length;
    }

    getSlideType(typeName) {
        return _.findWhere(this.slideTypes, { name: typeName });
    }

    getCurrentSlideType() {
        let slide = this.findSlideByIndex(this.currentSlideIndex);
        if (slide) {
            return _.findWhere(this.slideTypes, { name: slide.data.type });
        }
        else {
            return {};
        }
    }

    findSlideByIndex(index) {
        let diagram = this._map.getDiagram();
        let slideData = _.find(this.getSlideNodeDatas(), (slideData) => {
            return slideData.index === index;
        });
        if (slideData) {
            return diagram.findNodeForKey(slideData.key);
        }
        else {
            return undefined;
        }
    }

    // increment is -1 or +1
    moveSlide(index, increment) {

        let diagram = this._map.getDiagram();
        let slide = this.findSlideByIndex(index);
        let neighbor = this.findSlideByIndex(index + increment);
        if (slide && neighbor) {
            //console.log('moveSlide: swapping ' + slide.data.key + ' with ' + neighbor.data.key);
            diagram.startTransaction("move slide");
            diagram.model.setDataProperty(slide.data, 'index', slide.data.index + increment);
            diagram.model.setDataProperty(neighbor.data, 'index', neighbor.data.index - increment);
            diagram.commitTransaction("move slide");
            this.thumbnailCache = [];
        }

    }

    compactSlideIndexes() {

        //console.log('compactSlideIndexes');
        let slidesData = this.getSlideNodeDatas();
        let diagram = this._map.getDiagram();
        let newIndex = 1;
        diagram.startTransaction("compact slide indexes");
        _.each(slidesData, (slideData) => {
            diagram.model.setDataProperty(slideData, 'index', newIndex);
            //console.log('compactSlideIndexes: set index for ' + slideData.key + ' to ' + newIndex);
            newIndex++;
        });
        diagram.commitTransaction("compact slide indexes");

    }

    getNewSlideKey() {
        let diagram = this._map.getDiagram();
        let i = 1;
        while (diagram.model.findNodeDataForKey('slide-' + i)) {
            i++;
        }
        return 'slide-' + i;
    }

    // NB: indexes (and keys?) must be 1-based, otherwise first slide gets screwed up
    // (somewhere the index shows up as '' instead of 0)
    getNewSlideIndex() {
        let slides = this.getSlideNodeDatas();
        return slides.length + 1;
    }

    addSlide(typeName) {

        console.log('addSlide: ' + typeName);
        let diagram = this._map.getDiagram();

        let db = this._map.computeMapBounds();
        db.inflate(db.width / 20, db.height / 10);
        let newLoc = db.x + ' ' + db.y;
        let newIndex = this.getNewSlideIndex();

        let slideType = _.findWhere(this.slideTypes, { name: typeName });

        diagram.startTransaction("add slide");
        diagram.model.addNodeData({
            key: this.getNewSlideKey(),
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
        this.thumbnailCache = [];

        this.slideThumbnailSelected(newIndex); // trigger display of edit form, zoom to map region if applicable

    }

    duplicateSlide(index) {

        let diagram = this._map.getDiagram();
        let newIndex = this.getNewSlideIndex();
        let slide = this.findSlideByIndex(index);
        if (slide) {
            diagram.startTransaction("duplicate slide");

            // bump up indexes on subsequent slides to make room for new slide after current one
            _.each(this.getSlideNodeDatas(), (slideData) => {
                if (slideData.index > index) {
                    diagram.model.setDataProperty(slideData, 'index', slideData.index + 1);
                }
            });

            // NB: creating a new nodeData object here rather than copying and modifying, to avoid copying $$hashKey (??)
            diagram.model.addNodeData({
                key: this.getNewSlideKey(),
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
            this.thumbnailCache = [];
        }

    }

    removeSlide(index) {

        //console.log('removeSlide: ' + index);
        let diagram = this._map.getDiagram();
        let slide = this.findSlideByIndex(index);
        if (slide) {
            diagram.startTransaction("remove slide");
            diagram.model.removeNodeData(slide.data);
            diagram.commitTransaction("remove slide");
        }
        this.currentSlideIndex = null;
        this.thumbnailCache = [];
        this.compactSlideIndexes();

    }

    getSlideThumbnail(index) {
        return this.thumbnailCache[index];
    }

    createSlideThumbnails() {
        _.each(this.getSlideNodeDatas(), (nd) => {
            this.createSlideThumbnail(nd.index);
        });
    }

    createSlideThumbnail(index) {
        //console.log('createSlideThumbnail');

        let thumbWidth = 1000;
        let thumbHeight = 600;
        let diagram = this._map.getDiagram();

        let slide = this.findSlideByIndex(index);
        if (!slide) {
            return '';
        }
        else if (!slide.data.hasRegion && !slide.data.isSummary) {
            return '';
        }
        else {
            let db = diagram.documentBounds;
            let sb;
            if (slide.data.isSummary) { // for a summary slide we shoot the whole map
                sb = this._map.safeRect(this._map.computeMapBounds());
            }
            else { // otherwise just shoot the slide region
                sb = slide.part.actualBounds;
            }

            let imagePosition = new go.Point(sb.x, sb.y);
            //console.log('getSlideThumbnail, slide bounds: ' + sb + ', document bounds: ' + db + ', imagePosition: ' + imagePosition);

            let wScale = thumbWidth / sb.width;
            let hScale = thumbHeight / sb.height;
            let thumbScale = Math.min(wScale, hScale);
            console.log('scale: ' + wScale + ',' + hScale);

            let w = thumbScale * sb.width;
            let h = thumbScale * sb.height;
            //console.log('thumbnail w/h: ' + w + ',' + h);

            // hide slides temporarily while creating thumbnail
            this.isCreatingThumbnail = true;
            diagram.updateAllTargetBindings();

            diagram.scale = thumbScale;

            let imgData = diagram.makeImageData({
                size: new go.Size(w, h),
                position: imagePosition,
                scale: thumbScale
            });

            this.isCreatingThumbnail = false;
            diagram.updateAllTargetBindings();

            this.thumbnailCache[index] = imgData;

            return imgData;
        }
    }

    // gets a thumbnail of the whole map, for saving (see autosave.js)
    getMapThumbnail() {

        let diagram = this._map.getDiagram();
        let sb = this._map.safeRect(this._map.computeMapBounds());
        sb.grow(10, 10, 10, 10);
        let w = 150;
        let h = 100;

        // hide slides temporarily while creating thumbnail
        this.isCreatingThumbnail = true;
        diagram.updateAllTargetBindings();

        let imgData = diagram.makeImageData({
            scale: Math.min(h / sb.height, w / sb.width),
            position: new go.Point(sb.x, sb.y),
            size: new go.Size(w, h)
        });

        this.isCreatingThumbnail = false;
        diagram.updateAllTargetBindings();

        return imgData;
    }


    // called via ng-click on thumbnail
    slideThumbnailSelected(index) {
        //console.log('slideThumbnailSelected: ' + index);
        let diagram = this._map.getDiagram();
        let slide = this.findSlideByIndex(index);


        // NB: order of statements is important here, as selectSlide can trigger changedSelection with an empty selection sometimes... ??
        this.selectSlide(index);
        this.currentSlideIndex = index;
        diagram.updateAllTargetBindings(); // show/hide slide nodes - see templates.js: slideTemplate

        if (slide) {
            this.zoomToSlideInCenter(slide);

            if (this.isPresenting) {
                this.showTOC = false;
            }
        }

    }

    needsNarrowCanvas() {
        let slide = this.findSlideByIndex(this.currentSlideIndex);
        return this._map.getUi().currentTabIs(this._map.getUi().TAB_ID_PRESENTER) &&
           slide != null &&
           (slide.data.type === 'TITLE_BODY_MAP' || slide.data.type === 'ACTIVITY_MAP' || slide.data.type === 'MAP_SUMMARY');
    }

    // sets the slide node as selected in the diagram.
    selectSlide(index) {

        //console.log('select slide: ' + index);
        let diagram = this._map.getDiagram();
        diagram.clearSelection();
        if (index) {
            let slide = this.findSlideByIndex(index);
            if (slide) {
                slide.isSelected = true;
            }
        }
        // TODO: scroll to slide?

    }

    playSlide(index) {
        let diagram = this._map.getDiagram();
        this._map.getUi().openTab(this._map.getUi().TAB_ID_PRESENTER);

        let slides = this.getSlideNodeDatas();
        if (slides.length) {
            this.showTOC = false;
            this.presentSlide(index);
        }
    }

    // increment is -1 or +1
    advanceSlide(increment) {
        //console.log('advanceSlide, currentSlideIndex: ' + this.currentSlideIndex);

        let slide = this.findSlideByIndex(this.currentSlideIndex);
        if (slide) {
            this.currentSlideIndex += (increment);
            if (this.isPresenting) {
                this.presentSlide(this.currentSlideIndex);
            }
        }

    }

    presentSlide(index) {
        //console.log('presentSlide');

        let diagram = this._map.getDiagram();
        let slide = this.findSlideByIndex(index);
        if (!slide) {
            return;
        }

        diagram.clearSelection();
        // NB: need to set this after clearSelection, as that will set it to null! (see changedSelection)
        this.currentSlideIndex = index;
        this._map.setEditingBlocked(true);
        //console.log('presentSlide, index: ' + index + ', slide: ' + slide + ', currentSlideIndex: ' + this.currentSlideIndex);

        this.maybeInitSlideBlocker();
        let blockerW = SLIDE_BLOCKER_WIDTH;

        if (slide.data.hasRegion) {
            this.zoomToSlideInCenter(slide);

            // show slide blocker
            this.slideBlocker.desiredSize = new go.Size(
                slide.actualBounds.width + 2 * blockerW,
                slide.actualBounds.height + 2 * blockerW);
            this.slideBlocker.location = new go.Point(
                slide.actualBounds.x - blockerW,
                slide.actualBounds.y - blockerW);
            this.slideBlocker.visible = true;
            //console.log('slideBlocker: ' + this.slideBlocker.actualBounds);
        }
        else if (slide.data.isSummary) {
            this.zoomToSlideInCenter(slide);
            this.slideBlocker.visible = false;
        }
        else {
            this._map.getUi().resetZoom();
            this.slideBlocker.visible = false;
        }

        this.isPresenting = true;
        $('body').addClass('presenter-playing');

        this._map.getDiagram().updateAllTargetBindings(); // hide slide nodes - see templates.js: slideTemplate

    }

    // zoom the diagram to show the given slide in the center of the canvas
    zoomToSlideInCenter(slide) {
        let diagram = this._map.getDiagram();

        window.setTimeout(() => {

            let halfWidth = (slide.data.type !== 'MAP_ONLY');
            let zoomRect = this.getLetterboxedRect(slide.actualBounds, halfWidth);
            zoomRect.inflate(zoomRect.width / 10, zoomRect.height / 10);
            diagram.zoomToRect(zoomRect, go.Diagram.Uniform);
        }, 100);
    }

    // Returns a rectangle containing the given rect, but with appropriate width or height added
    // to give it same aspect ratio as the diagram.
    getLetterboxedRect(rect, halfWidth) {

        // NB: we calculate the aspect ratio when the tab is opened, 
        // rather than each time as the diagram size might be changing...
        let dar = (halfWidth ? this.diagramAspectRatio / 2 : this.diagramAspectRatio);
        console.log('rect: ' + rect + ', dar: ' + dar);

        let rectAspectRatio = rect.width / rect.height;

        if (dar > rectAspectRatio) {
            // tall skinny rect, short wide target AR, so add side padding to the rect
            let lbw = rect.height * dar; // because lbw / lbh == dar == lbw / rect.height (lbh == rect.height)
            return rect.copy().inflate((lbw - rect.width) / 2, 0); // add half the width difference to each side of the rect
        }
        else {
            // short wide rect, tall skinny target AR, so add top/bottom padding to the rect
            let lbh = rect.width / dar; // because lbw / lbh == dar == lbh / rect.width (lbw == rect.width)
            return rect.copy().inflate(0, (lbh - rect.height) / 2);  // add half the height difference to top/bottom of the rect
        }
    }

    stopPresenting() {

        //console.log('stopPresenting, currentSlideIndex: ' + this.currentSlideIndex);
        let diagram = this._map.getDiagram();

        if (this.slideBlocker) {
            this.slideBlocker.visible = false;
        }

        //this.currentSlideIndex = null;
        this.isPresenting = false;
        $('body').removeClass('presenter-playing');

        this._map.getDiagram().updateAllTargetBindings(); // show slide nodes

        diagram.clearSelection();
        this._map.setEditingBlocked(false);
        //this._map.getUi().resetZoom();

    }

}

module.exports = Presenter;
