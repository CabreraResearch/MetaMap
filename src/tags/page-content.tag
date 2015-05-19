<page-content>

    <div class="page-content-wrapper">
        <div class="page-content">
            
            <div class="page-head">
                <div class="map-editor ng-scope" id="app-container" ng-controller="MapEditorCtrl">
                    <div id="map-menu-bar"></div>
                    <div id="main-toolbar" ng-show="!map.getPresenter().isPresenting" class=""></div>
                    <div id="diagram" style="-webkit-tap-highlight-color: rgba(255, 255, 255, 0);"></div>
                    <div id="generator-tab" ng-controller="GeneratorCtrl" ng-show="map.getUi().currentTabIs(map.getUi().TAB_ID_GENERATOR)" class="ng-scope ng-hide"></div>
                    <div id="presenter-tab"></div>
                    <div id="navigator">
                        <div id="overview-diagram" ng-show="map.getUi().state.showNavigator" class="ng-hide" style="position: relative; -webkit-tap-highlight-color: rgba(255, 255, 255, 0);"></div>
                        <div id="zoom-to-region-prompt" ng-show="map.getUi().zoomingToRegion" class="ng-hide"></div>
                    </div>
                    <div id="export-image-popup" ng-show="showImageExport" class="ng-hide"></div>
                    <div id="tests" ng-show="showTests" class="ng-hide"></div>
                    <div id="model-debug" ng-show="showModel" class="ng-hide"></div>
                    <div id="help-tip" ng-show="map.getUi().helpTip != null" class="ng-hide"></div>
                    <div id="tutorial"></div>
                    <div id="attachments-tab" ng-show="map.getUi().currentTabIs(map.getUi().TAB_ID_ATTACHMENTS)" class="ng-hide"></div>
                    <div id="editor-footer"></div>
                    <div id="presenter-print-view">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        

    </script>

</page-content>