const go = window.go;

go.GraphObject.defineBuilder("CornerButton", function (args) {
    // default brushes for "Button" shape
    var buttonFillNormal = go.GraphObject.make(go.Brush, "Linear", { 0: "white", 1: "white" });
    var buttonStrokeNormal = "white";

    var buttonFillOver = go.GraphObject.make(go.Brush, "Linear", { 0: "white", 1: "white" });
    var buttonStrokeOver = "white";

    // offset identical to that needed to match the original RoundedRectangle figure, to keep the same size
    var offset = 0.001//2.761423749153968;

    var button =
      go.GraphObject.make(go.Panel, "Auto",
        {
            isActionable: false,
            fromLinkable: true,
            fromLinkableSelfNode: true,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableSelfNode: true,
            toLinkableDuplicates: true,
            portId: 'default'
        },  // needed so that the ActionTool intercepts mouse events
        { // save these values for the mouseEnter and mouseLeave event handlers
            "_buttonFillNormal": buttonFillNormal,
            "_buttonStrokeNormal": buttonStrokeNormal,
            "_buttonFillOver": buttonFillOver,
            "_buttonStrokeOver": buttonStrokeOver
        });

    // There"s no GraphObject inside the button shape -- it must be added as part of the button definition.
    // This way the object could be a TextBlock or a Shape or a Picture or arbitrarily complex Panel.

    // mouse-over behavior
    button.mouseEnter = function (e, button, prev) {
        var shape = button.findObject("ButtonBorder");  // the border Shape
        if (shape instanceof go.Shape) {
            var brush = button["_buttonFillOver"];
            button["_buttonFillNormal"] = shape.fill;
            shape.fill = brush;
            brush = button["_buttonStrokeOver"];
            button["_buttonStrokeNormal"] = shape.stroke;
            shape.stroke = brush;
        }
    };

    button.mouseLeave = function (e, button, prev) {
        var shape = button.findObject("ButtonBorder");  // the border Shape
        if (shape instanceof go.Shape) {
            shape.fill = button["_buttonFillNormal"];
            shape.stroke = button["_buttonStrokeNormal"];
        }
    };

    return button;
});