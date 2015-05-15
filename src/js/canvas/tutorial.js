SandbankEditor.Tutorial = function () {

    /** like jQuery $() but starting from #tutorial */
    function $ui(sel) {
        return sel ? $('#tutorial').find(sel) : $('#tutorial');
    }

    /** current section number (div.tutorial-section) */
    var _section = 0;

    /** current card-number (div.tutorial-card) in the current section */
    var _card = 0;

    /** total number of sections */
    var NUM_SECTIONS = $ui('.tutorial-section').length;

    /** total number of cards in each section */
    var NUM_CARDS = $.map(
        $ui('.tutorial-section'),
        function(section) {
            return $(section).find('.tutorial-card').length;
        }
    );

    /** update the tutorial view */
    function _update() {
        $ui('.tutorial-card').hide();

        var $section = $ui('.tutorial-section').eq(_section),
            $card = $section.find('.tutorial-card').eq(_card);

        $ui().attr('class', $card.attr('data-class'));

        $ui('.prev-btn').toggle(_card > 0);
        $ui('.next-btn').toggle(_card < NUM_CARDS[_section]);

        var $progress = $ui('.tutorial-progress');

        $progress.find('.title').text($section.attr('data-title'));
        $progress.find('.card').text(_card + 1);
        $progress.find('.total').text(NUM_CARDS[_section]);

        $card.show('fast');
    }

    /** start the tutorial */
    function start(section, card) {
        _section = section || 0;
        _card = card || 0;
        _update();
        $ui().show();
    }

    /** button: go to the next card */
    function next() {
        if (_card + 1 === NUM_CARDS[_section]) {
            _card = 0;
            _section++;
        } else {
            _card++;
        }
        _update();
    }

    /** button: go to the previous card */
    function prev() {
        _card--;
        _update();
    }

    /** button: close the tutorial */
    function close() {
        $ui().hide('fast');
    }

    /** hook up the buttons */
    function _initControls() {
        function onclick(sel, fn) {
            $ui(sel).click(function () {
                fn.apply(this, arguments);
                return false;
            });
        }

        onclick('.prev-btn', prev);
        onclick('.next-btn, .start-btn', next);
        onclick('.skip-btn, .done-btn', close);
    }

    _initControls();

    // Public interface:

    this.start = start;

};
