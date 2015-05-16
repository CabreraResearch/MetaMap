<page-content>

    <div class="page-content-wrapper">
        <div class="page-content">
            
            <div class="page-head">
                <div class="map-editor ng-scope" id="app-container" ng-controller="MapEditorCtrl">
                    <div id="map-menu-bar">
                        <ul class="map-actions">
                            <li>
                                <a href="#" ng-click="map.getUi().editOptions()" ng-disabled="!canEdit">Options</a>
                            </li>
                            <li>
                                <a href="#" ng-click="map.getUi().editUserTags()" ng-disabled="!canEdit">Tag</a>
                            </li>
                            <li>
                                <a href="#" ng-click="map.getUi().editMapShares()" ng-disabled="!canEdit">Share</a>
                            </li>
                            <li ng-show="!map.getUi().currentTabIs(map.getUi().TAB_ID_PRESENTER)" class="">
                                <a href="#" ng-click="map.getUi().exportToImage(map.EXPORT_FORMAT_PNG)">Export</a>
                            </li>
                            <li class="presenter-link">
                                <button ng-click="map.getUi().toggleTab(map.getUi().TAB_ID_PRESENTER)" ng-show="canEdit &amp;&amp; !map.getPresenter().isPresenting" title="Edit Presentation" type="button" class="">Present</button>
                                <button ng-click="map.getPresenter().playSlide(1)" ng-disabled="map.getUi().disableTab(map.getUi().TAB_ID_PRESENTER) || map.getPresenter().getSlideNodeDatas().length == 0" ng-show="!canEdit &amp;&amp; !map.getUi().currentTabIs(map.getUi().TAB_ID_PRESENTER)" title="View Presentation" type="button" class="ng-hide" disabled="disabled">Present</button>
                            </li>
                            <li>
                                <form action="http://www.cabreraresearch.org/maps/5549/save_copy" id="save-copy-form" method="POST" target="_blank" class="ng-pristine ng-valid">
                                    <input id="save-copy" type="submit" value="Duplicate" />
                                </form>
                            </li>
                            <li>
                                <a href="/maps/new" target="_blank">New</a>
                            </li>
                        </ul>
                        <span id="map-title-display" ng-click="maybeStartEditingTitle()" ng-show="!editingTitle" popover="Click to edit title" popover-placement="right" popover-trigger="mouseenter" class="ng-scope ng-binding">Untitled Map</span>
                        <input id="map-title-edit" ng-blur="doneEditingTitle()" ng-keypress="editingTitleKeypress($event)" ng-model="mapTitle" ng-show="editingTitle" type="text" class="ng-pristine ng-valid ng-hide" />
                            <span id="map-edit-status" popover="Every change you make is automatically saved." popover-placement="right" popover-trigger="mouseenter" class="ng-scope ng-binding" data-skip="true">Last updated a few seconds ago </span>
                    </div>
                    <div id="main-toolbar" ng-show="!map.getPresenter().isPresenting" class="">
                        <div ng-show="!map.getUi().currentTabIs(map.getUi().TAB_ID_PRESENTER)" class="">
                            <div class="toolbar-section-basic toolbar-section">
                                <div class="toolbar">
                                    <div class="tooltip-wrapper" data-placement="bottom" data-toggle="tooltip" title="Copy">
                                        <button class="btn" ng-click="map.getDiagram().commandHandler.copySelection()" ng-disabled="!canEdit || !map.getDiagram().commandHandler.canCopySelection()" type="button" disabled="disabled">
                                            <i class="icon icon-copy"></i>
                                        </button>
                                    </div>
                                    <div class="tooltip-wrapper" data-placement="bottom" data-toggle="tooltip" title="Paste">
                                        <button class="btn" ng-click="map.getDiagram().commandHandler.pasteSelection()" ng-disabled="!map.getDiagram().commandHandler.canPasteSelection()" type="button" disabled="disabled">
                                            <i class="icon icon-paste"></i>
                                        </button>
                                    </div>
                                    <div class="tooltip-wrapper" data-placement="bottom" data-toggle="tooltip" title="Delete">
                                        <button class="btn" ng-click="map.getDiagram().commandHandler.deleteSelection()" ng-disabled="!map.getDiagram().commandHandler.canDeleteSelection()" type="button" disabled="disabled">
                                            <i class="icon icon-delete"></i>
                                        </button>
                                    </div>
                                    <div class="tooltip-wrapper" data-placement="bottom" data-toggle="tooltip" title="Undo">
                                        <button class="btn" ng-click="map.undo()" ng-disabled="!map.canUndo()" type="button" disabled="disabled">
                                            <i class="icon icon-undo"></i>
                                        </button>
                                    </div>
                                    <div class="tooltip-wrapper" data-placement="bottom" data-toggle="tooltip" title="Redo">
                                        <button class="btn" ng-click="map.redo()" ng-disabled="!map.canRedo()" type="button" disabled="disabled">
                                            <i class="icon icon-redo"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="toolbar-section-navigation toolbar-section">
                                <div class="toolbar">
                                    <div class="tooltip-wrapper" data-placement="bottom" data-toggle="tooltip" title="Reset zoom">
                                        <button class="btn" ng-click="map.getUi().resetZoom()" type="button">
                                            <i class="icon icon-zoom-reset"></i>
                                        </button>
                                    </div>
                                    <div class="tooltip-wrapper" data-placement="bottom" data-toggle="tooltip" title="Zoom to region">
                                        <button class="btn" ng-click="map.getUi().toggleZoomingToRegion()" type="button">
                                            <i class="icon icon-zoom-to-region"></i>
                                        </button>
                                    </div>
                                    <div class="tooltip-wrapper" data-placement="bottom" data-toggle="tooltip" title="Zoom out">
                                        <button class="btn" ng-click="map.getUi().zoomOut()" ng-disabled="!map.getUi().canZoomOut()" type="button">
                                            <i class="icon icon-zoomout"></i>
                                        </button>
                                    </div>
                                    <div class="tooltip-wrapper" data-placement="bottom" data-toggle="tooltip" title="Zoom in">
                                        <button class="btn" ng-click="map.getUi().zoomIn()" ng-disabled="!map.getUi().canZoomIn()" type="button">
                                            <i class="icon icon-zoomin"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="toolbar-section-thing-options toolbar-section">
                                <div class="toolbar">
                                    <div class="menu-part-layout btn-group toggle-menu">
                                        <div class="tooltip-wrapper" data-placement="right" data-toggle="tooltip" title="Part Layout">
                                            <button class="btn dropdown-toggle" ng-disabled="!canEdit" type="button">
                                                <i class="icon icon-left" ng-class="'icon-' + map.getUi().getSelectedThingsOrDefaultLayout()"></i>
                                            </button>
                                        </div>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <div class="tooltip-wrapper" data-placement="right" data-toggle="tooltip" title="Left Outline Layout">
                                                    <button class="btn" ng-class="classIf('active', map.getSelectedThingsLayout() == 'left')" ng-click="map.getUi().setSelectedThingsLayout('left')" ng-disabled="!canEdit || map.getLayouts().disableLayoutForSelectedThings('left')" type="button" disabled="disabled">
                                                        <i class="icon icon-left"></i>
                                                    </button>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="tooltip-wrapper" data-placement="right" data-toggle="tooltip" title="Right Outline Layout">
                                                    <button class="btn" ng-class="classIf('active', map.getSelectedThingsLayout() == 'right')" ng-click="map.getUi().setSelectedThingsLayout('right')" ng-disabled="!canEdit || map.getLayouts().disableLayoutForSelectedThings('right')" type="button" disabled="disabled">
                                                        <i class="icon icon-right"></i>
                                                    </button>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="tooltip-wrapper" data-placement="right" data-toggle="tooltip" title="Stacked Layout">
                                                    <button class="btn" ng-class="classIf('active', map.getSelectedThingsLayout() == 'stacked')" ng-click="map.getUi().setSelectedThingsLayout('stacked')" ng-disabled="!canEdit || map.getLayouts().disableLayoutForSelectedThings('stacked')" type="button" disabled="disabled">
                                                        <i class="icon icon-stacked"></i>
                                                    </button>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="tooltip-wrapper" data-placement="right" data-toggle="tooltip" title="Freehand Layout">
                                                    <button class="btn" ng-class="classIf('active', map.getSelectedThingsLayout() == 'freehand')" ng-click="map.getUi().setSelectedThingsLayout('freehand')" ng-disabled="!canEdit || map.getLayouts().disableLayoutForSelectedThings('freehand')" type="button" disabled="disabled">
                                                        <i class="icon icon-freehand"></i>
                                                    </button>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="menu-r-type btn-group toggle-menu">
                                        <div class="tooltip-wrapper" data-placement="right" data-toggle="tooltip" title="Relationship Type">
                                            <button class="btn dropdown-toggle" ng-disabled="!canEdit" type="button">
                                                <i class="icon icon-arrow-noArrows" ng-class="'icon-arrow-' + map.getUi().getSelectedRelationshipsOrDefaultDirection()"></i>
                                            </button>
                                        </div>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <div class="tooltip-wrapper" data-placement="right" data-toggle="tooltip" title="No Arrows">
                                                    <button class="btn" ng-class="classIf('active', map.getUi().getSelectedRelationshipsDirection() == 'noArrows')" ng-click="map.getUi().setSelectedRelationshipsDirection('noArrows')" ng-disabled="!canEdit || !map.relationshipsSelected()" type="button" disabled="disabled">
                                                        <i class="icon icon-arrow-noArrows"></i>
                                                    </button>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="tooltip-wrapper" data-placement="right" data-toggle="tooltip" title="To">
                                                    <button class="btn" ng-class="classIf('active', map.getUi().getSelectedRelationshipsDirection() == 'to')" ng-click="map.getUi().setSelectedRelationshipsDirection('to')" ng-disabled="!canEdit || !map.relationshipsSelected()" type="button" disabled="disabled">
                                                        <i class="icon icon-arrow-to"></i>
                                                    </button>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="tooltip-wrapper" data-placement="right" data-toggle="tooltip" title="From">
                                                    <button class="btn" ng-class="classIf('active', map.getUi().getSelectedRelationshipsDirection() == 'from')" ng-click="map.getUi().setSelectedRelationshipsDirection('from')" ng-disabled="!canEdit || !map.relationshipsSelected()" type="button" disabled="disabled">
                                                        <i class="icon icon-arrow-from"></i>
                                                    </button>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="tooltip-wrapper" data-placement="right" data-toggle="tooltip" title="To/From">
                                                    <button class="btn" ng-class="classIf('active', map.getUi().getSelectedRelationshipsDirection() == 'toFrom')" ng-click="map.getUi().setSelectedRelationshipsDirection('toFrom')" ng-disabled="!canEdit || !map.relationshipsSelected()" type="button" disabled="disabled">
                                                        <i class="icon icon-arrow-toFrom"></i>
                                                    </button>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="tooltip-wrapper" data-placement="bottom" data-toggle="tooltip" title="Attachments">
                                        <button class="btn" ng-class="classIf('active', map.getUi().currentTabIs(map.getUi().TAB_ID_ATTACHMENTS))" ng-click="map.getUi().toggleTab(map.getUi().TAB_ID_ATTACHMENTS)" ng-disabled="!map.thingSelected() || map.disableTab(map.getUi().TAB_ID_ATTACHMENTS)" type="button" disabled="disabled">
                                            <i class="icon icon-attachments"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="toolbar-section-think-better toolbar-section">
                                <div class="toolbar">
                                    <div class="tooltip-wrapper" data-placement="bottom" data-toggle="tooltip" title="Idea Analytics">
                                        <button class="btn" ng-class="classIf('active', map.getUi().currentTabIs(map.getUi().TAB_ID_ANALYTICS_THING))" ng-click="map.getUi().toggleTab(map.getUi().TAB_ID_ANALYTICS_THING)" ng-disabled="map.getUi().disableTab(map.getUi().TAB_ID_ANALYTICS_THING)" type="button">
                                            <i class="icon icon-analytics-thing"></i>
                                        </button>
                                    </div>
                                    <div class="tooltip-wrapper" data-placement="bottom" data-toggle="tooltip" title="Map Analytics">
                                        <button class="btn" ng-class="classIf('active', map.getUi().currentTabIs(map.getUi().TAB_ID_ANALYTICS_MAP))" ng-click="map.getUi().toggleTab(map.getUi().TAB_ID_ANALYTICS_MAP)" ng-disabled="map.getUi().disableTab(map.getUi().TAB_ID_ANALYTICS_MAP)" type="button">
                                            <i class="icon icon-analytics-map"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="toolbar">
                                    <div class="tooltip-wrapper" data-placement="bottom" data-toggle="tooltip" title="ThinkQuery">
                                        <button class="btn" ng-class="classIf('active', map.getUi().currentTabIs(map.getUi().TAB_ID_GENERATOR))" ng-click="map.getUi().toggleTab(map.getUi().TAB_ID_GENERATOR)" ng-disabled="!canEdit || map.getUi().disableTab(map.getUi().TAB_ID_GENERATOR)" type="button">
                                            <i class="icon icon-generator"></i>
                                        </button>
                                    </div>
                                    <div class="tooltip-wrapper" data-placement="bottom" data-toggle="tooltip" title="Common Core Standards">
                                        <button class="btn" ng-class="classIf('active', map.getUi().currentTabIs(map.getUi().TAB_ID_STANDARDS))" ng-click="map.getUi().toggleTab(map.getUi().TAB_ID_STANDARDS)" ng-disabled="map.getUi().disableTab(map.getUi().TAB_ID_STANDARDS)" type="button">
                                            <i class="icon icon-standards"></i>
                                        </button>
                                    </div>
                                    <!-- ngIf: userIsAdmin -->
                                    <button class="btn ng-scope" ng-click="toggleShowTests()" ng-if="userIsAdmin" title="TESTS" type="button">
                                        <i class="icon icon-tests"></i>
                                    </button>
                                    <!-- end ngIf: userIsAdmin -->
                                    <!-- ngIf: userIsAdmin -->
                                    <button class="btn ng-scope" ng-click="toggleShowModel()" ng-if="userIsAdmin" title="MODEL" type="button">
                                        <i class="icon icon-model"></i>
                                    </button>
                                    <!-- end ngIf: userIsAdmin -->
                                </div>
                            </div>
                        </div>
                        <!-- top presenter toolbar -->
                        <div id="presenter-toolbar-top">

                            <!-- nav buttons (top) -->
                            <!-- ngIf: map.getUi().currentTabIs(map.getUi().TAB_ID_PRESENTER) && !map.getPresenter().isPresenting -->

                        </div>
                        <!-- /presenter-toolbar-top -->

                    </div>
                    <div id="diagram">
                        
                    </div>
                    <div id="generator-tab" ng-controller="GeneratorCtrl" ng-show="map.getUi().currentTabIs(map.getUi().TAB_ID_GENERATOR)" class="ng-scope ng-hide">
                        <div class="tab-close-button">
                            <button class="close" ng-click="map.getUi().closeTab(map.getUi().TAB_ID_GENERATOR)" type="button">×</button>
                        </div>
                        <h2 class="tab-title ng-scope" tooltip="ThinkQuery is a powerful tool to help you ask better, deeper questions than just Who, What, When, Where, Why. It gives you all the tools you need to ask deeper questions about any topic. Every question can be mapped with the click of a button. And, it's as easy as doing a Google search. Enter your ThinkQuery above." tooltip-placement="bottom">ThinkQuery</h2>
                        <div id="inputs">
                            <input ng-model="concept1" placeholder="Enter any word or concept" type="text" class="ng-pristine ng-valid" />
                                <input ng-model="concept2" placeholder="Optional: Enter any word or concept" type="text" class="ng-pristine ng-valid" />
                                    <button class="btn" id="swap" ng-click="swapConcepts()" type="button">Swap</button>
                                    <div id="select-prompt" ng-show="sandbox &amp;&amp; (concept1 || concept2)" class="ng-hide">Select a query below...</div>
                                    <button class="btn" ng-click="mapIt(selectedQuestion)" ng-disabled="!selectedQuestion" ng-show="!sandbox" type="button" disabled="disabled">Map IT!</button>
                                    <button class="btn ng-hide" ng-click="surpriseMe()" ng-show="concept1 || concept2" type="button">Surprise Me!</button>
                        </div>
                        <div id="questions" ng-show="concept1 || concept2" class="ng-hide">
                            <h4 class="iconD">Distinctions</h4>
                            <div class="question-list">
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.WHAT_IS)" ng-click="selectQuestion(queries.WHAT_IS)">
                                    <div class="question-number">1</div>
                                    <div class="generator-text">
                                        What is <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div>?
                                    </div>
                                </div>
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.WHAT_IS_NOT)" ng-click="selectQuestion(queries.WHAT_IS_NOT)">
                                    <div class="question-number">2</div>
                                    <div class="generator-text">
                                        What is-not&nbsp;<div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div>?
                                    </div>
                                </div>
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.DISTINGUISH_BETWEEN)" ng-click="selectQuestion(queries.DISTINGUISH_BETWEEN)">
                                    <div class="question-number">3</div>
                                    <div class="generator-text" data-skip="true">
                                        How would you distinguish between <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div> and&nbsp;<div class="concept-echo ng-binding" ng-bind="echoConcept2()">...</div>?
                                    </div>
                                </div>
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.COMPARE_CONTRAST)" ng-click="selectQuestion(queries.COMPARE_CONTRAST)">
                                    <div class="question-number">4</div>
                                    <div class="generator-text" data-skip="true">
                                        Can you compare and contrast <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div> and <div class="concept-echo ng-binding" ng-bind="echoConcept2()">...</div>?
                                    </div>
                                </div>
                            </div>
                            <h4 class="iconS">Systems</h4>
                            <div class="question-list">
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.PARTS_OF)" ng-click="selectQuestion(queries.PARTS_OF)">
                                    <div class="question-number">5</div>
                                    <div class="generator-text" data-skip="true">
                                        What are the parts of <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div>?
                                    </div>
                                </div>
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.PART_OF)" ng-click="selectQuestion(queries.PART_OF)">
                                    <div class="question-number">6</div>
                                    <div class="generator-text">
                                        What is <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div> a part of?
                                    </div>
                                </div>
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.PARTS_HAVE_PARTS)" ng-click="selectQuestion(queries.PARTS_HAVE_PARTS)">
                                    <div class="question-number">7</div>
                                    <div class="generator-text" data-skip="true">
                                        Can you name some of the parts of the parts of <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div> ?
                                    </div>
                                </div>
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.R_PARTS)" ng-click="selectQuestion(queries.R_PARTS)">
                                    <div class="question-number">8</div>
                                    <div class="generator-text" data-skip="true">
                                        What are the parts of the relationship between <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div> and <div class="concept-echo ng-binding" ng-bind="echoConcept2()">...</div>?
                                    </div>
                                </div>
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.P_PARTS)" ng-click="selectQuestion(queries.P_PARTS)">
                                    <div class="question-number">9</div>
                                    <div class="generator-text" data-skip="true">
                                        What are the parts of <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div> when looked at from the viewpoint of <div class="concept-echo ng-binding" ng-bind="echoConcept2()">...</div>?
                                    </div>
                                </div>
                            </div>
                            <h4 class="iconR">Relationships</h4>
                            <div class="question-list">
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.RS_TO_AND_BY)" ng-click="selectQuestion(queries.RS_TO_AND_BY)">
                                    <div class="question-number">10</div>
                                    <div class="generator-text" data-skip="true">
                                        What ideas are related <em>to </em><div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div> and what ideas are related <em>by </em><div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div>?
                                    </div>
                                </div>
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.WHAT_IS_R)" ng-click="selectQuestion(queries.WHAT_IS_R)">
                                    <div class="question-number">11</div>
                                    <div class="generator-text" data-skip="true">
                                        What idea relates <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div> and <div class="concept-echo ng-binding" ng-bind="echoConcept2()">...</div>?
                                    </div>
                                </div>
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.PART_RS_ARE)" ng-click="selectQuestion(queries.PART_RS_ARE)">
                                    <div class="question-number">12</div>
                                    <div class="generator-text" data-skip="true">
                                        How are the parts of <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div> related?
                                    </div>
                                </div>
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.PART_RS_EXIST)" ng-click="selectQuestion(queries.PART_RS_EXIST)">
                                    <div class="question-number">13</div>
                                    <div class="generator-text" data-skip="true">
                                        How are the parts of <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div> related to the parts of <div class="concept-echo ng-binding" ng-bind="echoConcept2()">...</div>?
                                    </div>
                                </div>
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.RS_WITH_OTHERS)" ng-click="selectQuestion(queries.RS_WITH_OTHERS)">
                                    <div class="question-number">14</div>
                                    <div class="generator-text" data-skip="true">
                                        What are the relationships among  <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div> and <div class="concept-echo ng-binding" ng-bind="echoConcept2()">...</div> and other things?
                                    </div>
                                </div>
                            </div>
                            <h4 class="iconP">Perspectives</h4>
                            <div class="question-list">
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.PARTS_OF_P)" ng-click="selectQuestion(queries.PARTS_OF_P)">
                                    <div class="question-number">15</div>
                                    <div class="generator-text" data-skip="true">
                                        What are the parts of the viewpoint   <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div> when looking at <div class="concept-echo ng-binding" ng-bind="echoConcept2()">...</div>?
                                    </div>
                                </div>
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.POINT_FOR)" ng-click="selectQuestion(queries.POINT_FOR)">
                                    <div class="question-number">16</div>
                                    <div class="generator-text">
                                        How are <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div> and <div class="concept-echo ng-binding" ng-bind="echoConcept2()">...</div> related when looking at them from a new perspective?
                                    </div>
                                </div>
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.HAS_MULTIPLE_PS)" ng-click="selectQuestion(queries.HAS_MULTIPLE_PS)">
                                    <div class="question-number">17</div>
                                    <div class="generator-text">
                                        Can you think of <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div> from multiple perspectives?
                                    </div>
                                </div>
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.PARTS_FROM_MULTIPLE_PS)" ng-click="selectQuestion(queries.PARTS_FROM_MULTIPLE_PS)">
                                    <div class="question-number">18</div>
                                    <div class="generator-text" data-skip="true">
                                        What are the parts of <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div> when looked at from multiple viewpoints?
                                    </div>
                                </div>
                            </div>
                            <h4 class="iconD iconS iconR iconP">D + S + R + P</h4>
                            <div class="question-list">
                                <div class="question" ng-class="classIf('selected', selectedQuestion == queries.WHAT_ABOUT)" ng-click="selectQuestion(queries.WHAT_ABOUT)">
                                    <div class="question-number">19</div>
                                    <div class="generator-text" data-skip="true">
                                        Tell me all you know about <div class="concept-echo ng-binding" ng-bind="echoConcept1()">...</div> by DRSP'ing it?
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="presenter-tab">

                        <!-- bottom presenter toolbar (for view only) -->
                        <!-- ngIf: map.getUi().currentTabIs(map.getUi().TAB_ID_PRESENTER) && map.getPresenter().isPresenting -->
                        <!-- / presenter-toolbar-bottom -->


                        <!-- slide sorter (thumbnails) -->
                        <div class="slide-sidebar ng-hide" ng-show="map.getPresenter().showSidebar()">

                            <div class="slides-list">
                                <!-- ngRepeat: nd in map.getPresenter().getSlideNodeDatas() track by nd.key -->
                            </div>

                        </div>
                        <!-- /slide-sidebar -->


                        <!-- slide display -->
                        <!-- ngRepeat: nd in map.getPresenter().getSlideNodeDatas() track by nd.key -->
                    </div>
                    <div id="navigator">
                        <div id="overview-diagram" ng-show="map.getUi().state.showNavigator" class="ng-hide" style="position: relative; -webkit-tap-highlight-color: rgba(255, 255, 255, 0);">
                            <canvas width="278" height="148" tabindex="0" style="position: absolute; top: 0px; left: 0px; z-index: 2; -webkit-user-select: none;" data-skip="true">This text is displayed if your browser does not support the Canvas HTML element.</canvas>
                            <div style="position: absolute; overflow: auto; width: 278px; height: 148px; z-index: 1;">
                                <div style="position: absolute; width: 1px; height: 1px;"></div>
                            </div>
                            <div style="position: absolute; overflow: auto; width: 278px; height: 148px; z-index: 1;">
                                <div style="position: absolute; width: 1px; height: 1px;"></div>
                            </div>
                        </div>
                        <div id="zoom-to-region-prompt" ng-show="map.getUi().zoomingToRegion" class="ng-hide">
                            <h4>Zoom to Region</h4>
                            <p data-skip="true">Click-hold and drag to select the region to zoom to.</p>
                            <button class="btn btn-mini" ng-click="map.getUi().toggleZoomingToRegion()" title="Cancel Zoom to Region" type="button">Cancel</button>
                        </div>
                    </div>
                    <div id="export-image-popup" ng-show="showImageExport" class="ng-hide">
                        <div class="tab-close-button">
                            <button class="close" ng-click="showImageExport = false" type="button">×</button>
                        </div>
                        <h2>Export Image</h2>
                        <div class="instructions ng-hide" ng-show="!imageExportLoading" data-skip="true">To save an image of this map to your computer, right-click on the image below and select the Save Image command from your browser's pop-up menu.</div>
                        <div id="export-image-wrapper">
                            <div id="export-image">
                                <div id="loading" ng-show="imageExportLoading" class="">Generating Image...</div>
                            </div>
                        </div>
                    </div>
                    <div id="tests" ng-show="showTests" class="ng-hide">
                        <h2>Tests</h2>
                        <!-- ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding">Reset map</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions"></div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding">Create Sister</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions"></div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding">Create R to Sister</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions"></div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding">Create Child</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions"></div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">Create 3 children and switch to freehand</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions"></div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">Drag RTBB into outline S</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Drag the preselected RTBB into Whole (S), then do an Undo</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">Drag RTBB into freehand S</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Drag the preselected RTBB into Whole (S) and examine layout</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">Create RTBB in outline and switch to freehand</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Check auto-generated freehand layout of parts</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">Drag RTBB out of S</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Drag the preselected RTBB onto Whole (D)</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">Drag RTBB out of freehand S</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Drag the preselected RTBB onto Whole (D)</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">Drag RTBB out of 2nd level S</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Drag the preselected RTBB onto Whole (D) of Part 1</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">Drag RTBB out of 2nd level freehand S</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Drag the preselected RTBB onto Whole (D) of Part 1</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding">Rchannel</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Note that R-things are in part-whole relation</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">Disappearing parts on new idea creation</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Create a new top-level idea - Part 1.1 should not disappear temporarily</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">Drag top-level thing into freehand system</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Drag New Part into Whole; examine resulting part layout</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">Drag top-level RTBB into freehand system</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Drag preselected RTBB into Whole; examine resulting part layout</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">Drag R-thing square into freehand system</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Drag preselected square into Whole; examine resulting part layout</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">Drag R-thing square out of freehand system</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Drag preselected square onto D of Whole; examine resulting layout</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">Drag 2nd level part to D of parent</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Drag Subpart 1.1 onto D of Part 1; it should appear below Part 1</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">Invisible R-thing in 2nd level of outline</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">R-thing between Subparts 1.1 and 1.2 should be visible</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">R-thing between ideas in same location (error)</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">This should trigger an error</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding">Drag to create R-line</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Drag from the R-corner of Thing1 to Thing2; temporary drag line and square should be R-color; created line should be an R-line</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding">Drag to create P-line</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Drag from the P-corner of Thing1 to Thing2; temporary drag line and square should be P-color; created line should be a P-line</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding">Relink from-port of R-line</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Move the start of the R-link from Thing 1 to Thing 3; make sure it does not turn into a P-link</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding">Relink to-port of R-line</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Move the end of the R-link from Thing 2 to Thing 3; make sure it does not turn into a P-link</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                        <div class="test ng-scope" ng-repeat="test in map.getTests().tests">
                            <span class="test-status not-run ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_NOT_RUN"></span>
                            <span class="test-status passed ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_PASSED"></span>
                            <span class="test-status examine ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_EXAMINE"></span>
                            <span class="test-status failed ng-scope ng-hide" ng-show="test.status == map.getTests().TEST_STATUS_FAILED" popover="" popover-placement="right" popover-trigger="mouseenter"></span>
                            <button ng-click="map.getTests().runTest(test.name)" ng-style="" type="button" class="ng-binding" data-skip="true">Showing parts of parts of a freehand whole</button>
                            <div class="test-instructions ng-binding ng-hide" ng-show="map.getTests().currentTest == test &amp;&amp; test.instructions" data-skip="true">Whole, Part 1 and Subpart 1.1 should all be visible</div>
                        </div>
                        <!-- end ngRepeat: test in map.getTests().tests -->
                    </div>
                    <div id="model-debug" ng-show="showModel" class="ng-hide">
                        <strong>Model</strong>
                        <button ng-click="map.loadModel()" type="button">Capture</button>
                        <button ng-click="map.saveModel()" type="button">Render</button>
                        <br/>
                            <textarea id="map-model-debug"></textarea>
                    </div>
                    <div id="help-tip" ng-show="map.getUi().helpTip != null" class="ng-hide">
                        <div class="iconHelp ng-hide" id="help-canvasTip" ng-show="map.getUi().helpTip == 'canvasTip'" data-skip="true">
                            <strong>Canvas: </strong>Double-click to create a new idea — Mouse over an idea to reveal basic functions.
                        </div>
                        <div class="iconHelp ng-hide" id="help-thingTip" ng-show="map.getUi().helpTip == 'thingTip'" data-skip="true">
                            <strong>Idea: </strong>To edit text, double-click on the label — To see more help tips, click on any colored corner.
                        </div>
                        <div class="iconHelp ng-hide" id="help-relationshipTip" ng-show="map.getUi().helpTip == 'relationshipTip'" data-skip="true">
                            <strong>Relationship line: </strong>Double-click to add a new idea to the relationship — Use the toolbar to add arrows.
                        </div>
                        <div class="iconD ng-hide" id="help-cornerDTip" ng-show="map.getUi().helpTip == 'cornerDTip'" data-skip="true">
                            <strong>Red corner (D): </strong>Double-click to create a new idea — Right-click to mark with a distinction flag.
                        </div>
                        <div class="iconS ng-hide" id="help-cornerSTip" ng-show="map.getUi().helpTip == 'cornerSTip'" data-skip="true">
                            <strong>Green corner (S): </strong>Double-click to add a part — Single-click to show/hide parts.
                        </div>
                        <div class="iconR ng-hide" id="help-cornerRTip" ng-show="map.getUi().helpTip == 'cornerRTip'" data-skip="true">
                            <strong>Blue corner (R): </strong>Double-click to create a new related idea — Drag to relate to an existing idea.
                        </div>
                        <div class="iconP ng-hide" id="help-cornerPTip" ng-show="map.getUi().helpTip == 'cornerPTip'" data-skip="true">
                            <strong>Orange corner (P): </strong>Drag to create a perspective — Double-click to open Perspective Editor.
                        </div>
                    </div>
                    <div id="tutorial">
                        <div class="cover"></div>
                        <div id="tutorial-box">
                            
                        </div>
                    </div>
                    <div id="attachments-tab" ng-show="map.getUi().currentTabIs(map.getUi().TAB_ID_ATTACHMENTS)" class="ng-hide">

                        <!-- close button -->
                        <div class="tab-close-button">
                            <button type="button" class="close" ng-click="map.getUi().closeTab(map.getUi().TAB_ID_ATTACHMENTS)">×</button>
                        </div>

                        <h2 class="tab-title">Attachments</h2>

                        <!-- ngRepeat: type in map.getAttachments().attachmentTypes -->
                        <div class="attachment-list ng-scope attachments-type-note" ng-repeat="type in map.getAttachments().attachmentTypes" ng-class="'attachments-type-' + type.name">
                            <h4 class="ng-binding">Notes</h4>
                            <div class="item-actions">
                                <!-- add item button -->
                                <button type="button" class="btn btn-mini add-item" ng-click="map.getAttachments().addAttachment(type.name)" ng-disabled="!canEdit || map.getAttachments().editingAnItem()">
                                    Add Item
                                </button>
                            </div>
                            <div class="item-list">
                                <ul>
                                    <!-- ngRepeat: att in map.getAttachments().listAttachments(type.name) -->
                                </ul>
                            </div>
                        </div>
                        <!-- end ngRepeat: type in map.getAttachments().attachmentTypes -->
                        <div class="attachment-list ng-scope attachments-type-link" ng-repeat="type in map.getAttachments().attachmentTypes" ng-class="'attachments-type-' + type.name">
                            <h4 class="ng-binding">Web Links</h4>
                            <div class="item-actions">
                                <!-- add item button -->
                                <button type="button" class="btn btn-mini add-item" ng-click="map.getAttachments().addAttachment(type.name)" ng-disabled="!canEdit || map.getAttachments().editingAnItem()">
                                    Add Item
                                </button>
                            </div>
                            <div class="item-list">
                                <ul>
                                    <!-- ngRepeat: att in map.getAttachments().listAttachments(type.name) -->
                                </ul>
                            </div>
                        </div>
                        <!-- end ngRepeat: type in map.getAttachments().attachmentTypes -->
                        <div class="attachment-list ng-scope attachments-type-task" ng-repeat="type in map.getAttachments().attachmentTypes" ng-class="'attachments-type-' + type.name">
                            <h4 class="ng-binding">Tasks</h4>
                            <div class="item-actions">
                                <!-- add item button -->
                                <button type="button" class="btn btn-mini add-item" ng-click="map.getAttachments().addAttachment(type.name)" ng-disabled="!canEdit || map.getAttachments().editingAnItem()">
                                    Add Item
                                </button>
                            </div>
                            <div class="item-list">
                                <ul>
                                    <!-- ngRepeat: att in map.getAttachments().listAttachments(type.name) -->
                                </ul>
                            </div>
                        </div>
                        <!-- end ngRepeat: type in map.getAttachments().attachmentTypes -->
                        <div class="attachment-list ng-scope attachments-type-map" ng-repeat="type in map.getAttachments().attachmentTypes" ng-class="'attachments-type-' + type.name">
                            <h4 class="ng-binding">Linked MetaMaps</h4>
                            <div class="item-actions">
                                <!-- add item button -->
                                <button type="button" class="btn btn-mini add-item" ng-click="map.getAttachments().addAttachment(type.name)" ng-disabled="!canEdit || map.getAttachments().editingAnItem()">
                                    Add Item
                                </button>
                            </div>
                            <div class="item-list">
                                <ul>
                                    <!-- ngRepeat: att in map.getAttachments().listAttachments(type.name) -->
                                </ul>
                            </div>
                        </div>
                        <!-- end ngRepeat: type in map.getAttachments().attachmentTypes -->

                    </div>
                    <div id="editor-footer">
                        <!-- display MAP analytics, which are calculated on the server and are connected with badges and points 
     - these have no connection with contextual (thing/R) analytics, even though they are displayed in a similar way. -->

                        <div id="analytics-tab-map" class="bottom-tab analytics-tab" ng-class="classIf('expanded', map.getUi().currentTabIs(map.getUi().TAB_ID_ANALYTICS_MAP))">
                            <div class="bottom-tab-inner">

                                <!-- close button -->
                                <div class="tab-close-button">
                                    <button type="button" class="close" ng-click="map.getUi().closeTab(map.getUi().TAB_ID_ANALYTICS_MAP)">×</button>
                                </div>

                                <!-- =================== analytics for MAP ======================= -->

                                <div>

                                    <div class="analytics-big-analytics">

                                        <div class="analytics-subject-wrapper">
                                            <!-- <a href="#" class="analytic-popover popover-top" data-toggle="popover" title="" -->
                                            <!-- data-content="Think better ideas by seeing what you've done, and what you could do ..."> -->
                                            <div id="analytics-big-analytics-map"></div>
                                            <div id="analytics-big-analytics-arrow"></div>
                                            <div class="analytics-map-analytics-intro">In this MetaMap...</div>
                                            <!-- </a> -->
                                        </div>

                                        <!-- IDEAS -->

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Note how many distinctly different ideas you've created.">
                                                <div class="big-analytic iconD">
                                                    <div class="big-analytic-prefix">
                                                        You made
                                                    </div>
                                                    <span class="big-analytic-value ng-binding">

                                                    </span>
                                                    <div class="big-analytic-suffix">
                                                        <ng-pluralize count="map.getAnalytics().mapAnalytics.COUNT_THINGS" when="{'one': 'idea!', 'other': 'ideas!'}"></ng-pluralize>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                        <!-- IDEAS into SYSTEMS -->

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Breaking your ideas into parts helps you to understand them better.">
                                                <div class="big-analytic iconD iconS">
                                                    <div class="big-analytic-prefix">
                                                        You made
                                                    </div>
                                                    <span class="big-analytic-value ng-binding">

                                                    </span>
                                                    <div class="big-analytic-suffix">
                                                        <ng-pluralize count="map.getAnalytics().mapAnalytics.COUNT_SYSTEMS" when="{'one': 'idea into a system!', 'other': 'ideas into systems!'}"></ng-pluralize>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                        <!-- RELATIONSHIPS -->

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="See how many ideas you've related on your map.">
                                                <div class="big-analytic iconR">
                                                    <div class="big-analytic-prefix">
                                                        You made
                                                    </div>
                                                    <span class="big-analytic-value ng-binding">

                                                    </span>
                                                    <div class="big-analytic-suffix">
                                                        <ng-pluralize count="map.getAnalytics().mapAnalytics.COUNT_RELATIONSHIPS" when="{'one': 'relationship!', 'other': 'relationships!'}"></ng-pluralize>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                        <!-- IDEAS into PERSPECTIVES -->

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Any idea can also be a viewpoint on other ideas.">
                                                <div class="big-analytic iconD iconP">
                                                    <div class="big-analytic-prefix">
                                                        You made
                                                    </div>
                                                    <span class="big-analytic-value ng-binding">

                                                    </span>
                                                    <div class="big-analytic-suffix">
                                                        <ng-pluralize count="map.getAnalytics().mapAnalytics.COUNT_PERSPECTIVES" when="{'one': 'idea into a viewpoint!', 'other': 'ideas into viewpoints!'}"></ng-pluralize>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                        <!-- RELATIONSHIPS into IDEAS -->

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Every relationship can also be a new idea.">
                                                <div class="big-analytic iconD iconR">
                                                    <div class="big-analytic-prefix">
                                                        You made
                                                    </div>
                                                    <span class="big-analytic-value ng-binding">

                                                    </span>
                                                    <div class="big-analytic-suffix">
                                                        <ng-pluralize count="map.getAnalytics().mapAnalytics.COUNT_RTHINGS" when="{'one': 'relationship into an idea!', 'other': 'relationships into ideas!'}"></ng-pluralize>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                        <!-- RELATIONSHIPS into SYSTEMS -->

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Ideas that are acting as relationships can also have parts.">
                                                <div class="big-analytic iconD iconS iconR">
                                                    <div class="big-analytic-prefix">
                                                        You made
                                                    </div>
                                                    <span class="big-analytic-value ng-binding">

                                                    </span>
                                                    <div class="big-analytic-suffix">
                                                        <ng-pluralize count="map.getAnalytics().mapAnalytics.COUNT_SYSTEM_RTHINGS" when="{'one': 'relationship into a system!', 'other': 'relationships into systems!'}"></ng-pluralize>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                        <!-- PERSPECTIVES into SYSTEMS -->

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Even viewpoints can be broken into parts.">
                                                <div class="big-analytic iconD iconS iconP">
                                                    <div class="big-analytic-prefix">
                                                        You made
                                                    </div>
                                                    <span class="big-analytic-value ng-binding">

                                                    </span>
                                                    <div class="big-analytic-suffix">
                                                        <ng-pluralize count="map.getAnalytics().mapAnalytics.COUNT_SYSTEM_PERSPECTIVES" when="{'one': 'viewpoint into a system!', 'other': 'viewpoints into systems!'}"></ng-pluralize>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                        <!-- Advanced DISTINCTIONS -->

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Gain clarity by making sure each idea is distinguished from other ideas.">
                                                <div class="big-analytic iconD">
                                                    <div class="big-analytic-prefix">
                                                        You made
                                                    </div>
                                                    <span class="big-analytic-value ng-binding">

                                                    </span>
                                                    <div class="big-analytic-suffix">
                                                        <ng-pluralize count="map.getAnalytics().mapAnalytics.COUNT_DISTINCTIONS" when="{'one': 'advanced distinction!', 'other': 'advanced distinctions!'}"></ng-pluralize>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                        <!-- display contextual analytics - these are related to an individual selected thing or relationship,
     and the machinery for calculating them is all done in analytics.js - even though it is displayed in 
     a similar format, it is not connected to the MAP analytics (calculated on the server), or badges or points.  -->

                        <div id="analytics-tab-thing" class="bottom-tab analytics-tab" ng-class="classIf('expanded', map.getUi().currentTabIs(map.getUi().TAB_ID_ANALYTICS_THING))">
                            <div class="bottom-tab-inner">

                                <!-- close button -->
                                <div class="tab-close-button">
                                    <button type="button" class="close" ng-click="map.getUi().closeTab(map.getUi().TAB_ID_ANALYTICS_THING)">×</button>
                                </div>

                                <!-- =================== contextual analytics for THING ======================= -->

                                <div ng-show="!map.thingSelected() &amp;&amp; !map.relationshipSelected()" class="">
                                    <div id="analytics-nothing-selected" data-skip="true">
                                        Select an Idea or a Relationship to view analytics for it.
                                    </div>
                                </div>

                                <div ng-show="map.thingSelected()" class="ng-hide">

                                    <div class="analytics-big-analytics thing-analytics">

                                        <div class="analytics-subject-wrapper">
                                            <!--
          <a href="#" class="analytic-popover popover-top" data-toggle="popover" title="" 
            data-content="Think better ideas by seeing what you've done, and what you could do ...">
            -->
                                            <div class="analytics-current-thing">
                                                <span class="ng-binding"></span>
                                            </div>
                                            <div class="analytics-thing-intro">is...</div>
                                            <div id="analytics-big-analytics-arrow"></div>
                                            <!-- </a> -->
                                        </div>

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="It is implied that every idea is distinct from every other idea.">
                                                <div class="big-analytic iconD">
                                                    <div class="big-analytic-prefix">
                                                        Distinct from
                                                    </div>
                                                    <span class="big-analytic-value ng-binding">
                                                        0
                                                    </span>
                                                    <div class="big-analytic-suffix">
                                                        <ng-pluralize count="map.getAnalytics().contextualAnalytics.distinctFrom" when="{'one': 'other idea', 'other': 'other ideas'}">other ideas</ng-pluralize>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Making distinctions explicit is an advanced skill used for construct validity.">
                                                <div class="big-analytic iconD">
                                                    <div class="big-analytic-prefix">
                                                        Distinct from
                                                    </div>
                                                    <span class="big-analytic-value ng-binding">
                                                        0
                                                    </span>
                                                    <div class="big-analytic-suffix">
                                                        <ng-pluralize count="map.getAnalytics().contextualAnalytics.intentionallyDistinctFrom" when="{'one': 'other idea (advanced)', 'other': 'other ideas (advanced)'}">other ideas (advanced)</ng-pluralize>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Every idea can be part of a larger idea.">
                                                <div class="big-analytic iconS">
                                                    <div class="big-analytic-prefix">
                                                        Part of
                                                    </div>
                                                    <span class="big-analytic-value ng-binding">
                                                        0
                                                    </span>
                                                    <div class="big-analytic-suffix">
                                                        <ng-pluralize count="map.getAnalytics().contextualAnalytics.partOf" when="{'one': 'whole system', 'other': 'whole systems'}">whole systems</ng-pluralize>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Every idea can have parts, making it a whole.">
                                                <div class="big-analytic iconS">
                                                    <div class="big-analytic-prefix">
                                                        A whole with
                                                    </div>
                                                    <span class="big-analytic-value ng-binding">
                                                        0
                                                    </span>
                                                    <div class="big-analytic-suffix">
                                                        <ng-pluralize count="map.getAnalytics().contextualAnalytics.includesParts" when="{'one': 'part', 'other': 'parts'}">parts</ng-pluralize>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Every idea can be related to other ideas.">
                                                <div class="big-analytic iconR">
                                                    <div class="big-analytic-prefix">
                                                        Related to
                                                    </div>
                                                    <span class="big-analytic-value ng-binding">
                                                        0
                                                    </span>
                                                    <div class="big-analytic-suffix">
                                                        <ng-pluralize count="map.getAnalytics().contextualAnalytics.relatedTo" when="{'one': 'other idea', 'other': 'other ideas'}">other ideas</ng-pluralize>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Ideas can act as a relationship between other ideas, too.">
                                                <div class="big-analytic iconR">
                                                    <div class="big-analytic-prefix">
                                                        Relates
                                                    </div>
                                                    <span class="big-analytic-value ng-binding">

                                                    </span>
                                                    <div class="big-analytic-suffix">
                                                        ideas <!-- this is always 0 or 2 -->
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Every idea can be a point of view on other ideas.">
                                                <div class="big-analytic iconP">
                                                    <div class="big-analytic-prefix">
                                                        A point on
                                                    </div>
                                                    <span class="big-analytic-value ng-binding">
                                                        0
                                                    </span>
                                                    <div class="big-analytic-suffix">
                                                        <ng-pluralize count="map.getAnalytics().contextualAnalytics.lookingAt" when="{'one': 'view', 'other': 'views'}">views</ng-pluralize>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Every idea can be looked at differently from the point of view of other ideas.">
                                                <div class="big-analytic iconP">
                                                    <div class="big-analytic-prefix">
                                                        Viewed from
                                                    </div>
                                                    <span class="big-analytic-value ng-binding">
                                                        0
                                                    </span>
                                                    <div class="big-analytic-suffix">
                                                        <ng-pluralize count="map.getAnalytics().contextualAnalytics.lookedAtFrom" when="{'one': 'point of view', 'other': 'points of view'}">points of view</ng-pluralize>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                    </div>

                                </div>

                                <!-- =================== contextual analytics for RELATIONSHIP ======================= -->

                                <div ng-show="map.relationshipSelected()" class="ng-hide">

                                    <div class="analytics-big-analytics relationship-analytics">


                                        <div class="analytics-subject-wrapper">
                                            <!-- <a href="#" class="analytic-popover popover-top" data-toggle="popover" title="" data-content="Think better ideas by seeing what you've done, and what you could do ..."> -->
                                            <div class="analytics-subject analytics-relationship-intro">This relationship...</div>

                                            <div class="analytics-subject-relationship-model">
                                                <div class="analytics-subject-relationship-from-thing">
                                                    <span class="ng-binding"></span>
                                                </div>
                                                <div class="analytics-subject-relationship-connector"></div>
                                                <div class="analytics-subject-relationship-from-thing">
                                                    <span class="ng-binding"></span>
                                                </div>
                                                <div id="analytics-big-analytics-arrow"></div>
                                            </div>
                                            <!-- </a> -->
                                        </div>



                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Every relationship can be made into a distinct idea!">

                                                <div class="big-analytic iconD">
                                                    <div class="big-analytic-prefix">Converted to an idea?</div>

                                                    <div class="true ng-hide" ng-show="map.getAnalytics().contextualAnalytics.isRThing">
                                                        <div class="big-analytic-relationship-graphic">
                                                            <div class="thing-left thing"></div>
                                                            <div class="thing-connector converted-thing-true"></div>
                                                            <div class="thing-right thing"></div>
                                                        </div>
                                                        <span class="big-analytic-result">Yes</span>
                                                    </div>

                                                    <div class="false" ng-hide="map.getAnalytics().contextualAnalytics.isRThing">
                                                        <div class="big-analytic-relationship-graphic">
                                                            <div class="thing-left thing"></div>
                                                            <div class="thing-connector converted-thing-false"></div>
                                                            <div class="thing-right thing"></div>
                                                        </div>
                                                        <span class="big-analytic-result">No</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Once you've made your relationship into an idea, you can add parts...">

                                                <div class="big-analytic iconD">
                                                    <div class="big-analytic-prefix">Converted to a system?</div>

                                                    <div class="true ng-hide" ng-show="map.getAnalytics().contextualAnalytics.isRSystem">
                                                        <div class="big-analytic-relationship-graphic">
                                                            <div class="thing-left thing"></div>
                                                            <div class="thing-connector converted-system-true">
                                                                <div class="child-left"></div>
                                                                <div class="child-right"></div>
                                                            </div>
                                                            <div class="thing-right thing"></div>
                                                        </div>
                                                        <span class="big-analytic-result">Yes</span>
                                                    </div>

                                                    <div class="false" ng-hide="map.getAnalytics().contextualAnalytics.isRSystem">
                                                        <div class="big-analytic-relationship-graphic">
                                                            <div class="thing-left thing"></div>
                                                            <div class="thing-connector converted-system-false"></div>
                                                            <div class="thing-right thing"></div>
                                                        </div>
                                                        <span class="big-analytic-result">No</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>

                                        <div class="big-analytic-wrapper">
                                            <a href="#" class="analytic-popover popover-top ng-scope" popover-trigger="mouseenter" popover-placement="top" popover="Once you've made your relationship into an idea, you can make it a viewpoint, too.">

                                                <div class="big-analytic iconD">
                                                    <div class="big-analytic-prefix">Converted to a viewpoint?</div>

                                                    <div class="true ng-hide" ng-show="map.getAnalytics().contextualAnalytics.isRPoint">
                                                        <div class="big-analytic-relationship-graphic">
                                                            <div class="thing-left thing"></div>
                                                            <div class="thing-connector converted-view-true">
                                                                <div class="child-perspective"></div>
                                                            </div>
                                                            <div class="thing-right thing"></div>
                                                        </div>
                                                        <span class="big-analytic-result">Yes</span>

                                                    </div>

                                                    <div class="false" ng-hide="map.getAnalytics().contextualAnalytics.isRPoint">
                                                        <div class="big-analytic-relationship-graphic">
                                                            <div class="thing-left thing"></div>
                                                            <div class="thing-connector converted-view-false"></div>
                                                            <div class="thing-right thing"></div>
                                                        </div>
                                                        <span class="big-analytic-result">No</span>
                                                    </div>

                                                </div>
                                            </a>
                                        </div>


                                    </div>

                                </div>
                            </div>
                        </div>
                        <div id="perspectives-tab" class="bottom-tab" ng-class="classIf('expanded', map.getUi().currentTabIs(map.getUi().TAB_ID_PERSPECTIVES))">
                            <div class="bottom-tab-inner">

                                <!-- close button -->
                                <div class="tab-close-button">
                                    <button type="button" class="close" ng-click="map.getUi().closeTab(map.getUi().TAB_ID_PERSPECTIVES)">×</button>
                                </div>

                                <div class="btn-group">
                                    <button type="button" class="btn" id="make-perspective-button" ng-click="map.getUi().closeTab(map.getUi().TAB_ID_PERSPECTIVES)">Done. Make a Perspective</button>
                                </div>

                                <h2>Create a Perspective</h2>
                                <div class="body-text" data-skip="true">
                                    You have selected the "point" of a Perspective. Now select one or more ideas that make up the "view"
                                    of the perspective (every Perspective is made up of a point and a view). Select a thing or control-select
                                    or drag-select to choose multiple views. Select again to de-select. Then click the Make a Perspective button when done.
                                </div>

                            </div>
                        </div>


                        <div id="distinctions-tab" class="bottom-tab" ng-class="classIf('expanded', map.getUi().currentTabIs(map.getUi().TAB_ID_DISTINCTIONS))">
                            <div class="bottom-tab-inner">

                                <!-- close button -->
                                <div class="tab-close-button">
                                    <button type="button" class="close" ng-click="map.getUi().closeTab(map.getUi().TAB_ID_DISTINCTIONS)">×</button>
                                </div>

                                <div class="btn-group">
                                    <button type="button" class="btn" id="make-distinction-button" ng-click="map.getUi().closeTab(map.getUi().TAB_ID_DISTINCTIONS)">Done. Make a Distinction</button>
                                </div>

                                <h2>Make an [advanced] Distinction</h2>
                                <div class="body-text" data-skip="true">
                                    To distinguish this thing explicitly from one or more other things
                                    (every Distinction is made up of "thing" and "other"), select one or more things.
                                    Select a thing or control-select or drag-select to choose multiple "others".
                                    Select again to de-select.
                                    Then click the Make an Advanced Distinction button when done.
                                </div>

                            </div>
                        </div>

                        <div id="standards-tab" class="bottom-tab" ng-class="classIf('expanded', map.getUi().currentTabIs(map.getUi().TAB_ID_STANDARDS))">

                            <!-- close button -->
                            <div class="tab-close-button">
                                <button type="button" class="close" ng-click="map.getUi().closeTab(map.getUi().TAB_ID_STANDARDS)">×</button>
                            </div>

                            <h2 class="tab-title">Common Core Standards</h2>

                            <div class="item-actions">
                                <!-- add item button -->
                                <button type="button" class="btn btn-mini add-item popover-right ng-scope" popover-trigger="mouseenter" popover-placement="right" popover="Add new item" ng-click="ccsTagging.addLink()" ng-disabled="!canEdit || ccsTagging.editingAnItem()">
                                    Add Item
                                </button>
                            </div>

                            <div class="item-list">
                                <ul>
                                    <!-- ngRepeat: link in ccsTagging.links -->
                                </ul>
                            </div>
                            <!-- /item-list -->

                        </div>
                    </div>
                    <div id="presenter-print-view">

                        <!-- ngRepeat: nd in map.getPresenter().getSlideNodeDatas() track by nd.key -->
                    </div>
                </div>
            </div>
        </div>
    </div>

</page-content>