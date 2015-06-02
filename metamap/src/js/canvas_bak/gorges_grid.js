
window.GorgesGrid = {};

// model for row selection 

GorgesGrid.RowSelection = function() {

    var self = this;

    this.selectAll = false;
    this.selectedRowIndexes = [];

    this.deselectAll = function() {
        self.selectedRowIndexes = [];
        self.selectAll = false;
    };

    this.toggleSelectAll = function(rowCount) {
        self.selectAll = !self.selectAll;
        if (self.selectAll) {
            for (var i = 0; i < rowCount; i++) {
                self.selectedRowIndexes[i] = true;
            }
        }
        else {
            self.deselectAll();
        }
    };

    this.selectedRowCount = function() {
        return _.filter(self.selectedRowIndexes, function(i) { return i === true; }).length;
    };
};

// model for view tree expansion

GorgesGrid.ViewTreeState = function() {
    
    var self = this;
    
    this.expandedViews = [];
    this.childSorts = {};

    this.toggleViewExpansion = function(viewName) {
        var i = _.indexOf(self.expandedViews, viewName);
        if (i != -1) {
            self.expandedViews.splice(i, 1);
        }
        else {
            self.expandedViews.push(viewName);
        }
    };

    this.expandView = function(viewName) {
        if (!self.viewIsExpanded(viewName))
            self.toggleViewExpansion(viewName);
    };

    this.collapseView = function(viewName) {
        if (self.viewIsExpanded(viewName))
            self.toggleViewExpansion(viewName);
    };

    this.viewIsExpanded = function(viewName) {
        return _.indexOf(self.expandedViews, viewName) != -1;
    };

    this.setChildSort = function(view, sort) {
        self.childSorts[view.name] = sort;
    };

    // returns the state saved herein if set, so the order doesn't change when the grid is refreshed
    this.getChildSort = function(view) {
        return self.childSorts[view.name] || view.childSort;
    };
};

// model for storing paging/sorting settings - see also listing_params.rb

GorgesGrid.ListingParams = function() {

    var self = this;

    this.page = 1; // NB: pages are 1-based
    this.pageSize = 100;
    this.sortBy = 'id';
    this.sortOrder = 'asc';
    this.viewName = '';
    this.filters = '';
    this.totalItems = 0;
    this.pageCount = 0;

    this.setSortBy = function(col) {
        if (self.sortBy === col) {
            self.sortOrder = (self.sortOrder === 'asc' ? 'desc' : 'asc');
        }
        else  {
            self.sortOrder = 'asc';
        }
        self.sortBy = col;
        self.page = 1;
    };

    // returns the current sort order if sortBy is set to the given column, else null
    this.getSortOrder = function(col) {
        if (self.sortBy === col) {
            return self.sortOrder;
        }
        else {
            return null;
        }
    };

    this.toQueryString = function() {
        return 'page=' + self.page +
              '&pageSize=' + self.pageSize +
              '&sortBy=' + self.sortBy +
              '&sortOrder=' + self.sortOrder +
              '&viewName=' + self.viewName +
              '&filter=' + self.filters +
              '&totalItems=' + self.totalItems +
              '&pageCount=' + self.pageCount;
    };
};