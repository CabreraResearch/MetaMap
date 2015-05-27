const go = window.go;
const mk = go.GraphObject.make;

const dLinkTemplate = (map) =>
    mk(go.Link, {
        selectable: false
    },
         mk(go.Shape, {
             name: "LINKSHAPE",
             stroke: null
         })
    );

module.exports = dLinkTemplate;