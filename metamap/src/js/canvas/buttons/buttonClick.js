let reactWatch = {};
let react = (map, part, target) => {
        target.clicks = target.clicks || 0;
        target.clicks += 1;
        let method = reactWatch[target.toString()];
        if (!method) {
                method = _.delay(() => {
                        let count = 1;
                        if (target.clicks > 1) {
                                count = 2;
                        }
                        target.clicks = 0
                        reactWatch[target.toString()] = null;
                        map.ui.handleCornerClick(part, target.part.adornedPart || target, count);
                }, 250);
                reactWatch[target.toString()] = method;
        }
}

module.exports = react;